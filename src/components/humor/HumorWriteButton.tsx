"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";

export const HumorWriteButton = () => {
  const { userInfo } = useUserStore();
  const router = useRouter();

  if (!userInfo) return null;

  return (
    <button
      onClick={() => router.push("/humor/write")}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
    >
      글쓰기
    </button>
  );
};
