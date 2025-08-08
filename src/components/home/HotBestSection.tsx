"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface HotBestItem {
  id: string | number;
  boardCode: string;
  title: string;
  imageUrl?: string;
}

interface HotBestSectionProps {
  title: string;
  description?: string;
  items: HotBestItem[];
}

export const HotBestSection = ({ title, description, items }: HotBestSectionProps) => {
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleImageError = (postId: number) => {
    setFailedImages(prev => new Set(prev).add(postId));
  };

  const isValidImageUrl = (item: HotBestItem) => {
    return (
      typeof item.imageUrl === "string" &&
      item.imageUrl.trim().length > 0 &&
      !failedImages.has(Number(item.id))
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col">
      {/* 제목 + 더보기 */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
        </div>
        <Link href="/hot" className="text-sm text-blue-500 hover:underline">
          더보기
        </Link>
      </div>

      {/* 카드 2x2 */}
      <ul className="grid grid-cols-2 gap-4 mt-4 flex-grow">
        {items.slice(0, 4).map(item => (
          <li key={item.id}>
            <Link
              href={`/${item.boardCode}/${item.id}`}
              className="block rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-lg transition-shadow"
            >
              {isClient && isValidImageUrl(item) ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                  onError={() => handleImageError(Number(item.id))}
                  onLoad={e => {
                    const img = e.target as HTMLImageElement;
                    if (img.naturalWidth === 0) {
                      handleImageError(Number(item.id));
                    }
                  }}
                />
              ) : (
                <div className="w-full h-40" /> // 👈 높이만 확보 (배경 없음)
              )}
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-800 truncate">{item.title}</h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotBestSection;
