
// app/critic/[boardType]/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import PostListPageWrapper from "@/components/critic/PostListPageWrapper";

type Props = {
  params: Promise<{ boardType: string }>; // ✅ Now a Promise
  searchParams?: Promise<{ page?: string; query?: string }>; // ✅ Now a Promise
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params; // ✅ Await params
  const boardType = params.boardType;
  return {
    title: `비판 - ${boardType}`,
  };
}

export default async function CriticBoardPage({ params, searchParams }: Props) {
  // ✅ Await both params and searchParams
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <PostListPageWrapper params={resolvedParams} searchParams={resolvedSearchParams || {}} />
    </Suspense>
  );
}
