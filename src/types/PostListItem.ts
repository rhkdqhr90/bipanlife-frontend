import { Page } from "@/lib/apis/posts";
interface Rating {
  name: string;
  score: number;
  type: "POSITIVE" | "NEGATIVE";
}
export interface PostListItem {
  ratings: Rating[];
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
export interface PostListWithBoardName {
  boardName: string;
  posts: Page<PostListItem>;
}
export interface PostDetail {
  id: number;
  title: string;
  content: string;
  tags: string[];
  ratings: {
    name: string;
    score: number;
    type: "positive" | "negative";
  }[];
  placeName?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  boardCode: string;
}
