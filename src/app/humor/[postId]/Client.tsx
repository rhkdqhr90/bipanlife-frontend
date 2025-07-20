/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { CommentSection } from "@/components/comment/CommentSection";
import { KakaoMapViewer } from "@/components/map/KakaoMapViewer";
import { HtmlWithPresignedImages } from "@/components/render/HtmlWithPresignedImages";
import { PostComment } from "@/types/comment";
import { formatDateTime } from "@/utils/data";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
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
  authorId: number;
}

export default function HumorPostDetailClient() {
  const { postId } = useParams();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const userInfo = useUserStore(state => state.userInfo);
  const isAuthor = userInfo?.userId === post?.authorId;
  const router = useRouter();

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("게시물 로딩 실패");
      const data = await res.json();
      setPost(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments/posts/${postId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("댓글 로딩 실패");
      const data: PostComment[] = await res.json();
      setComments(data);
    } catch (err) {
      console.error("댓글 불러오기 실패:", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    try {
      if (post?.id == null) return;
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("삭제 실패");

      alert("삭제되었습니다.");
      router.push("/humor");
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId]);

  if (!post) return <div>로딩 중...</div>;
  const isLocationAvailable =
    typeof post.latitude === "number" && typeof post.longitude === "number";

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          {/* 제목 */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>

          {/* 메타 정보 */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-6 border-b pb-4">
            <span>작성자: {post.authorNickname}</span>
            <span>작성일: {formatDateTime(post.createdAt)}</span>
            <span>조회수: {post.viewCount}</span>
            <span>추천: {post.likeCount}</span>
            <span>비추천: {post.dislikeCount}</span>
            <span>댓글: {post.commentCount}</span>
          </div>

          {/* 장소 정보 */}
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

          {/* 태그 */}
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

          {/* 본문 내용 */}
          <HtmlWithPresignedImages html={post.content} />
          {isAuthor && (
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                onClick={() => router.push(`/humor/edit/${post.id}`)}
              >
                ✏️ 수정
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleDelete}
              >
                🗑️ 삭제
              </button>
            </div>
          )}

          {/* 댓글 입력 */}
          <div className="mt-12">
            <CommentSection postId={post.id} />
          </div>

          {/* 돌아가기 */}
          <div className="flex justify-end border-t pt-6 mt-8">
            <Link
              href="/humor"
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
