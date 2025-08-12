"use client";

import { useEffect, useRef } from "react";
import { ChatMessageItem } from "./ChatMessageItem";

interface ChatMessageItemProps {
  id?: number;
  senderId: number;
  senderName: string;
  content: string;
  type: "NOTICE" | "TALK" | "VOTE";
  sentAt: string;
  roomCode: string;
}
interface ChatMessageListProps {
  messages: ChatMessageItemProps[];
  myUserId: number;
}

export const ChatMessageList = ({ messages, myUserId }: ChatMessageListProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInitialLoadRef = useRef(true);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    const isInitial = isInitialLoadRef.current;
    const isNewMessage = messages.length > prevLengthRef.current;

    if (!isInitial && isNewMessage && containerRef.current) {
      // ✅ 메시지 영역 안에서만 스크롤 이동
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    if (isInitial) {
      isInitialLoadRef.current = false;
    }

    prevLengthRef.current = messages.length;
  }, [messages]);

  return (
    <div ref={containerRef} className="h-full overflow-y-auto px-4 py-2 space-y-2">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">💬</div>
          <p>아직 메시지가 없습니다.</p>
          <p className="text-sm">첫 번째 메시지를 보내보세요!</p>
        </div>
      ) : (
        messages.map((msg, idx) => (
          <ChatMessageItem
            key={msg.id || `msg-${idx}`}
            {...msg}
            isMine={msg.senderId === myUserId}
          />
        ))
      )}
    </div>
  );
};
