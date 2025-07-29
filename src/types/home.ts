export interface HomePageProps {
  slideItems: {
    id: number;
    title: string;
  }[];
  hotBestItems: {
    id: number;
    title: string;
    imageUrl: string;
  }[];
  hotNowItems: {
    id: number;
    title: string;
    boardCode: string;
    tag: string;
    timeAgo: string;
    views: number;
  }[];
}
export interface SlideItem {
  id: number;
  title: string;
}

export interface HotBestItem {
  id: number;
  title: string;
  imageUrl: string;
}

export interface HotNowItem {
  id: number;
  title: string;
  boardCode: string;
  tag: string;
  timeAgo: string;
  views: number;
}

export interface RawHotNowResponse {
  postId: number;
  title: string;
  boardCode: string;
  boardName: string;
  createdAt: string;
  viewCount: number;
}
