"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { KakaoMapViewer } from "@/components/map/KakaoMapViewer";
import { StarRatingInput } from "@/components/rating/StarRatingInput";
import { TagInput } from "@/components/tag/TagInput";
import { useRouter } from "next/navigation";
import { PostCreateRequestDto } from "@/types/Critic";
import { createCriticPost } from "@/lib/apis/posts";
import { criticBoardCodeToIdMap } from "@/utils/boardMappings";

export default function CriticWritePage() {
  const { boardType } = useParams() as { boardType: string };

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [ratings, setRatings] = useState<
    { name: string; score: number; type: "positive" | "negative" }[]
  >([]);
  const boardId = criticBoardCodeToIdMap[boardType];

  /**
   * 본문 HTML에서 <img src="..."> URL 추출
   * - SSR 대비: window 없는 환경에서 DOMParser 접근 방지
   * - 중복 제거
   */

  function extractImageUrls(html: string): string[] {
    if (!html) return [];
    if (typeof window === "undefined") return [];
    const doc = new DOMParser().parseFromString(html, "text/html");
    const urls = Array.from(doc.querySelectorAll("img"))
      .map(img => img.getAttribute("src"))
      .filter((src): src is string => !!src && src.trim().length > 0);

    return Array.from(new Set(urls));
  }

  const [location, setLocation] = useState<{
    placeName: string;
    address: string;
    latitude: number;
    longitude: number;
  } | null>(null);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("본문 내용을 입력해주세요.");
      return;
    }

    try {
      const imageUrls = extractImageUrls(content);
      const postData: PostCreateRequestDto = {
        boardId,
        title,
        content,
        tags,
        imageUrls,
        ratings,
        boardType,
        ...(location && {
          placeName: location.placeName,
          address: location.address,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      };

      await createCriticPost(postData);
      router.push(`/critic/${boardType}`);
    } catch (error) {
      console.error("게시글 작성 중 오류 발생:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-16">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 px-6 sm:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">비판글 작성</h1>

        {/* 제목 입력 */}
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full text-2xl font-semibold border-b border-gray-300 focus:outline-none focus:border-blue-500 pb-3 mb-8 bg-transparent"
        />

        {/* 별점 입력 */}
        <StarRatingInput ratingItems={ratings} setRatingItems={setRatings} />

        {/* 태그 입력 */}
        <div className="mt-10 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full">
          <TagInput tags={tags} setTags={setTags} />
        </div>

        {/* 본문 에디터 */}
        <div className="mt-10 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full">
          <TiptapEditor content={content} onChange={setContent} onSelectLocation={setLocation} />
        </div>

        {/* 지도 */}
        {location && (
          <div className="mt-10">
            <KakaoMapViewer {...location} />
          </div>
        )}

        {/* 등록 버튼 */}
        <div className="flex justify-end mt-10">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
