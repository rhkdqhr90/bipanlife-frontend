"use client";

import React from "react";
import { HighlightColumnProps } from "@/types/Highlight";
import Link from "next/link";

export const HighlightColumn: React.FC<HighlightColumnProps> = ({ title, icon, items, color }) => {
  return (
    <div className="flex flex-col gap-4 bg-white rounded-xl p-4 shadow-sm w-full">
      {/* Title Section */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
        <h2 className={`text-lg font-semibold ${color} flex items-center gap-1`}>
          {icon}
          {title}
        </h2>
        <a href="#" className="text-sm text-gray-500 hover:underline">
          더보기
        </a>
      </div>

      {/* Item List */}
      <ul className="flex flex-col gap-2">
        {(items ?? []).length === 0 ? (
          <li className="text-sm text-gray-400">표시할 항목이 없습니다.</li>
        ) : (
          (items ?? []).map((item, index) => (
            <li
              key={item.id}
              className={`flex justify-between items-center text-sm text-gray-800 ${
                index < items.length - 1 ? "border-b border-gray-100 pb-2" : ""
              }`}
            >
              <Link
                href={`/${item.boardCode}/${item.id}`}
                className="flex justify-between w-full items-center hover:underline"
              >
                <span className="truncate max-w-[60%]">{item.title}</span>
                <div className="flex gap-2 items-center text-gray-500 text-xs">
                  <span>❤️ {item.likes}</span>
                  <span>💬 {item.comments}</span>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
