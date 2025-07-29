export interface SlideItem {
  id: number;
  title: string;
  author?: string; // optional
}
export interface SlideSectionProps {
  title: string;
  description?: string;
  items: SlideItem[];
}

