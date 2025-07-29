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
      alert(e.message || "오류가 발생했습니다.");
    } finally {
      setLikeLoading(false);
      setDislikeLoading(false);
    }
  };

  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={() => handleClick("LIKE")}
        disabled={likeLoading}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        👍 추천
      </button>
      <button
        onClick={() => handleClick("DISLIKE")}
        disabled={dislikeLoading}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
      >
        👎 비추천
      </button>
    </div>
  );
};
