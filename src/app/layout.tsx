// ✅ src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubMenuWrapper } from "@/components/layout/Menu/SubMenuWarrper";
import { getPanels } from "@/lib/apis/getPanels";
import { SideFloatingMenuWrapper } from "@/components/home/SideFloatingMenuWrapper";
// ✅ 모든 하위 라우트에 Edge Runtime 적용
export const runtime = "edge";

// ✅ (권장) SSR에서 외부 fetch 문제 회피해 첫 배포 안정화
export const dynamic = "force-dynamic";
export const revalidate = 0;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "비판생 - 건강한 비판의 시작",
  description: "의미 있는 토론과 비판의 공간",
  icons: {
    icon: "/favicon.ico", // public 경로 기준
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const navLinks = await getPanels();

  return (
    <html lang="ko">
      <body className={`${inter.className} bg-[#f8f9fa]`}>
        <div className="flex flex-col min-h-screen pt-16">
          <Header navLinks={navLinks} />
          <SubMenuWrapper navLinks={navLinks} />
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">{children}</main>
          <Footer navLinks={navLinks} />
          <SideFloatingMenuWrapper />
        </div>
      </body>
    </html>
  );
}
