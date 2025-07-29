export type RangeType = "TODAY" | "WEEK" | "MONTH";

// 📁 /types/hot.ts
export interface HotPost {
  postId: number;
  title: string;
  boardType: string;
  boardCode: string;
  thumbnailUrl?: string;
  averageRating?: number; // 1.0 ~ 5.0
  authorNickname: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
}

// 📁 /types/hot.ts
export interface HotTag {
  tagName: string;
  likeCount: number;
  frequency: number;
}

export interface HotPostResponse {
  postId: number;
  title: string;
  boardType: string;
  boardCode: string;
  thumbnailUrl: string | null; // 첫 이미지 (없으면 null)
  ratingAverage: number;
  authorNickname: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
}

export interface HotTagResponse {
  tagName: string;
  likeCount: number;
  postCount: number;
}

// 📄 /types/hot.ts

export interface HotPostByTagResponse {
  postId: number;
  tagName: string;
  boardType: string;
  boardCode: string;
  title: string;
  authorNickname: string;
  averageRating: number;
  createdAt: string;
  likeCount: number;
  viewCount: number;
  thumbnailUrl: string;
}
