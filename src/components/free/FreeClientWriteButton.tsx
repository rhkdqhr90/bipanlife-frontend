"use client";

import { useUserStore } from "@/stores/userStore";
import { useRouter, usePathname } from "next/navigation";

export const FreeClientWriteButton = () => {
  const { userInfo } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  if (!userInfo) return null;

  const handleClick = () => {
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
