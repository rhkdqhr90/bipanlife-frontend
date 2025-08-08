/* eslint-disable @typescript-eslint/no-unused-vars */
// src/hooks/useChatSocket.ts
import { useEffect, useRef, useState, useCallback } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useUserStore } from "@/stores/userStore";

// 프론트엔드에서 보내는 메시지 (레거시)
export interface ChatMessage {
  type: "ENTER" | "TALK" | "EXIT";
  roomId: string;
  sender: string;
  content: string;
}

// 백엔드에서 받는 메시지 (ChatMessageResponseDto)
export interface BackendChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  roomCode: string;
  content: string;
  sentAt: string;
  type: "NOTICE" | "TEXT" | "VOTE";
}

// 백엔드로 보내는 메시지 (ChatMessageRequestDto)
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
  onMessage: (msg: BackendChatMessage | ChatMessage) => void;
}) {
  const clientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const userInfo = useUserStore(state => state.userInfo);
  const currentUserId = userInfo?.id ?? 0;
  const currentUserName = userInfo?.nickname ?? "익명";
  const lastSentMessageRef = useRef<string | null>(null);
  const enterSentRef = useRef(false);

  const currentUserIdRef = useRef(currentUserId);
  const currentUserNameRef = useRef(currentUserName);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
    currentUserNameRef.current = currentUserName;
  }, [currentUserId, currentUserName]);

  const connect = useCallback(() => {
    if (clientRef.current?.connected || isConnecting) return;

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
      const socket = new SockJS(`${baseUrl}/api/chat/ws-chat`);
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log("✅ WebSocket 연결됨");
          console.log("➡️ 구독 시작: ", `/topic/chat/${roomCode}`);
          setIsConnected(true);
          setIsConnecting(false);
          setConnectionError(null);
          reconnectAttempts.current = 0;

          const subscriptionTopic = `/topic/chat/${roomCode}`;
          client.subscribe(subscriptionTopic, (message: IMessage) => {
            try {
              const payload = JSON.parse(message.body);
              console.log("📩 받은 메시지:", payload);
              console.log("🧾 비교 기준:", {
                currentUserId: currentUserIdRef.current,
                lastSent: lastSentMessageRef.current,
                payloadSenderId: payload.senderId,
                payloadContent: payload.content,
              });
              if (
                payload.type === "TEXT" &&
                JSON.stringify({
                  senderId: payload.senderId,
                  content: payload.content,
                  type: payload.type,
                }) === lastSentMessageRef.current
              ) {
                console.log("⚠️ 중복 메시지 차단됨:", payload.content);
                return;
              }

              onMessage(payload);
            } catch (err) {
              console.error("❌ 메시지 파싱 오류:", err);
            }
          });

          if (!enterSentRef.current) {
            enterSentRef.current = true;
          }
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
        onWebSocketClose: event => {
          setIsConnected(false);
          setIsConnecting(false);
          if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            reconnectTimeoutRef.current = setTimeout(connect, 3000 * reconnectAttempts.current);
          }
        },
      });

      client.activate();
      clientRef.current = client;
    } catch (error) {
      setIsConnecting(false);
      setConnectionError("연결 실패");
    }
  }, [roomCode]);

  useEffect(() => {
    if (!roomCode || clientRef.current) return; // ✅ 중복 연결/구독 방지

    const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/ws-chat`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공");

        // ✅ 메시지 구독 (중복 방지)
        client.subscribe(`/topic/chat/${roomCode}`, message => {
          const body = JSON.parse(message.body);
          onMessage(body); // 여기서 onMessage가 2번 등록되면 또 문제
        });

        setIsConnected(true);
        setIsConnecting(false);
      },
      onStompError: frame => {
        console.error("❌ STOMP error:", frame);
      },
    });

    clientRef.current = client;
    client.activate();
    setIsConnecting(true);

    return () => {
      clientRef.current?.deactivate();
      clientRef.current = null;
      setIsConnected(false);
      setIsConnecting(false);
    };
  }, [roomCode, onMessage]);

  const sendMessage = useCallback(
    (content: string, type: "TEXT" | "NOTICE" | "VOTE" = "TEXT") => {
      if (!clientRef.current?.connected) {
        console.warn("❌ STOMP 클라이언트가 연결되지 않음");
        return false;
      }

      try {
        const message: ChatMessageRequest = { roomCode, content, type };
        lastSentMessageRef.current = content;

        console.log("📤 보내는 메시지:", message);

        clientRef.current.publish({
          destination: "/app/chat/message", // 백엔드 핸들러가 이 주소 받는지 확인 필요
          body: JSON.stringify(message),
        });

        return true;
      } catch (error) {
        console.error("❌ 메시지 전송 실패:", error);
        return false;
      }
    },
    [roomCode, currentUserId, currentUserName],
  );
  const sendLegacyMessage = useCallback((message: ChatMessage) => {
    if (!clientRef.current?.connected) return false;

    try {
      clientRef.current.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(message),
      });
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const sendExitMessage = useCallback(() => {
    return sendMessage("님이 퇴장했습니다.", "NOTICE");
  }, [sendMessage]);

  const reconnect = useCallback(() => {
    clientRef.current?.deactivate();
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionError(null);
    reconnectAttempts.current = 0;

    reconnectTimeoutRef.current = setTimeout(connect, 1000);
  }, [connect]);

  const getConnectionStatus = () => {
    if (connectionError) return `오류: ${connectionError}`;
    if (isConnecting) return "연결 중...";
    if (isConnected) return "연결됨";
    return "연결 끊김";
  };

  return {
    sendMessage,
    sendLegacyMessage,

    sendExitMessage,
    isConnected,
    isConnecting,
    connectionError,
    reconnect,
    connectionStatus: getConnectionStatus(),
    debugInfo: {
      roomCode,
      reconnectAttempts: reconnectAttempts.current,
      maxReconnectAttempts,
    },
  };
}
