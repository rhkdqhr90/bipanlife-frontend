// 📄 /components/hot/HotPostByTagList.tsx
"use client";

import { HotPostByTagResponse } from "@/types/hot";
import Link from "next/link";

interface Props {
  posts: HotPostByTagResponse[];
}

export const HotPostByTagList = ({ posts }: Props) => {
  if (posts.length === 0) return <p className="text-gray-500">인기 태그 게시글이 없습니다.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {posts.map(post => (
        <div
          key={post.postId}
          className="flex border rounded-lg overflow-hidden shadow-sm hover:shadow transition"
        >
          <img
            src={post.thumbnailUrl || "/images/placeholder1.jpg"}
            alt="썸네일"
            className="w-32 h-24 object-cover"
          />
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
