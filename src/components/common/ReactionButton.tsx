/* eslint-disable @typescript-eslint/no-explicit-any */
// /components/common/ReactionButton.tsx
"use client";

import { apiFetch } from "@/lib/apis/apiFetch";
import { useState, useEffect } from "react";

type ReactionType = "LIKE" | "DISLIKE";

interface ReactionButtonsProps {
  target?: string;
  id: number;
  initialLikeCount?: number;
  initialDislikeCount?: number;
  initialUserReaction?: string | null;
}

const react = async (id: number, type: ReactionType) => {
  const path = type === "LIKE" ? `/api/posts/${id}/like` : `/api/posts/${id}/dislike`;

  const response = await apiFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // credentials: "include" // ← apiFetch 내부에서 이미 include 처리하면 제거
  });

  console.log("📡 응답 상태:", response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ 에러 응답:", errorText);
    throw new Error(errorText);
  }

  // ✅ 204 No Content 처리 - JSON 파싱하지 않음
  if (response.status === 204) {
    console.log("✅ 204 No Content - 성공 처리");
    return { success: true };
  }

  // ✅ 응답에 내용이 있는지 확인
  const contentLength = response.headers.get("content-length");
  const contentType = response.headers.get("content-type");

  // 내용이 없거나 JSON이 아닌 경우
  if (contentLength === "0" || !contentType?.includes("application/json")) {
    console.log("✅ 빈 응답 또는 비JSON - 성공으로 처리");
    return { success: true };
  }

  // JSON 응답이 있는 경우에만 파싱
  try {
    const result = await response.json();
    console.log("✅ JSON 응답:", result);
    return result;
  } catch (jsonError) {
    console.log("⚠️ JSON 파싱 실패하지만 응답 성공으로 처리", jsonError);
    return { success: true };
  }
};

export function ReactionButtons({
  id,
  initialLikeCount = 0,
  initialDislikeCount = 0,
  initialUserReaction = null,
}: ReactionButtonsProps) {
  // ✅ props 디버깅
  console.log("🔧 ReactionButtons props:", {
    id,
    initialLikeCount,
    initialDislikeCount,
    initialUserReaction,
  });

  const [likeLoading, setLikeLoading] = useState(false);
  const [dislikeLoading, setDislikeLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [dislikeCount, setDislikeCount] = useState(initialDislikeCount);
  const [userReaction, setUserReaction] = useState<string | null>(initialUserReaction);

  // ✅ state 디버깅
  console.log("🎛️ ReactionButtons state:", {
    likeCount,
    dislikeCount,
    userReaction,
  });

  // ✅ props 변경 시 state 업데이트
  useEffect(() => {
    console.log("🔄 Props 변경 감지:", {
      initialUserReaction,
      currentUserReaction: userReaction,
    });

    setLikeCount(initialLikeCount);
    setDislikeCount(initialDislikeCount);
    setUserReaction(initialUserReaction);
  }, [initialLikeCount, initialDislikeCount, initialUserReaction]);

  const handleClick = async (type: ReactionType) => {
    try {
      console.log(`🔄 ${type} 버튼 클릭됨, post ID: ${id}`);

      if (type === "LIKE") setLikeLoading(true);
      else setDislikeLoading(true);

      const result = await react(id, type);

      // ✅ 성공 처리 - 서버에서 받은 실제 카운트로 업데이트
      if (result.success) {
        // 서버에서 실제 카운트를 받아온 경우
        if (result.likeCount !== undefined && result.dislikeCount !== undefined) {
          setLikeCount(result.likeCount);
          setDislikeCount(result.dislikeCount);
          setUserReaction(result.userReaction);
        }

        alert(`${type === "LIKE" ? "추천" : "비추천"} 완료!`);
      }
    } catch (e: any) {
      console.error("💥 전체 에러 객체:", e);

      let message = "오류가 발생했습니다.";

      // 에러 메시지에서 JSON 파싱 시도
      if (e.message) {
        try {
          // 전체 메시지가 JSON인지 확인
          const parsed = JSON.parse(e.message);
          if (parsed.message) {
            message = parsed.message;
          } else if (parsed.error) {
            message = parsed.error;
          }
          console.log("🔍 JSON 파싱 성공:", parsed);

          // 특정 에러에 대한 사용자 친화적 메시지
          if (parsed.message.includes("이미") && parsed.message.includes("한 게시글")) {
            message = "이미 반응하신 게시글입니다.";
          }
        } catch (parseError) {
          // 원본 메시지 사용
          message = e.message || "알 수 없는 오류가 발생했습니다.";
          console.log("📝 일반 텍스트 에러:", parseError);
        }
      }

      alert(message);
    } finally {
      setLikeLoading(false);
      setDislikeLoading(false);
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={() => handleClick("LIKE")}
        disabled={likeLoading || userReaction === "LIKE"}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          userReaction === "LIKE"
            ? "bg-blue-600 text-white shadow-lg border-2 border-blue-300"
            : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
        }`}
        title={userReaction === "LIKE" ? "이미 좋아요를 누르셨습니다" : ""}
      >
        {likeLoading ? "처리중..." : `👍 좋아요 ${likeCount}`}
        {userReaction === "LIKE" && <span className="text-xs">✓</span>}
      </button>

      <button
        onClick={() => handleClick("DISLIKE")}
        disabled={dislikeLoading || userReaction === "DISLIKE"}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          userReaction === "DISLIKE"
            ? "bg-red-600 text-white shadow-lg border-2 border-red-300"
            : "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg"
        }`}
        title={userReaction === "DISLIKE" ? "이미 싫어요를 누르셨습니다" : ""}
      >
        {dislikeLoading ? "처리중..." : `👎 싫어요 ${dislikeCount}`}
        {userReaction === "DISLIKE" && <span className="text-xs">✓</span>}
      </button>
    </div>
  );
}
