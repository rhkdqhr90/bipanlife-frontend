"use client";

import { HotTagResponse } from "@/types/hot";
import Link from "next/link";

interface Props {
  tags: HotTagResponse[];
}

export const HotTagList = ({ tags }: Props) => {
  if (tags.length === 0) return <p className="text-gray-500">인기 태그가 없습니다.</p>;

  return (
    <div className="flex flex-wrap gap-3">
      {tags.map(tag => (
        <Link
          key={tag.tagName}
          href={`/search?tag=${encodeURIComponent(tag.tagName)}`}
          className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm font-medium transition"
        >
          <span>{tag.tagName}</span>
          <span className="text-xs text-gray-500">({tag.likeCount} 추천)</span>
        </Link>
      ))}
    </div>
  );
};
