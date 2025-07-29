// 📁 /lib/apis/hot.ts
import { RangeType } from "@/types/hot";

export async function getHotPosts(range: RangeType) {
  const res = await fetch(`/api/hot-posts?range=${range}`, {
    cache: "no-store",
    credentials: "include", // ✅ HttpOnly 쿠키 인증 처리 시 필수!
  });
  if (!res.ok) throw new Error("핫 게시물 가져오기 실패");
  return res.json();
}

// ✅ 인기 태그 기반 게시글 가져오기
export async function getHotPostsByTag() {
  const res = await fetch("/api/hot-posts/posts-by-tag", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("🏷 태그 기반 인기 게시글 불러오기 실패");
  return res.json(); // HotPostResponse[]
}
