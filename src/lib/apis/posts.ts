import { PostCreateRequestDto } from "@/types/Critic";
import { PostListItem, PostListWithBoardName, PostDetail } from "@/types/PostListItem";
import { apiFetch } from "./apiFetch";

interface CreatePostRequest {
  boardId: number;
  title: string;
  content: string;
  imageUrls: string[];
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export async function createPost(data: CreatePostRequest) {
  const res = await apiFetch(`/api/posts`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("게시글 작성 실패");

  return res.json();
}

export const updatePost = async (postId: number, body: unknown) => {
  const res = await apiFetch(`/api/posts/${postId}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("게시글 수정 실패");
  return res.json();
};

export const deletePost = async (postId: number) => {
  const res = await apiFetch(`/api/posts/${postId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("게시글 삭제 실패");
  if (res.status === 204) return { success: true }; // ✅ No Content 대응
  return res.json(); // JSON 응답이 있을 때만 파싱
};

// 동적 게시판 을 위한 GetBoardCode
export async function getPostListByBoardCode(
  boardCode: string,
  page: number = 0,
  size: number = 10,
  query: string,
): Promise<PostListWithBoardName | null> {
  const encoded = encodeURIComponent(boardCode);
  const safeQuery = encodeURIComponent(query ?? "");

  const url = `/api/posts?query=${safeQuery}&boardCode=${encoded}&page=${page}&size=${size}`;

  try {
    const res = await apiFetch(url, {
      cache: "no-store",
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      console.error("❌ fetch 실패. status:", res.status);
      const errorText = await res.text();
      console.error("❌ 에러 내용:", errorText);
      return null;
    }

    const data = await res.json();
    return data as PostListWithBoardName;
  } catch (err) {
    console.error("🔥 예외 발생:", err);
    return null;
  }
}

export async function fetchPostsByBoardId(
  boardId: number,
  page: number = 1,
  size: number = 10,
  query: string = "",
): Promise<{
  content: PostListItem[];
  totalPages: number;
  totalElements: number;
}> {
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
    throw new Error(`게시판(${boardId}) 게시글 목록을 불러오는 데 실패했습니다.`);
  }

  return res.json();
}

export const createCriticPost = async (data: PostCreateRequestDto) => {
  const response = await apiFetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ✅ withCredentials에 해당
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`게시글 생성 실패: ${response.status}`);
  }

  return await response.json();
};

export const getCriticPostDetail = async (postId: string): Promise<PostDetail> => {
  const res = await apiFetch(`/api/posts/${postId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // SSR 시 항상 fresh 데이터 가져오도록
  });

  if (!res.ok) {
    console.error("❌ 게시글 상세 조회 실패:", res.status);
    const errText = await res.text();
    throw new Error(`게시글 불러오기 실패: ${errText}`);
  }

  const data = await res.json();
  return data as PostDetail;
};
