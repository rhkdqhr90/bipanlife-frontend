export interface SlideSectionProps {
  title: string;
  description?: string;
  items: {
    id: string | number;
    title: string;
    imageUrl: string;
  }[];
}
