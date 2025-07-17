// ✅ src/app/notice/[type]/page.tsx
import { NoticePageClient } from "@/components/notice/NoticePageClient";
import { notFound } from "next/navigation";

export const VALID_TYPES = [
  "notice",
  "terms",
  "privacy",
  "guideline",
  "discussion",
  "faq",
] as const;

export type NoticeType = (typeof VALID_TYPES)[number];

interface Props {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const NoticePage = async ({ params, searchParams }: Props) => {
  const { type } = await params;
  const search = await searchParams;

  if (!VALID_TYPES.includes(type as NoticeType)) {
    return notFound();
  }

  const query = typeof search.query === "string" ? search.query : "";
  const currentPage = Number(search.page) || 1;

  return <NoticePageClient type={type as NoticeType} query={query} currentPage={currentPage} />;
};

export default NoticePage;
