// ✅ src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SideFloatingMenu } from "@/components/home/SideFloationMenu";

import { SubMenuWrapper } from "@/components/layout/Menu/SubMenuWarrper";
import { getPanels } from "@/lib/apis/getPanels";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "비판생 - 건강한 비판의 시작",
  description: "의미 있는 토론과 비판의 공간",
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
          <Footer />
          <SideFloatingMenu />
        </div>
      </body>
    </html>
  );
}
