// ✅ src/components/home/HighlightSection.tsx
"use client";

import React from "react";
import { HighlightColumn } from "@/components/home/HighlightColumn";
import { HighlightColumnProps } from "@/types/Highlight";
import { Smile, Heart, MessageCircle } from "lucide-react";

export const HighlightSection: React.FC = () => {
  // 각각의 데이터는 더미(mock)로 추후 API 연결 예정
  const humorItems: HighlightColumnProps["items"] = [
    { id: 1, title: "음식점에서 있었던 웃긴 실수 모음", likes: 145, comments: 32 },
    { id: 2, title: "카페 알바생이 겪은 황당한 손님들", likes: 132, comments: 28 },
    { id: 3, title: "여행 중 벌어진 예상치 못한 해프닝", likes: 118, comments: 25 },
  ];

  const praiseItems: HighlightColumnProps["items"] = [
    { id: 1, title: "친절한 대응으로 감동받은 고객센터", likes: 98, comments: 21 },
    { id: 2, title: "위기 상황에서 빛난 시민 의식", likes: 87, comments: 19 },
    { id: 3, title: "감동적인 서비스로 단골이 된 식당", likes: 76, comments: 17 },
  ];

  const debateItems: HighlightColumnProps["items"] = [
    { id: 1, title: "배달 음식 적정 팁 문화, 어떻게 생각하시나요?", likes: 78, comments: 156 },
    { id: 2, title: "카페에서 자리만 차지하는 행위, 제한해야 할까요?", likes: 65, comments: 143 },
    { id: 3, title: "관광지 사진 촬영 제한, 필요한 조치일까요?", likes: 59, comments: 127 },
  ];

  return (
    <section className="px-4 mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 divide-gray-200">
      <HighlightColumn
        title="오늘의 유머"
        icon={<Smile size={18} />}
        items={humorItems}
        color="text-yellow-500"
      />
      <HighlightColumn
        title="따뜻한 칭찬"
        icon={<Heart size={18} />}
        items={praiseItems}
        color="text-pink-500"
      />
      <HighlightColumn
        title="HOT 토론"
        icon={<MessageCircle size={18} />}
        items={debateItems}
        color="text-blue-500"
      />
    </section>
  );
};
