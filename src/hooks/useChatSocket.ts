/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface BackendChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  roomCode: string;
  content: string;
  sentAt: string;
  type: "NOTICE" | "TEXT" | "VOTE";
}
interface ChatMessageRequest {
  roomCode: string;
  content: string;
  type: "TEXT" | "NOTICE" | "VOTE";
}

export function useChatSocket({
  roomCode,
  onMessage,
}: {
  roomCode: string;
  onMessage: (msg: BackendChatMessage) => void;
}) {
  const clientRef = useRef<Client | null>(null);
  const onMessageRef = useRef(onMessage); // ★ onMessage 안정화
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const lastSentMessageRef = useRef<string | null>(null);

  // ★ 연결은 단 하나의 useEffect로, roomCode만 의존
  useEffect(() => {
    if (!roomCode) return;
    if (clientRef.current?.connected || isConnecting) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
    const socket = new SockJS(
      `${baseUrl}/api/chat/ws-chat`,
      null,
      { withCredentials: true } as any, // 타입 무시
    );
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);

        // 구독 (onMessageRef 사용)
        client.subscribe(`/topic/chat/${roomCode}`, (message: IMessage) => {
          try {
            const payload: BackendChatMessage = JSON.parse(message.body);
            console.log("📩 STOMP 수신 raw:", message.body);
            // 중복차단: 보낸 직후 돌아오는 에코 메시지 필터
            // if (payload.type === "TEXT") {
            //   const signature = JSON.stringify({
            //     content: payload.content,
            //     type: payload.type,
            //   });
            //   if (signature === lastSentMessageRef.current) {
            //     // console.log("⚠️ 중복 메시지 차단:", payload.content);
            //     return;
            //   }
            // }

            onMessageRef.current(payload);
          } catch (e) {
            console.error("❌ 메시지 파싱 오류:", e);
          }
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
        setIsConnecting(false);
      },
      onStompError: frame => {
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionError(frame.headers?.message || "STOMP 오류 발생");
      },
      onWebSocketError: () => {
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionError("WebSocket 오류");
      },
    });

    setIsConnecting(true);
    client.activate();
    clientRef.current = client;

    return () => {
      clientRef.current?.deactivate();
      clientRef.current = null;
      setIsConnected(false);
      setIsConnecting(false);
      // cleanup에서 setState 호출은 한 번씩만 일어나므로 루프 유발 X
    };
  }, [roomCode]); // ★ onMessage 넣지 않음

  const sendMessage = useCallback(
    (content: string, type: "TEXT" | "NOTICE" | "VOTE" = "TEXT") => {
      const client = clientRef.current;
      if (!client?.connected) {
        console.warn("❌ STOMP 미연결");
        return false;
      }

      try {
        const msg: ChatMessageRequest = { roomCode, content, type };
        // 보낼 때 서명 저장 → 에코 필터용
        lastSentMessageRef.current = JSON.stringify({ content, type });

        client.publish({
          destination: "/app/message",
          body: JSON.stringify(msg),
        });
        return true;
      } catch (e) {
        console.error("❌ 메시지 전송 실패:", e);
        return false;
      }
    },
    [roomCode],
  );

  const disconnect = useCallback(() => {
    clientRef.current?.deactivate();
    clientRef.current = null;
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  return {
    sendMessage,
    disconnect,
    isConnected,
    isConnecting,
    connectionError,
  };
}
