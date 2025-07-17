"use clinet";

import { HumorPageClient } from "@/components/humor/HumorPageClinet";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

const HumorPage = async ({ searchParams }: Props) => {
  const params = await searchParams; // Await searchParams to resolve the Promise
  const query = typeof params.query === "string" ? params.query : "";
  const currentPage = Number(params.page) || 1;

  return <HumorPageClient query={query} currentPage={currentPage} />;
};

export default HumorPage;
