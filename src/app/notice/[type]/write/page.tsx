"use client";
export const runtime = "edge";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { KakaoMapViewer } from "@/components/map/KakaoMapViewer";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/apis/apiFetch";

const boardCodeToIdMap: Record<string, number> = {
  terms: 1,
  privacy: 2,
  guideline: 3,
  discussion: 4,
  faq: 5,
  notice: 6,
};

const NoticeWritePage = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [boardName, setBoardName] = useState("게시판");

  const pathname = usePathname();
  const { type } = useParams(); // board: string | string[] | undefined\\
  const boardCode = Array.isArray(type) ? type[0] : type;
  const boardId = boardCode ? boardCodeToIdMap[boardCode] : null;

  useEffect(() => {
    if (!boardId) return;
    apiFetch(`/api/boards/${boardId}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setBoardName(data.boardName))
      .catch(err => console.error("게시판 이름 불러오기 실패: ", err));
  }, [boardId]);

  const [location, setLocation] = useState<{
    placeName: string;
    address: string;
    latitude: number;
    longitude: number;
  } | null>(null);

  const handleLocation = (location: {
    placeName: string;
    address: string;
    latitude: number;
    longitude: number;
  }) => {
    console.log("📍 선택된 위치:", location);
    setLocation(location);
  };

  const handleSubmit = async () => {
    try {
      const body: Record<string, unknown> = {
        boardId,
        title,
        content,
      };

      if (location) {
        body.placeName = location.placeName;
        body.address = location.address;
        body.latitude = location.latitude;
        body.longitude = location.longitude;
      }

      const res = await apiFetch("/api/posts", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("작성 실패");
      }

      router.push(pathname.replace(/\/write$/, ""));
    } catch (err) {
      console.error("❌ 작성 실패:", err);
      alert("공지사항 작성 실패");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {boardName ? `${boardName} 작성` : "게시판 작성"}
          </h1>

          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full text-2xl font-semibold border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-500 pb-2 mb-6 bg-transparent"
          />

          <TiptapEditor content={content} onChange={setContent} onSelectLocation={handleLocation} />

          {/* 📍 지도 출력 */}
          {location && (
            <div className="mt-6">
              <div className="mt-4">
                <KakaoMapViewer
                  latitude={location.latitude}
                  longitude={location.longitude}
                  placeName={location.placeName}
                />
              </div>
            </div>
          )}

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
