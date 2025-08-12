// 📄 src/app/notice/[postId]/page.tsx
"use client";
export const runtime = "edge";
import NoticeDetailClient from "@/app/notice/[type]/[postId]/Client";

export default function NoticeDetailPage() {
  return <NoticeDetailClient />;
}
