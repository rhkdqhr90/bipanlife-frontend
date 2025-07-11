export interface HighlightItem {
  id: number;
  title: string;
  likes: number;
  comments: number;
}

export interface HighlightColumnProps {
  title: string;
  icon?: React.ReactNode;
  items: HighlightItem[];
  color: string; // ex: "text-yellow-500"
}
