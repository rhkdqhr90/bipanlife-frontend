"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import HotPostList from "@/components/hot/HotPostList";
import { getHotPosts } from "@/lib/apis/hot";
import { RangeType } from "@/types/hot";

export default function HotPage() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("range") ?? "TODAY";
  const range: RangeType = isValidRange(raw) ? raw : "TODAY";

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getHotPosts(range)
      .then(p => setPosts(p))
      .finally(() => setLoading(false));
    console.log("boardType:", posts);
  }, [range]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🔥 오늘의 핫판</h1>

      {/* 상단 탭 */}
      <div className="flex gap-4 mb-6 text-sm">
        {(["TODAY", "WEEK", "MONTH"] as RangeType[]).map(r => (
          <a
            key={r}
            href={`/hot?range=${r}`}
            className={`px-3 py-1 rounded-md border ${
              r === range ? "bg-gray-800 text-white" : "bg-white text-gray-700"
            }`}
          >
            {r === "TODAY" ? "오늘" : r === "WEEK" ? "일주일" : "한달"}
          </a>
        ))}
      </div>

      {loading ? <p className="text-gray-500">불러오는 중...</p> : <HotPostList posts={posts} />}
    </div>
  );
}

function isValidRange(value: string): value is RangeType {
  return value === "TODAY" || value === "WEEK" || value === "MONTH";
}
