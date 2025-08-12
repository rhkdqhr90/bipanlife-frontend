// src/lib/apis/getHotBestItems.ts
import { HotBestItem, HotNowItem, RawHotNowResponse, SlideItem } from "@/types/home";
import { formatTimeAgo } from "@/utils/time";
import { apiFetch } from "./apiFetch";

export async function getHotBestItems(): Promise<HotBestItem[]> {
  try {
    const res = await apiFetch(`/api/hot-posts?range=WEEK`, {
      cache: "no-store",
      credentials: "include", // ✅ 쿠키 기반 인증 처리 시 필수
    });

    if (!res.ok) {
      throw new Error("핫 게시물 가져오기 실패");
    }

    const data = await res.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.slice(0, 4).map((item: any) => ({
      id: item.postId,
      title: item.title,
      boardCode: item.boardCode,
      imageUrl: item.thumbnailUrl ?? "/images/default-thumb.jpg",
    }));
  } catch (error) {
    console.error("🔥 getHotBestItems error", error);
    return [];
  }
}

export async function getSlideItems(): Promise<SlideItem[]> {
  try {
    const res = await apiFetch(`/home/slide`, {
      next: { revalidate: 60 }, // ISR (선택 사항)
    });

    if (!res.ok) {
      throw new Error("슬라이드 데이터를 불러오는 데 실패했습니다.");
    }

    const data = await res.json();
    return data as SlideItem[];
  } catch (error) {
    console.error("❌ getSlideItems error:", error);
    return []; // 실패 시 빈 배열 반환
  }
}

export async function getHotNowItems(): Promise<HotNowItem[]> {
  try {
    const res = await apiFetch(`/api/hot-posts/hot-now-posts`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      throw new Error("실시간 HOT 게시글 불러오기 실패");
    }

    const rawData: RawHotNowResponse[] = await res.json();

    return rawData.map(item => ({
      id: item.postId,
      title: item.title,
      boardCode: item.boardCode,
      tag: item.boardName,
      timeAgo: formatTimeAgo(item.createdAt),
      views: item.viewCount,
    }));
  } catch (error) {
    console.error("❌ getHotNowItems error:", error);
    return [];
  }
}
