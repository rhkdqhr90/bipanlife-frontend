"use client";

import React from "react";
import { SlideSection } from "@/components/slideSection/SlideSection";
import { HotBestSection } from "@/components/home/HotBestSection";
import { HotNowSection } from "@/components/home/HotNowSection";
import { HighlightSection } from "@/components/home/HighlightSection";
import { StatsSection } from "@/components/home/StateSection";

export const HomePage = () => {
  const mockData = [
    {
      id: 1,
      title: "AI 커뮤니티, 어디까지 왔나",
      imageUrl: "https://source.unsplash.com/random/400x300?ai",
    },
    {
      id: 2,
      title: "비판의 기술, 효과적으로 하기",
      imageUrl: "https://source.unsplash.com/random/400x300?discussion",
    },
    {
      id: 3,
      title: "다양성 있는 의견 모음",
      imageUrl: "https://source.unsplash.com/random/400x300?community",
    },
    {
      id: 4,
      title: "토론으로 성장하는 법",
      imageUrl: "https://source.unsplash.com/random/400x300?growth",
    },
  ];

  const hotBestData = [
    {
      id: 1,
      title: "GPT vs 인간, 논쟁의 중심",
      imageUrl: "https://source.unsplash.com/random/400x300?debate",
    },
    {
      id: 2,
      title: "칭찬 문화, 어디까지 허용할 것인가",
      imageUrl: "https://source.unsplash.com/random/400x300?praise",
    },
    {
      id: 3,
      title: "비판과 혐오의 경계",
      imageUrl: "https://source.unsplash.com/random/400x300?opinion",
    },
    {
      id: 4,
      title: "나쁜놈들",
      imageUrl: "https://source.unsplash.com/random/400x300?opinion",
    },
  ];
  const hotNowData = [
    {
      id: 1,
      title: "배달앱 리뷰 조작 의심 사례 모음",
      tag: "비판",
      timeAgo: "10분 전",
      views: 532,
    },
    {
      id: 2,
      title: "대형마트 PB상품의 품질 논란",
      tag: "비판",
      timeAgo: "25분 전",
      views: 487,
    },
    {
      id: 3,
      title: "서울 지하철 에스컬레이터 문제",
      tag: "토론방",
      timeAgo: "42분 전",
      views: 423,
    },
    {
      id: 4,
      title: "커피 가격 인상 논란",
      tag: "비판",
      timeAgo: "1시간 전",
      views: 398,
    },
    {
      id: 5,
      title: "팝콘 가격 정당한가요?",
      tag: "토론방",
      timeAgo: "1시간 전",
      views: 356,
    },
  ];

  return (
    <main className="max-w-7xl mx-auto pt-20 px-4">
      <SlideSection
        title="🔥 요즘 뜨는 주제"
        description="커뮤니티에서 활발하게 논의되고 있는 게시글을 모았습니다."
        items={mockData}
      />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 px-4 h-full">
          <HotBestSection
            title="🔥 핫판 BEST"
            description="요즘 가장 뜨거운 게시글 모음입니다."
            items={hotBestData}
          />
        </div>
        <div className="lg:col-span-2 px-4 h-full">
          <HotNowSection
            title="실시간 HOT"
            description="지금 가장 많은 사람들이 보고 있는 게시글"
            items={hotNowData}
          />
        </div>
      </div>
      <HighlightSection />
      <StatsSection />
    </main>
  );
};

export default HomePage;
