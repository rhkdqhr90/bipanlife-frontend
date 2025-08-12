// 📁 src/components/common/ReactionButton.tsx
"use client";

import { useState } from "react";
import { react, ReactionType } from "@/lib/apis/reaction";

interface ReactionButtonProps {
  target: "posts" | "comments";
  id: number;
}

export const ReactionButtons = ({ target, id }: ReactionButtonProps) => {
  const [likeLoading, setLikeLoading] = useState(false);
  const [dislikeLoading, setDislikeLoading] = useState(false);

  const handleClick = async (type: ReactionType) => {
    try {
      if (type === "LIKE") setLikeLoading(true);
      else setDislikeLoading(true);

      await react(target, id, type);
      alert(`${type === "LIKE" ? "추천" : "비추천"} 완료!`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      let message = "오류가 발생했습니다.";

      try {
        // e.message에서 JSON 시작 부분부터 잘라내기
        const jsonStart = e.message.indexOf("{");
        if (jsonStart !== -1) {
          const jsonString = e.message.slice(jsonStart);
          const parsed = JSON.parse(jsonString);
          if (parsed.message) message = parsed.message;
        }
      } catch (parseError) {
        console.warn("⚠️ JSON 파싱 실패:", parseError);
      }

      alert(message);
    } finally {
      setLikeLoading(false);
      setDislikeLoading(false);
    }
  };

  return (
    <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-sm">
      <button
        onClick={() => handleClick("LIKE")}
        disabled={likeLoading}
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm sm:text-base"
      >
        👍 추천
      </button>
      <button
        onClick={() => handleClick("DISLIKE")}
        disabled={dislikeLoading}
        className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 text-sm sm:text-base"
      >
        👎 비추천
      </button>
    </div>
  );
};
