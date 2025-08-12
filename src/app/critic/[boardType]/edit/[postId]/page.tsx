"use client";

import CriticEditClient from "@/components/critic/CriticEditClient";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CriticEditPage({ params }: { params: any }) {
  const { boardType, postId } = params;

  return <CriticEditClient postId={postId} boardCode={boardType} />;
}
