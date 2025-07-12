"use client";
import Link from "next/link";
import { useUserStore } from "@/stores/userStore";

export const ClientWriteButton = () => {
  const { userInfo } = useUserStore();

  if (!userInfo) return null;

  return (
    <Link
      href="/notice/write"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
    >
      글쓰기
    </Link>
  );
};
