// 📄 src/lib/apis/notice.ts

import { PostListItem } from "@/types/PostListItem";

// 게시판 타입 정의
export type FreeType = "general" | "life" | "hobby";

// 각 type에 해당하는 boardId 매핑
const boardTypeMap: Record<FreeType, number> = {
  general: 21,
  life: 22,
  hobby: 23,
};

// 실제 fetch 함수
export async function fetchFreePostsByType(
  type: FreeType,
  query: string = "",
  page: number = 1,
  size: number = 10,
): Promise<{
  content: PostListItem[];
  totalPages: number;
  totalElements: number;
}> {
  const boardId = boardTypeMap[type];
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/boards/${boardId}?page=${page - 1}&size=${size}&query=${encodeURIComponent(query)}`,
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
