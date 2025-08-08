export interface HighlightItem {
  id: number;
  title: string;
  likes: number;
  comments: number;
  boardCode: string; //
}

export interface HighlightColumnProps {
  title: string;
  icon?: React.ReactNode;
  items: HighlightItem[];
  color: string; // ex: "text-yellow-500"
}
