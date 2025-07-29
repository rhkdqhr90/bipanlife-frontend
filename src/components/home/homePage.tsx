"use client";

import React from "react";
import { SlideSection } from "@/components/slideSection/SlideSection";
import { HotBestSection } from "@/components/home/HotBestSection";
import { HotNowSection } from "@/components/home/HotNowSection";
import { HighlightSection } from "@/components/home/HighlightSection";
import { StatsSection } from "@/components/home/StateSection";
import { HomePageProps } from "@/types/home";

export const HomePage = ({ slideItems, hotBestItems, hotNowItems }: HomePageProps) => {
  return (
    <main className="max-w-7xl mx-auto pt-20 px-4">
      <SlideSection
        title="🔥 요즘 뜨는 주제"
        description="커뮤니티에서 활발하게 논의되고 있는 게시글을 모았습니다."
        items={slideItems}
      />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 px-4 h-full">
          <HotBestSection
            title="🔥 핫판 BEST"
            description="요즘 가장 뜨거운 게시글 모음입니다."
            items={hotBestItems}
          />
        </div>
        <div className="lg:col-span-2 px-4 h-full">
          <HotNowSection
            title="실시간 HOT"
            description="지금 가장 많은 사람들이 보고 있는 게시글"
            items={hotNowItems}
          />
        </div>
      </div>
      <HighlightSection />
      <StatsSection />
    </main>
  );
};

export default HomePage;
