import { PostListItem } from "@/types/PostListItem";

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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("게시글 작성 실패");

  return res.json();
}

export const updatePost = async (postId: number, body: unknown) => {
  const res = await fetch(`/api/posts/${postId}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("게시글 수정 실패");
  return res.json();
};

export const deletePost = async (postId: number) => {
  const res = await fetch(`/api/posts/${postId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("게시글 삭제 실패");
  return res.json();
};

// 동적 게시판 을 위한 GetBoardCode
export async function getPostListByBoardCode(
  boardCode: string,
  page: number = 0,
  size: number = 10,
): Promise<Page<PostListItem> | null> {
  const encoded = encodeURIComponent(boardCode);
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts?boardCode=${encoded}&page=${page}&size=${size}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) {
      console.error("❌ fetch 실패. status:", res.status);
      return null; // 실패 시 null 반환
    }

    return data;
  } catch (err) {
    console.error("🔥 예외 발생:", err);
    return null; // 네트워크 오류 등
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
    throw new Error(`게시판(${boardId}) 게시글 목록을 불러오는 데 실패했습니다.`);
  }

  return res.json();
}
