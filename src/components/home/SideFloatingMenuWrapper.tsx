// ✅ src/components/home/SideFloatingMenuWrapper.tsx
"use client";

import { SideFloatingMenu } from "./SideFloationMenu";
import { useUserStore } from "@/stores/userStore";
import { usePathname } from "next/navigation";

export const SideFloatingMenuWrapper = () => {
  const { userInfo } = useUserStore();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean); // ["critic", "politics"] 또는 ["humor"] 등

  let writePath = "";

  if (segments.includes("write")) {
    writePath = pathname; // 이미 write 페이지면 그대로
  } else if (segments.length >= 2) {
    writePath = `/${segments[0]}/${segments[1]}/write`;
  } else if (segments.length === 1) {
    writePath = `/${segments[0]}/write`;
  }

  return <SideFloatingMenu writePath={writePath} userInfo={userInfo} showWriteButton={true} />;
};
