// src/components/rating/StarRatingInput.tsx
"use client";

import { useState } from "react";

interface RatingItem {
  name: string;
  score: number;
  type: "positive" | "negative";
}

interface StarRatingInputProps {
  ratingItems: RatingItem[];
  setRatingItems: (items: RatingItem[]) => void;
}

export const StarRatingInput = ({ ratingItems, setRatingItems }: StarRatingInputProps) => {
  const [positiveName, setPositiveName] = useState("");
  const [negativeName, setNegativeName] = useState("");

  const handleAdd = (type: "positive" | "negative", name: string) => {
    const trimmed = name.trim();
    if (!trimmed || ratingItems.length >= 5) return;
    setRatingItems([...ratingItems, { name: trimmed, score: 0, type }]);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    type === "positive" ? setPositiveName("") : setNegativeName("");
  };

  const handleRatingScoreChange = (index: number, score: number) => {
    const updated = [...ratingItems];
    updated[index].score = score;
    setRatingItems(updated);
  };

  const handleRemove = (index: number) => {
    const updated = [...ratingItems];
    updated.splice(index, 1);
    setRatingItems(updated);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white">
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">별점 항목 (최대 5개)</h2>

        <div className="grid md:grid-cols-2 gap-3 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={positiveName}
              onChange={e => setPositiveName(e.target.value)}
              placeholder="칭찬 항목 이름"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            />
            <button
              onClick={() => handleAdd("positive", positiveName)}
              className="px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              disabled={!positiveName.trim() || ratingItems.length >= 5}
            >
              칭찬 추가
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={negativeName}
              onChange={e => setNegativeName(e.target.value)}
              placeholder="불만 항목 이름"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
            <button
              onClick={() => handleAdd("negative", negativeName)}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              disabled={!negativeName.trim() || ratingItems.length >= 5}
            >
              불만 추가
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {ratingItems.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-md p-3 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.type === "positive" ? "bg-yellow-400" : "bg-purple-500"
                  }`}
                ></span>
                <span className="text-gray-900 text-sm font-medium">{item.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={score}
                      onClick={() => handleRatingScoreChange(index, score)}
                      className={`text-lg hover:scale-110 transition-transform focus:outline-none ${
                        score <= item.score
                          ? item.type === "positive"
                            ? "text-yellow-400"
                            : "text-purple-500"
                          : "text-gray-300 hover:text-gray-400"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleRemove(index)}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-2"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {ratingItems.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          <p>아직 등록된 항목이 없습니다.</p>
        </div>
      )}
    </div>
  );
};
