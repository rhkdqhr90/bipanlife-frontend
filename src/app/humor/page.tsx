export const runtime = "edge";

import { HumorPageClient } from "@/components/humor/HumorPageClinet";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const HumorPage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams.query === "string" ? resolvedSearchParams.query : "";
  const currentPage = Number(resolvedSearchParams.page) || 1;

  return <HumorPageClient query={query} currentPage={currentPage} />;
};

export default HumorPage;
