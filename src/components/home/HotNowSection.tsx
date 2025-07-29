// ✅ src/components/home/HotNowSection.tsx
"use client";

import React from "react";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export interface HotNowItem {
  id: number;
  title: string;
  boardCode: string;
  tag: string;
  timeAgo: string;
  views: number;
}

export interface HotNowSectionProps {
  title: string;
  description?: string;
  items: HotNowItem[];
}

export const HotNowSection: React.FC<HotNowSectionProps> = ({ title, description, items }) => {
  const router = useRouter();
  return (
    <div className="bg-white rounded-xl p-6 shadow h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          LIVE
        </span>
      </div>
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      <ul className="space-y-4 flex-grow">
        {items.map(item => (
          <li
            key={item.id}
            onClick={() => router.push(`/${item.boardCode}/${item.id}`)}
            className="flex justify-between items-start"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium hover:underline cursor-pointer">{item.title}</p>
              <div className="text-xs text-gray-500 space-x-2">
                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded">{item.tag}</span>
                <span>{item.timeAgo}</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Eye size={16} className="mr-1" />
              {item.views}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
