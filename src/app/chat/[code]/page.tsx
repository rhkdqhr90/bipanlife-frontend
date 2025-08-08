// pages/chat/[code].tsx (수정된 코드)
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { joinChatRoom } from "@/lib/apis/joinChatRoom";
import { ChatMessageItemProps } from "@/types/chat";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { useChatSocket, BackendChatMessage, ChatMessage } from "@/hook/useChatSocket";
import { useUserStore } from "@/stores/userStore";
import clsx from "clsx";

interface ChatRoomInfo {
  title: string;
  createdAt: string;
  expiredAt: string;
  status: string;
}

// ✅ 1. 헬퍼 함수들을 컴포넌트 밖으로 이동
const convertBackendMessage = (msg: BackendChatMessage): ChatMessageItemProps => ({
  id: msg.id,
  senderId: msg.senderId,
  senderName: msg.senderName,
  content: msg.content,
  type: msg.type === "NOTICE" ? "NOTICE" : "TALK",
  sentAt: msg.sentAt,
  roomCode: msg.roomCode,
});

const convertLegacyMessage = (msg: ChatMessage): ChatMessageItemProps => ({
  senderId: parseInt(msg.sender, 10),
  senderName: msg.sender,
  content: msg.content,
  type: msg.type,
  sentAt: new Date().toISOString(),
  roomCode: msg.roomId,
});

export default function ChatRoomPage() {
  const { code } = useParams();
  const roomCode = typeof code === "string" ? code : (code?.[0] ?? "");
  const isComposingRef = useRef(false);
  const [roomInfo, setRoomInfo] = useState<ChatRoomInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessageItemProps[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasJoinedRef = useRef(false); // 🔒 중복 입장 방지용

  const userInfo = useUserStore(state => state.userInfo);

  // ✅ 2. useCallback으로 onMessage 콜백 함수를 안정화
  const onMessageReceived = useCallback((msg: BackendChatMessage | ChatMessage) => {
    console.log("📥 onMessage 수신:", msg);
    if ("id" in msg && "senderName" in msg) {
      const converted = convertBackendMessage(msg as BackendChatMessage);
      setMessages(prev => [...prev, converted]);
    } else {
      const converted = convertLegacyMessage(msg as ChatMessage);
      setMessages(prev => [...prev, converted]);
    }
  }, []); // 의존성 배열이 비어있으므로 이 함수는 재 생성되지 않습니다.

  // 소켓 연결 및 메시지 처리
  const { sendMessage, sendLegacyMessage, isConnected, isConnecting, connectionStatus, reconnect } =
    useChatSocket({
      roomCode,
      // ✅ 3. 안정화된 콜백 함수를 전달
      onMessage: onMessageReceived,
    });

  // (이하 나머지 코드는 동일)
  const fetchRoomAndJoin = useCallback(async () => {
    if (!userInfo?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // 채팅방 정보 조회
      const res = await fetch(`/api/chat/rooms/${roomCode}`);
      if (!res.ok) {
        throw new Error("채팅방을 찾을 수 없습니다.");
      }
      const data = await res.json();
      setRoomInfo(data);

      // 채팅방 입장 API 호출
      await joinChatRoom(roomCode, userInfo.id);

      // 기존 메시지 로드 (선택사항)
      try {
        const messagesRes = await fetch(`/api/chat/history/${roomCode}/messages`);
        if (messagesRes.ok) {
          const messagesData = await messagesRes.json();
          const convertedMessages = messagesData.map(convertBackendMessage);
          setMessages(convertedMessages);
        }
      } catch (msgError) {
        console.warn("기존 메시지 로드 실패:", msgError);
      }
    } catch (error) {
      console.error("❌ 입장 실패:", error);
      setError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [roomCode, userInfo?.id]);
  useEffect(() => {
    // ✅ roomCode, user 정보가 존재하고, WebSocket 연결 완료 후에만 실행
    if (!roomCode || !userInfo?.id || !isConnected) return;
    if (hasJoinedRef.current) return;

    hasJoinedRef.current = true;
    fetchRoomAndJoin(); // ✅ joinChatRoom() 실행 위치를 WebSocket 연결 후로 이동
  }, [roomCode, userInfo?.id, isConnected]);
  const isSendingRef = useRef(false);
  const handleSend = () => {
    if (isSendingRef.current) return;
    isSendingRef.current = true;

    if (!input.trim() || !userInfo?.id || !isConnected) {
      isSendingRef.current = false;
      return;
    }

    const messageToSend = input.trim();
    setInput("");

    const success = sendMessage(messageToSend, "TEXT");

    if (!success) {
      sendLegacyMessage({
        type: "TALK",
        roomId: roomCode,
        sender: userInfo.id.toString(),
        content: messageToSend,
      });
    }

    setTimeout(() => {
      isSendingRef.current = false;
    }, 100); // 중복 호출 방지용
  };
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto mt-16 px-4 flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">채팅방에 입장하는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-16 px-4 flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchRoomAndJoin}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!roomInfo) {
    return null;
  }

  return (
    <main className="max-w-3xl mx-auto mt-16 px-4 flex flex-col h-[80vh]">
      {/* 채팅방 정보 */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{roomInfo.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={clsx(
                "px-3 py-1 rounded-full text-xs font-medium",
                isConnected
                  ? "bg-green-100 text-green-800"
                  : isConnecting
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800",
              )}
            >
              {connectionStatus}
            </div>
            {!isConnected && !isConnecting && (
              <button
                onClick={reconnect}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                재연결
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          생성: {new Date(roomInfo.createdAt).toLocaleString()} | 종료 예정:{" "}
          {new Date(roomInfo.expiredAt).toLocaleString()}
        </p>
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="flex-1 min-h-0">
        <ChatMessageList messages={messages} myUserId={userInfo!.id} />
      </div>

      {/* 입력창 */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center gap-3">
          <input
            className={clsx(
              "flex-1 px-4 py-2 border rounded-full outline-none transition-colors",
              isConnected
                ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                : "border-red-300 bg-red-50",
            )}
            placeholder={
              isConnecting
                ? "연결 중..."
                : isConnected
                  ? "메시지를 입력하세요..."
                  : "연결이 끊어졌습니다"
            }
            value={input}
            onChange={e => setInput(e.target.value)}
            onCompositionStart={() => {
              isComposingRef.current = true;
            }}
            onCompositionEnd={() => {
              isComposingRef.current = false;
            }}
            onKeyDown={e => {
              if (isComposingRef.current) return; // 조합 중이면 Enter 무시
              if (e.key === "Enter") handleSend();
            }}
            disabled={!isConnected}
            maxLength={1000}
          />
          <button
            className={clsx(
              "px-6 py-2 rounded-full font-medium transition-colors",
              isConnected && input.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed",
            )}
            onClick={handleSend}
            disabled={!isConnected || !input.trim()}
          >
            전송
          </button>
        </div>
        {input.length > 900 && (
          <p className="text-xs text-gray-500 mt-1 text-right">{input.length}/1000</p>
        )}

        {!isConnected && (
          <p className="text-xs text-red-500 mt-2 text-center">
            연결이 끊어졌습니다. 메시지를 전송할 수 없습니다.
          </p>
        )}
      </div>
    </main>
  );
}
