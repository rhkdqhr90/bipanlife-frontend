// 📄 src/lib/apis/comments.ts

import { PostComment } from "@/types/comment";

// ✅ 댓글 작성
export const postComment = async (postId: number, content: string, parentId?: number) => {
  const response = await fetch(`/api/comments`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postId,
      content,
      parentId: parentId ?? null,
    }),
  });

  if (!response.ok) throw new Error("댓글 작성 실패");
  return await response.json();
};

// ✅ 댓글 목록 조회
export async function fetchComments(postId: number): Promise<PostComment[]> {
  const res = await fetch(`/api/comments/posts/${postId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("댓글 불러오기 실패");
  }
  return res.json();
}

// ✅ 댓글 수정
export const updateComment = async (commentId: number, content: string) => {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) throw new Error("댓글 수정 실패");
  return await response.json();
};

// ✅ 댓글 삭제
export const deleteComment = async (commentId: number) => {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) throw new Error("댓글 삭제 실패");
};
