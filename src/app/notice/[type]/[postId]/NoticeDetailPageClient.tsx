// 📄 src/app/notice/noticeDetailClient.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDateTime } from "@/utils/data";
import { KakaoMapViewer } from "@/components/map/KakaoMapViewer";

interface PostDetail {
  id: number;
  title: string;
  content: string;
  authorNickname: string;
  placeName?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  hasPoll: boolean;
  likeCount: number;
  dislikeCount: number;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  tags: string[];
}

export default function NoticeDetailClient() {
  const { postId, type } = useParams();
  const [post, setPost] = useState<PostDetail | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find(row => row.startsWith("accessToken="))
          ?.split("=")[1];

        const res = await fetch(`/api/posts/${postId}`, {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          credentials: "include",
        });
        if (!res.ok) throw new Error("게시물 로딩 실패");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPost();
  }, [postId]);

  if (!post) return <div>로딩 중...</div>;
  if (typeof type !== "string") return null;

  const isLocationAvailable = post.latitude && post.longitude;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-6 border-b pb-4">
            <span>작성자: {post.authorNickname}</span>
            <span>작성일: {formatDateTime(post.createdAt)}</span>
            <span>조회수: {post.viewCount}</span>
            <span>추천: {post.likeCount}</span>
            <span>비추천: {post.dislikeCount}</span>
            <span>댓글: {post.commentCount}</span>
          </div>

          {(post.placeName || post.address) && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">장소 정보</h2>
              {post.placeName && <p className="text-gray-700">장소명: {post.placeName}</p>}
              {post.address && <p className="text-gray-700">주소: {post.address}</p>}
              {isLocationAvailable && (
                <KakaoMapViewer
                  latitude={post.latitude!}
                  longitude={post.longitude!}
                  placeName={post.placeName}
                />
              )}
            </div>
          )}

          {post.tags.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">태그</h2>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="flex justify-end border-t pt-4">
            <Link
              href={`/notice/${type}`}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              목록으로
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
