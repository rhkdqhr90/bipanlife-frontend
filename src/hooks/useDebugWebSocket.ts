// src/hooks/useDebugWebSocket.ts
import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function useDebugWebSocket(roomCode: string) {
  const clientRef = useRef<Client | null>(null);
  const [connectionState, setConnectionState] = useState<string>("초기화");
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setLogs(prev => [...prev.slice(-20), logMessage]); // 최근 20개만 유지
  };

  useEffect(() => {
    if (!roomCode) {
      addLog("❌ roomCode가 없습니다");
      return;
    }

    addLog("🚀 WebSocket 연결 시작");
    setConnectionState("연결 시도 중");

    // 환경 변수 확인
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    addLog(`🔧 BASE_URL: ${baseUrl || "설정되지 않음"}`);

    const wsUrl = `${baseUrl || "http://localhost:8080"}/api/chat/ws-chat`;
    addLog(`🔗 WebSocket URL: ${wsUrl}`);

    try {
      // SockJS 소켓 생성
      addLog("🔌 SockJS 소켓 생성 중...");
      const socket = new SockJS(wsUrl);

      // 소켓 이벤트 리스너
      socket.onopen = () => {
        addLog("✅ SockJS 소켓 열림");
      };

      socket.onerror = error => {
        addLog(`❌ SockJS 오류: ${JSON.stringify(error)}`);
        setConnectionState("SockJS 오류");
      };

      socket.onclose = event => {
        addLog(`🔌 SockJS 소켓 닫힘: 코드=${event.code}, 이유=${event.reason}`);
        setConnectionState("연결 끊김");
      };

      // STOMP 클라이언트 생성
      addLog("📡 STOMP 클라이언트 생성 중...");
      const client = new Client({
        webSocketFactory: () => {
          addLog("🏭 WebSocket Factory 호출됨");
          return socket;
        },
        debug: str => {
          addLog(`🔍 STOMP: ${str}`);
        },
        onConnect: frame => {
          addLog("🎉 STOMP 연결 성공!");
          addLog(`📋 연결 프레임: ${JSON.stringify(frame.headers)}`);
          setConnectionState("연결됨");

          // 구독 시도
          const topic = `/topic/chat/${roomCode}`;
          addLog(`📡 구독 시작: ${topic}`);

          try {
            client.subscribe(topic, message => {
              addLog(`📨 메시지 수신: ${message.body}`);
            });
            addLog("✅ 구독 완료");
          } catch (subError) {
            addLog(`❌ 구독 실패: ${subError}`);
          }
        },
        onDisconnect: frame => {
          addLog("🔌 STOMP 연결 해제");
          addLog(`📋 해제 프레임: ${JSON.stringify(frame?.headers)}`);
          setConnectionState("연결 해제됨");
        },
        onStompError: frame => {
          addLog(`❌ STOMP 오류: ${frame.headers?.message}`);
          addLog(`📋 오류 헤더: ${JSON.stringify(frame.headers)}`);
          addLog(`📄 오류 본문: ${frame.body}`);
          setConnectionState(`STOMP 오류: ${frame.headers?.message}`);
        },
        onWebSocketError: event => {
          addLog(`❌ WebSocket 오류: ${JSON.stringify(event)}`);
          setConnectionState("WebSocket 오류");
        },
        onWebSocketClose: event => {
          addLog(`🔌 WebSocket 닫힘: 코드=${event.code}, 이유=${event.reason}`);
          setConnectionState(`연결 닫힘 (${event.code})`);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      addLog("⚡ STOMP 클라이언트 활성화 중...");
      client.activate();
      clientRef.current = client;
    } catch (error) {
      addLog(`❌ 전체 연결 과정에서 오류: ${error}`);
      setConnectionState(`초기화 오류: ${error}`);
    }

    // 정리 함수
    return () => {
      addLog("🧹 정리 시작");
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      setConnectionState("정리됨");
    };
  }, [roomCode]);

  const sendTestMessage = () => {
    if (!clientRef.current?.connected) {
      addLog("❌ 연결되지 않음 - 메시지 전송 불가");
      return;
    }

    try {
      const testMessage = {
        roomCode,
        content: "테스트 메시지",
        type: "TEXT",
      };

      addLog(`📤 테스트 메시지 전송: ${JSON.stringify(testMessage)}`);

      clientRef.current.publish({
        destination: "/app/chat/message",
        body: JSON.stringify(testMessage),
      });

      addLog("✅ 메시지 전송 완료");
    } catch (error) {
      addLog(`❌ 메시지 전송 실패: ${error}`);
    }
  };

  return {
    connectionState,
    logs,
    sendTestMessage,
    isConnected: clientRef.current?.connected || false,
    clearLogs: () => setLogs([]),
  };
}
