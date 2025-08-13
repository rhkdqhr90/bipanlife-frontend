"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import HotPostList from "@/components/hot/HotPostList";
import { getHotPosts } from "@/lib/apis/hot";
import { RangeType } from "@/types/hot";

export default function HotPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const raw = searchParams.get("range");
  const [range, setRange] = useState<RangeType | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [posts, setPosts] = useState<any[]>([]); // 타입 추가
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    console.log("=== 디버깅 ===");
    console.log("현재 URL:", window.location.href);
    console.log("raw:", raw);
    console.log("isValidRange(raw):", raw ? isValidRange(raw) : false);

    if (!raw || !isValidRange(raw)) {
      router.replace("/hot?range=TODAY");
    } else {
      setRange(raw);
    }
  }, [raw, isClient, router]);

  useEffect(() => {
    if (!range) return;
    setLoading(true);
    getHotPosts(range)
      .then(p => setPosts(p))
      .finally(() => setLoading(false));
  }, [range]);

  if (!isClient) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="flex gap-4 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-8 bg-gray-200 rounded w-16"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🔥 오늘의 핫판</h1>

      {/* 상단 탭 */}
      <div className="flex gap-4 mb-6 text-sm">
        {(["TODAY", "WEEK", "MONTH"] as RangeType[]).map(r => (
          <a // ← 이 <a 태그가 계속 빠지고 있었어요!
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
