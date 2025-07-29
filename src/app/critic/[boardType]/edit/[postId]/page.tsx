"use client";

import CriticEditClient from "@/components/critic/CriticEditClient";

export default function CriticEditPage({
  params,
}: {
  params: { boardType: string; postId: string };
}) {
  const { boardType, postId } = params;

  return <CriticEditClient postId={postId} boardCode={boardType} />;
}
