// src/types/post.ts
export interface PostListItem {
  id: number;
  title: string;
  authorNickname: string;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  createdAt: string; // LocalDateTime → string
  viewCount: number;
  tags: string[];
}
