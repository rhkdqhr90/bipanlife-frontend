export const runtime = "edge";
// ✅ src/app/free/[type]/page.tsx
import { FreePageClient } from "@/components/free/FreePageClient";
import { VALID_TYPES } from "@/types/freetype";
import { notFound } from "next/navigation";
import { use } from "react";

export type FreeType = (typeof VALID_TYPES)[number];
interface Props {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const FreePage = ({ params, searchParams }: Props) => {
  const { type } = use(params);
  const { query = "", page = "1" } = use(searchParams);
  const currentPage = Number(page);

  if (!VALID_TYPES.includes(type as FreeType)) {
    return notFound();
  }

  return (
    <FreePageClient
      type={type as FreeType}
      query={typeof query === "string" ? query : ""}
      currentPage={currentPage}
    />
  );
};
export default FreePage;
