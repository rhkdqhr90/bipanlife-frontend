"use client";

import React from "react";
import clsx from "clsx";
import { formatDateTime } from "@/utils/data";
import { ChatMessageItemProps } from "@/types/chat";

export const ChatMessageItem = ({
  senderName,
  content,
  type,
  sentAt,
  isMine = false,
}: ChatMessageItemProps) => {
  // 시스템 메시지 (입장/퇴장/공지)
  if (type === "ENTER" || type === "EXIT" || type === "NOTICE") {
    return (
      <div className="text-center text-sm text-gray-500 my-3 px-4 py-2 bg-gray-50 rounded-lg">
        {content}
      </div>
    );
  }

  return (
    <div className={clsx("flex gap-3 my-3", isMine ? "justify-end" : "justify-start")}>
      {!isMine && (
        <div className="flex flex-col items-start">
          <div className="text-xs text-gray-600 mb-1 px-1">{senderName}</div>
          <div
            className={clsx(
              "max-w-[280px] px-4 py-2 rounded-2xl text-sm shadow-sm",
              "bg-white border border-gray-200 text-gray-800 rounded-bl-sm",
            )}
          >
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{content}</p>
            <div className="text-[10px] text-gray-400 mt-1">{formatDateTime(sentAt)}</div>
          </div>
        </div>
      )}

      {isMine && (
        <div className="flex flex-col items-end">
          <div
            className={clsx(
              "max-w-[280px] px-4 py-2 rounded-2xl text-sm shadow-sm",
              "bg-blue-500 text-white rounded-br-sm",
            )}
          >
            <div>{content}</div>
            <div className="text-[10px] text-blue-100 mt-1 text-right">
              {formatDateTime(sentAt)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
