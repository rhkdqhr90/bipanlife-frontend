"use client";

import { HotPost } from "@/types/hot";
import Link from "next/link";
import { formatDateTime } from "@/utils/data";

interface Props {
  posts: HotPost[];
}

export default function HotPostList({ posts }: Props) {
  return (
    <div className="w-full">
      <table className="w-full table-fixed border-t border-gray-300">
        <thead>
          <tr className="text-sm bg-gray-100 text-gray-600">
            <th className="w-16 py-2">#</th>
            <th className="w-20 py-2">썸네일</th>
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
              <td className="text-center py-2">
                <img
                  src={post.thumbnailUrl || "/images/placeholder1.jpg"}
                  alt="썸네일"
                  className="w-16 h-12 object-cover rounded mx-auto"
                />
              </td>
              <td className="py-2">
                <Link
                  href={
                    post.boardType === "critic"
                      ? `/critic/${post.boardCode}/${post.postId}`
                      : `/${post.boardCode}/${post.postId}`
                  }
                >
                  <span className="text-blue-700 hover:underline line-clamp-1">{post.title}</span>
                </Link>
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
  );
}
