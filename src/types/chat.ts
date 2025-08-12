// types/chat.ts - 타입 정의 통합
export interface ChatMessageItemProps {
  id?: number;
  senderId: number;
  senderName: string;
  content: string;
  type: ChatMessageType; // 백엔드와 일치
  sentAt: string;
  isMine?: boolean;
  roomCode: string; // roomId -> roomCode로 변경 (백엔드와 일치)
}

export interface SocketMessage {
  type: "ENTER" | "TALK" | "EXIT";
  roomId: string;
  sender: string;
  content: string;
}

export interface BackendChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  roomCode: string;
  content: string;
  sentAt: string;
  type: "NOTICE" | "TEXT" | "VOTE";
}

export type ChatMessageType = "TEXT" | "NOTICE" | "ENTER" | "TALK" | "EXIT" | "VOTE"; // ← 추가

export interface ChatMessageItemProps {
  id?: number;
  senderId: number;
  senderName: string;
  content: string;
  type: ChatMessageType;
  sentAt: string;
  roomCode: string;
  isMine?: boolean;
}
