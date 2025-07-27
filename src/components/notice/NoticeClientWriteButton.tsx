"use client";

import { useUserStore } from "@/stores/userStore";
import { useRouter, usePathname } from "next/navigation";

export const NoticeClientWriteButton = () => {
  const { userInfo } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  if (!userInfo) return null;

  const handleClick = () => {
    // 현재 경로가 /notice/guideline 이라면 → /notice/guideline/write 로 이동
    router.push(`${pathname}/write`);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
    >
      글쓰기
    </button>
  );
};
