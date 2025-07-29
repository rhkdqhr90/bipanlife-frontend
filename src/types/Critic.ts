// types/post.ts
export interface RatingInput {
  name: string;
  score: number;
  type: "positive" | "negative";
}

export interface PostCreateRequestDto {
  boardId: number;
  title: string;
  content: string;
  tags: string[];
  ratings: RatingInput[];
  boardType: string;
  placeName?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}
