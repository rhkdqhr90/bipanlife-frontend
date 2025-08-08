// 📄 /components/hot/HotPostByTagList.tsx
"use client";

import { HotPostByTagResponse } from "@/types/hot";
import Link from "next/link";
import { useState } from "react";

interface Props {
  posts: HotPostByTagResponse[];
}

export const HotPostByTagList = ({ posts }: Props) => {
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const handleImageError = (postId: number) => {
    setFailedImages(prev => new Set(prev).add(postId));
  };

  if (posts.length === 0) return <p className="text-gray-500">인기 태그 게시글이 없습니다.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {posts.map(post => (
        <div
          key={post.postId}
          className="flex border rounded-lg overflow-hidden shadow-sm hover:shadow transition"
        >
          {/* 이미지가 있고 로드에 실패하지 않은 경우에만 표시 */}
          {post.thumbnailUrl &&
            post.thumbnailUrl !== "/images/placeholder1.jpg" &&
            !failedImages.has(post.postId) && (
              <img
                src={post.thumbnailUrl}
                alt=""
                className="w-32 h-24 object-cover"
                onError={() => handleImageError(post.postId)}
                onLoad={e => {
                  // 이미지가 실제로 존재하지 않으면 숨김
                  const img = e.target as HTMLImageElement;
                  if (img.naturalWidth === 0) {
                    handleImageError(post.postId);
                  }
                }}
              />
            )}
          <div className="p-3 flex flex-col justify-between flex-1">
            <div className="flex items-center justify-between mb-1 text-xs text-gray-500">
              <span>{post.tagName}</span>
              <span>{post.averageRating?.toFixed(1) ?? "-"} ⭐</span>
            </div>
            <Link
              href={
                post.boardType === "critic"
                  ? `/critic/${post.boardCode}/${post.postId}`
                  : `/${post.boardCode}/${post.postId}`
              }
            >
              <span className="text-blue-700 hover:underline line-clamp-1">{post.title}</span>
            </Link>
            <div className="text-xs text-gray-500 mt-2">
              {post.authorNickname} · 조회 {post.viewCount} · 추천 {post.likeCount}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
