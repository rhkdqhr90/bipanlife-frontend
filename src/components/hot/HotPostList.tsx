"use client";

import { HotPost } from "@/types/hot";
import Link from "next/link";
import { formatDateTime } from "@/utils/data";
import { useState } from "react";

interface Props {
  posts: HotPost[];
}

export default function HotPostList({ posts }: Props) {
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const handleImageError = (postId: number) => {
    setFailedImages(prev => new Set(prev).add(postId));
  };

  return (
    <div className="w-full">
      {/* 🖥 PC 테이블 (md 이상) */}
      <div className="hidden md:block">
        <table className="w-full table-fixed border-t border-gray-300">
          <thead>
            <tr className="text-sm bg-gray-100 text-gray-600">
              <th className="w-16 py-2">#</th>
              <th className="text-left py-2">제목</th>
              <th className="w-20 py-2">별점</th>
              <th className="w-24 py-2">작성자</th>
              <th className="w-32 py-2">작성일</th>
              <th className="w-20 py-2">조회수</th>
              <th className="w-20 py-2">추천</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, idx) => (
              <tr key={post.postId} className="text-sm border-b hover:bg-gray-50 transition-colors">
                <td className="text-center py-2">{idx + 1}</td>
                <td className="py-2">
                  <div className="flex items-center gap-3">
                    {post.thumbnailUrl &&
                      post.thumbnailUrl !== "/images/placeholder1.jpg" &&
                      !failedImages.has(post.postId) && (
                        <img
                          src={post.thumbnailUrl}
                          alt=""
                          className="w-16 h-12 object-cover rounded flex-shrink-0"
                          onError={() => handleImageError(post.postId)}
                          onLoad={e => {
                            const img = e.target as HTMLImageElement;
                            if (img.naturalWidth === 0) {
                              handleImageError(post.postId);
                            }
                          }}
                        />
                      )}
                    <Link
                      href={
                        post.boardType === "critic"
                          ? `/critic/${post.boardCode}/${post.postId}`
                          : `/${post.boardCode}/${post.postId}`
                      }
                      className="flex-1 min-w-0"
                    >
                      <span className="text-blue-700 hover:underline line-clamp-1">
                        {post.title}
                      </span>
                    </Link>
                  </div>
                </td>
                <td className="text-center py-2">{post.averageRating?.toFixed(1) ?? "-"}</td>
                <td className="text-center py-2">{post.authorNickname}</td>
                <td className="text-center py-2">{formatDateTime(post.createdAt)}</td>
                <td className="text-center py-2">{post.viewCount}</td>
                <td className="text-center py-2">{post.likeCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 모바일 카드형 리스트 (md 미만) */}
      <div className="md:hidden divide-y divide-gray-100 px-2">
        {posts.map(post => (
          <div key={post.postId} className="py-4">
            <Link
              href={
                post.boardType === "critic"
                  ? `/critic/${post.boardCode}/${post.postId}`
                  : `/${post.boardCode}/${post.postId}`
              }
              className="block"
            >
              <div className="flex items-center gap-3">
                {post.thumbnailUrl &&
                  post.thumbnailUrl !== "/images/placeholder1.jpg" &&
                  !failedImages.has(post.postId) && (
                    <img
                      src={post.thumbnailUrl}
                      alt=""
                      className="w-20 h-16 object-cover rounded"
                      onError={() => handleImageError(post.postId)}
                      onLoad={e => {
                        const img = e.target as HTMLImageElement;
                        if (img.naturalWidth === 0) {
                          handleImageError(post.postId);
                        }
                      }}
                    />
                  )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-800 text-sm line-clamp-2">{post.title}</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    별점: {post.averageRating?.toFixed(1) ?? "-"} / 작성자: {post.authorNickname}
                  </p>
                  <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                    <span>{formatDateTime(post.createdAt)}</span>
                    <span>조회 {post.viewCount}</span>
                    <span className="text-red-500">추천 {post.likeCount}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
