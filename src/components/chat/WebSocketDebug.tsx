// src/components/WebSocketDebug.tsx
import React, { useState } from "react";
import { useDebugWebSocket } from "@/hooks/useDebugWebSocket";

export const WebSocketDebug: React.FC = () => {
  const [roomCode, setRoomCode] = useState("test-room");
  const { connectionState, logs, sendTestMessage, isConnected, clearLogs } =
    useDebugWebSocket(roomCode);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "20px auto",
        padding: "20px",
        fontFamily: "monospace",
      }}
    >
      <h2>🔍 WebSocket 디버깅 도구</h2>

      {/* 설정 */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          방 코드:
          <input
            type="text"
            value={roomCode}
            onChange={e => setRoomCode(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
      </div>

      {/* 상태 */}
      <div
        style={{
          padding: "10px",
          backgroundColor: isConnected ? "#d4edda" : "#f8d7da",
          border: `1px solid ${isConnected ? "#c3e6cb" : "#f5c6cb"}`,
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      >
        <strong>연결 상태:</strong> {connectionState}
        <br />
        <strong>연결됨:</strong> {isConnected ? "✅ 예" : "❌ 아니오"}
      </div>

      {/* 환경 정보 */}
      <div
        style={{
          padding: "10px",
          backgroundColor: "#f8f9fa",
          border: "1px solid #dee2e6",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      >
        <h4>🔧 환경 정보</h4>
        <div>
          <strong>NODE_ENV:</strong> {process.env.NODE_ENV || "설정되지 않음"}
        </div>
        <div>
          <strong>NEXT_PUBLIC_API_BASE_URL:</strong>{" "}
          {process.env.NEXT_PUBLIC_API_BASE_URL || "설정되지 않음"}
        </div>
        <div>
          <strong>현재 호스트:</strong>{" "}
          {typeof window !== "undefined" ? window.location.origin : "서버사이드"}
        </div>
      </div>

      {/* 컨트롤 */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={sendTestMessage}
          disabled={!isConnected}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: isConnected ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isConnected ? "pointer" : "not-allowed",
          }}
        >
          📤 테스트 메시지 전송
        </button>
        <button
          onClick={clearLogs}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🧹 로그 지우기
        </button>
      </div>

      {/* 로그 */}
      <div
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "10px",
          backgroundColor: "#f8f9fa",
          fontSize: "12px",
        }}
      >
        <h4>📝 연결 로그 ({logs.length}개)</h4>
        {logs.length === 0 ? (
          <p style={{ color: "#6c757d" }}>로그가 없습니다.</p>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              style={{
                marginBottom: "5px",
                color: log.includes("❌")
                  ? "#dc3545"
                  : log.includes("✅")
                    ? "#28a745"
                    : log.includes("🔍")
                      ? "#6c757d"
                      : "#212529",
              }}
            >
              {log}
            </div>
          ))
        )}
      </div>

      {/* 수동 테스트 */}
      <div style={{ marginTop: "20px" }}>
        <h4>🧪 수동 테스트</h4>
        <div style={{ fontSize: "14px", color: "#6c757d" }}>
          <p>1. 백엔드 서버가 8080 포트에서 실행 중인지 확인</p>
          <p>
            2. 브라우저에서 <code>http://localhost:8080/api/chat/rooms</code> 접속 테스트
          </p>
          <p>3. 네트워크 탭에서 WebSocket 연결 시도 확인</p>
          <p>4. 백엔드 콘솔에서 WebSocket 연결 로그 확인</p>
        </div>
      </div>
    </div>
  );
};
