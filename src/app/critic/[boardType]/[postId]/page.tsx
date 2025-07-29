// 📄 /app/critic/[boardType]/[postId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/utils/data";
import { KakaoMapViewer } from "@/components/map/KakaoMapViewer";
import { CommentSection } from "@/components/comment/CommentSection";
import { deletePost } from "@/lib/apis/posts";
import { useUserStore } from "@/stores/userStore";
import { ReactionButtons } from "@/components/common/ReactionButton";

interface Rating {
  name: string;
  score: number;
  type: "POSITIVE" | "NEGATIVE";
}

interface PostDetail {
  id: number;
  authorId: number;
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
  ratings: Rating[];
}

export default function CriticPostDetailPage() {
  const { boardType, postId } = useParams() as { boardType: string; postId: string };
  const [post, setPost] = useState<PostDetail | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
  }, [postId]);

  const userInfo = useUserStore(state => state.userInfo);
  const isAuthor = userInfo !== null && userInfo.id === post?.authorId;

  const handleEdit = () => {
    router.push(`/critic/${boardType}/edit/${postId}`);
  };

  const handleDelete = async () => {
    try {
      await deletePost(Number(postId));
      router.push(`/critic/${boardType}`);
    } catch (error) {
      console.error("❌ 삭제 중 오류 발생:", error);
    }
  };

  if (!post) return <div className="p-10 text-gray-500">로딩 중...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-6">
          작성자: <span className="font-medium">{post.authorNickname}</span> |{" "}
          {formatDateTime(post.createdAt)} | 조회수: {post.viewCount}
        </div>

        {/* 별점 */}
        {post.ratings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">이 글에 대한 평가</h2>
            <ul className="space-y-2">
              {post.ratings.map((rating, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{rating.name}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < rating.score
                            ? rating.type === "POSITIVE"
                              ? "text-yellow-400"
                              : "text-purple-500"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.45a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.54 1.118l-3.37-2.45a1 1 0 00-1.176 0l-3.37 2.45c-.784.57-1.838-.197-1.539-1.118l1.285-3.955a1 1 0 00-.364-1.118L2.075 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.951-.69l1.286-3.955z" />
                      </svg>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 태그 */}
        {post.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 본문 */}
        <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* 지도 */}
        {post.latitude && post.longitude && (
          <div className="mt-10">
            <KakaoMapViewer
              placeName={post.placeName ?? post.address}
              latitude={post.latitude}
              longitude={post.longitude}
            />
          </div>
        )}

        {/* 추천/비추천 버튼 */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
          <ReactionButtons target="posts" id={post.id} />
        </div>

        {/* 수정/삭제 버튼 */}
        {isAuthor && (
          <div className="flex justify-end space-x-3 mt-6 pt-4 ">
            <button
              onClick={handleEdit}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 댓글 영역 */}
      <div className="max-w-4xl mx-auto mt-8">
        <CommentSection postId={post.id} />
      </div>
    </div>
  );
}
