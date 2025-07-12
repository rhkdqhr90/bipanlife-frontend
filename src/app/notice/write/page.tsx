"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const TiptapEditor = dynamic(() => import("@/components/editor/TiptapEditor"), {
  ssr: false,
});

const NoticeWritePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isKakaoMapLoaded, setIsKakaoMapLoaded] = useState(false);

  // ✅ Kakao Map SDK 로드
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.kakao?.maps) {
      console.log("🟢 Kakao maps already loaded");
      setIsKakaoMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&libraries=services,clusterer&autoload=false`;
    script.async = true;
    script.onload = () => {
      console.log("✅ Kakao SDK script loaded");

      if (window.kakao?.maps?.load) {
        window.kakao.maps.load(() => {
          console.log("✅ Kakao maps loaded");
          setIsKakaoMapLoaded(true);
        });
      } else {
        console.warn("❌ Kakao maps.load is not available");
      }
    };
    script.onerror = e => {
      console.error("❌ Kakao SDK load failed", e);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          boardId: 1,
          title,
          content,
        }),
      });

      if (!res.ok) {
        throw new Error("작성 실패");
      }

      router.push("/notice");
    } catch (err) {
      console.error(err);
      alert("공지사항 작성 실패");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">공지사항 작성</h1>

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
            isKakaoMapLoaded={isKakaoMapLoaded}
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

export default NoticeWritePage;
