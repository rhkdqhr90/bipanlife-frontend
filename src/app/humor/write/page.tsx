"use client";

import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { createPost } from "@/lib/apis/posts";
import { useUserStore } from "@/stores/userStore";
import { sanitizeImageSrcInHtml } from "@/utils/sanitizeImageSrcInHtml";
import { useRouter } from "next/navigation";
import { useState } from "react";

const HumorWritePage = () => {
  const router = useRouter();
  const { userInfo } = useUserStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  if (!userInfo) {
    return <p className="text-center mt-10 text-gray-500">로그인이 필요합니다.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("본문 내용을 입력해주세요.");
      return;
    }

    e.preventDefault();
    try {
      const boardId = 10;
      const cleanedContent = sanitizeImageSrcInHtml(content);
      await createPost({ boardId, title, content: cleanedContent, imageUrls });
      router.push("/humor");
    } catch (err) {
      console.error("글 작성 실패", err);
      alert("글 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">유머 게시판 글 작성</h1>

          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full text-2xl font-semibold border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500 pb-2 mb-6 bg-transparent"
          />

          <TiptapEditor
            content={content}
            onChange={setContent}
            onUploadImageUrls={filename => setImageUrls(prev => [...prev, ...filename])}
          />

          <div className="flex justify-end mt-8">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold"
            >
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HumorWritePage;
