// 📄 src/lib/apis/notice.ts

import { PostListItem } from "@/types/PostListItem";
import { apiFetch } from "./apiFetch";

// 게시판 타입 정의
export type NoticeType = "terms" | "privacy" | "guideline" | "discussion" | "faq" | "notice";

// 각 type에 해당하는 boardId 매핑
const boardTypeMap: Record<NoticeType, number> = {
  terms: 1,
  privacy: 2,
  guideline: 3,
  discussion: 4,
  faq: 5,
  notice: 6,
};

// 실제 fetch 함수
export async function fetchNoticePostsByType(
  type: NoticeType,
  query: string = "",
  page: number = 1,
  size: number = 10,
): Promise<{
  content: PostListItem[];
  totalPages: number;
  totalElements: number;
}> {
  const boardId = boardTypeMap[type];
  const res = await apiFetch(
    `/api/posts/boards/${boardId}?page=${page - 1}&size=${size}&query=${encodeURIComponent(query)}`,
    {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(`(${type}) 게시글 목록을 불러오는 데 실패했습니다.`);
  }

  return res.json();
}
