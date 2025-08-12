"use client";
// app/chat/[code]/page.tsx

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { joinChatRoom } from "@/lib/apis/joinChatRoom";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useUserStore } from "@/stores/userStore";
import { apiFetch } from "@/lib/apis/apiFetch";
import clsx from "clsx";
import { useRouter } from "next/navigation";

interface ChatRoomInfo {
  title: string;
  createdAt: string;
  expiredAt: string;
  status: string;
}

interface BackendChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  roomCode: string;
  content: string;
  sentAt: string;
  type: "NOTICE" | "TEXT" | "VOTE";
}

interface ChatMessageItemProps {
  id?: number;
  senderId: number;
  senderName: string;
  content: string;
  type: "NOTICE" | "TALK" | "VOTE";
  sentAt: string;
  roomCode: string;
}

const convertBackendMessage = (msg: BackendChatMessage): ChatMessageItemProps => ({
  id: msg.id,
  senderId: msg.senderId,
  senderName: msg.senderName,
  content: msg.content,
  type: msg.type === "NOTICE" ? "NOTICE" : msg.type === "VOTE" ? "VOTE" : "TALK",
  sentAt: msg.sentAt,
  roomCode: msg.roomCode,
});

export default function ChatRoomPage() {
  const params = useParams();
  const roomCode = typeof params.code === "string" ? params.code : (params.code?.[0] ?? "");
  const router = useRouter();
  const { userInfo } = useUserStore.getState(); // 스토어 리렌더 최소화 (선호면 useUserStore(state=>state.userInfo) 써도 OK)
  const myUserId = userInfo?.id;

  const [roomInfo, setRoomInfo] = useState<ChatRoomInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessageItemProps[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 한글 조합 입력 방지용
  const isComposingRef = useRef(false);
  // 중복 join 방지
  const hasJoinedRef = useRef(false);
  // 전송 스로틀
  const isSendingRef = useRef(false);

  // 수신 콜백 (변하지 않도록 useCallback)
  const onMessageReceived = useCallback((msg: BackendChatMessage) => {
    // console.log("📥 수신:", msg);
    setMessages(prev => [...prev, convertBackendMessage(msg)]);
  }, []);

  const { sendMessage, disconnect, isConnected, isConnecting, connectionError } = useChatSocket({
    roomCode,
    onMessage: onMessageReceived,
  });

  // 방 정보 + 입장 + 히스토리 로딩
  const fetchRoomJoinAndHistory = useCallback(async () => {
    if (!roomCode || !myUserId) return;

    try {
      setIsLoading(true);
      setError(null);

      // 1) 방 정보
      const infoRes = await apiFetch(`/api/chat/rooms/${roomCode}`, { credentials: "include" });
      if (!infoRes.ok) throw new Error("채팅방을 찾을 수 없습니다.");
      const info = await infoRes.json();
      setRoomInfo(info);

      // 2) 입장 (공지 메시지는 서버에서 처리)
      await joinChatRoom(roomCode, myUserId);

      // 3) 히스토리 (Page 응답)
      const historyRes = await apiFetch(`/api/chat/history/${roomCode}/messages?page=0&size=50`, {
        credentials: "include",
      });
      if (historyRes.ok) {
        const page = await historyRes.json(); // {content, totalElements, ...}
        const list: BackendChatMessage[] = page.content ?? [];
        // 오래된→최신 순으로 표시하고 싶으면 reverse
        const converted = list.reverse().map(convertBackendMessage);
        setMessages(converted);
      }
    } catch (e) {
      console.error("❌ 입장/히스토리 실패:", e);
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [roomCode, myUserId]);

  // WebSocket 연결 완료 후 최초 1회만 입장/히스토리
  useEffect(() => {
    if (!roomCode || !myUserId || !isConnected) return;
    if (hasJoinedRef.current) return;
    hasJoinedRef.current = true;
    fetchRoomJoinAndHistory();
  }, [roomCode, myUserId, isConnected, fetchRoomJoinAndHistory]);

  // 페이지 떠날 때 소켓 정리
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const handleSend = () => {
    if (isSendingRef.current) return;
    isSendingRef.current = true;

    try {
      if (!isConnected) return;
      const text = input.trim();
      if (!text) return;

      setInput("");
      sendMessage(text, "TEXT");
    } finally {
      setTimeout(() => (isSendingRef.current = false), 120);
    }
  };

  const handleLeave = useCallback(async () => {
    if (!userInfo?.id) return;
    if (!confirm("채팅방에서 나가시겠습니까?")) return;

    try {
      // 1) 서버에 퇴장 알림 (백엔드가 공지 메시지 저장)
      await apiFetch(`/api/chat/rooms/${roomCode}/leave?userId=${userInfo.id}`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.warn("퇴장 API 실패(무시 가능):", e);
    } finally {
      // 2) 소켓 해제
      disconnect();
      // 3) 페이지 이동
      router.replace("/"); // 원하는 경로로 변경(예: "/")
    }
  }, [roomCode, userInfo?.id, disconnect, router]);

  // 로딩
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto mt-16 px-4 flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">채팅방에 입장하는 중...</p>
        </div>
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-16 px-4 flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchRoomJoinAndHistory}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
          {connectionError && <p className="text-xs text-gray-500 mt-2">WS: {connectionError}</p>}
        </div>
      </div>
    );
  }

  if (!roomInfo || !myUserId) return null;

  const connectionStatus = connectionError
    ? `오류: ${connectionError}`
    : isConnecting
      ? "연결 중..."
      : isConnected
        ? "연결됨"
        : "연결 끊김";

  return (
    <main className="max-w-3xl mx-auto mt-16 px-4 flex flex-col h-[80vh]">
      {/* 방 정보 */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">{roomInfo.title}</h1>
          <span
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
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          생성: {new Date(roomInfo.createdAt).toLocaleString()} | 종료 예정:{" "}
          {new Date(roomInfo.expiredAt).toLocaleString()}
        </p>
      </div>
      <button
        onClick={handleLeave}
        className="ml-auto mt-2 px-4 py-1.5 text-xs font-medium text-white 
             bg-red-500 hover:bg-red-600 active:bg-red-700 
             rounded-full shadow-sm transition-colors duration-150"
      >
        🚪 나가기
      </button>

      {/* 메시지 리스트 */}
      <div className="flex-1 min-h-0">
        <ChatMessageList messages={messages} myUserId={myUserId} />
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
            onCompositionStart={() => (isComposingRef.current = true)}
            onCompositionEnd={() => (isComposingRef.current = false)}
            onKeyDown={e => {
              if (isComposingRef.current) return;
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
