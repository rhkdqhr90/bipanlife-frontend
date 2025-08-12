// 📄 /app/hot/tag/page.tsx
"use client";
import { useEffect, useState } from "react";
import { HotPostByTagResponse } from "@/types/hot";
import { getHotPostsByTag } from "@/lib/apis/hot";
import { HotPostByTagList } from "@/components/hot/HotPostByTagList";

export default function HotTagPage() {
  const [posts, setPosts] = useState<HotPostByTagResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHotPostsByTag()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🏷 인기 태그별 추천 게시글</h1>
      {loading ? (
        <p className="text-gray-500">불러오는 중...</p>
      ) : (
        <HotPostByTagList posts={posts} />
      )}
    </div>
  );
}
