// ✅ src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SideFloatingMenu } from "@/components/home/SideFloationMenu";
import { HotBestSection } from "@/components/home/HotBestSection";
import { SubMenu } from "@/components/layout/SubMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "비판생 - 건강한 비판의 시작",
  description: "의미 있는 토론과 비판의 공간",
};

import { navLinks } from "@/constants/navLinks";

// Define a dummy data fetching function for HotBestSection
async function getHotBestItems() {
  // In a real application, you would fetch this from your API
  // For now, let's use dummy data to resolve the 'items is undefined' error
  return [
    { id: 1, title: "인기 게시물 1", imageUrl: "/images/placeholder1.jpg" },
    { id: 2, title: "인기 게시물 2", imageUrl: "/images/placeholder2.jpg" },
    { id: 3, title: "인기 게시물 3", imageUrl: "/images/placeholder3.jpg" },
    { id: 4, title: "인기 게시물 4", imageUrl: "/images/placeholder4.jpg" },
  ];
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const hotBestItems = await getHotBestItems();
  const noticeDropdownItems = navLinks.find(link => link.name === "공지")?.dropdown || [];

  return (
    <html lang="ko">
      <body className={`${inter.className} bg-[#f8f9fa]`}>
        <div className="flex flex-col min-h-screen pt-16">
          <Header />
          <SubMenu menuItems={noticeDropdownItems} />
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">{children}</main>
          <div className="w-full max-w-6xl mx-auto px-4 pt-6 mt-6 border-t border-gray-200">
            <HotBestSection title="인기 게시물" items={hotBestItems} />
          </div>
          <Footer />
          <SideFloatingMenu />
        </div>
      </body>
    </html>
  );
}
