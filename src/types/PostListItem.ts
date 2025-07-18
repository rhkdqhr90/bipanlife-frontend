export interface PostListItem {
  id: number;
  title: string;
  authorNickname: string;
  viewCount: number; // ✅ 순서 4
  likeCount: number; // ✅ 순서 5
  dislikeCount: number; // ✅ 순서 6
  commentCount: number; // ✅ 순서 7
  createdAt: string; // ✅ 순서 8 (LocalDateTime → string으로 받음)
  tags: string[]; // ✅ 순서 9
}
