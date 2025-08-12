"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { apiFetch } from "@/lib/apis/apiFetch";

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
  imageUrls: string[];
}
const HumorEditPage = () => {
  const { postId } = useParams() as { postId: string };
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const userInfo = useUserStore(state => state.userInfo);
  const [post, setPost] = useState<PostDetail | null>(null);

  const fetchGetPost = async () => {
    try {
      const res = await apiFetch(`/api/posts/${postId}`, {
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

  const handleSubmit = async () => {
    try {
      const res = await apiFetch(`/api/posts/${postId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          imageUrls, // 필요 시
        }),
      });
      if (!res.ok) throw new Error("수정 실패");

      alert("수정되었습니다.");
      router.push(`/humor/${postId}`);
    } catch (err) {
      console.error(err);
      alert("수정 중 오류 발생");
    }
  };

  useEffect(() => {
    if (post) {
      console.log("post 설정됨:", post);
      setTitle(post.title);
      setContent(post.content);
      setImageUrls(post.imageUrls || []);
    }
  }, [post]);

  useEffect(() => {
    if (post && userInfo) {
      if (userInfo.id !== post.authorId) {
        alert("권한이 없습니다.");
        router.replace("/humor");
      }
    }
  }, [post, userInfo]);

  useEffect(() => {
    if (postId) {
      fetchGetPost();
    }
  }, [postId]);

  if (!post) return <div>로딩 중...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">유머 게시판 글 수정</h1>

          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full text-2xl font-semibold border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500 pb-2 mb-6 bg-transparent"
          />
          {/* TiptapEditor는 post와 content가 준비되었을 때만 렌더링 */}
          {post && content && (
            <TiptapEditor
              key={post.id} // 이게 매우 중요! 내부 Editor 재생성됨
              content={content}
              onChange={setContent}
              onUploadImageUrls={filename => setImageUrls(prev => [...prev, ...filename])}
            />
          )}

          <div className="flex justify-end mt-8">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold"
            >
              수정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HumorEditPage;
