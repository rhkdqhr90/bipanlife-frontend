// 📁 src/lib/apis/reactions.ts

export type ReactionType = "LIKE" | "DISLIKE";

/**
 * 게시글 또는 댓글에 추천/비추천 요청을 보냅니다.
 * @param target "posts" | "comments"
 * @param id 대상 ID (postId or commentId)
 * @param type "LIKE" 또는 "DISLIKE"
 */
export async function react(
  target: "posts" | "comments",
  id: number,
  type: ReactionType,
): Promise<void> {
  const endpoint = `/api/${target}/${id}/${type.toLowerCase()}`;
  const res = await fetch(endpoint, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`❌ ${target} ${type} 요청 실패: ${err}`);
  }
}
