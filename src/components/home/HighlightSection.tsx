// ✅ src/components/home/HighlightSection.tsx
"use client";

import React, { useEffect, useState } from "react";
import { HighlightColumn } from "@/components/home/HighlightColumn";
import { HighlightColumnProps } from "@/types/Highlight";
import { Smile, Heart, MessageCircle } from "lucide-react";

export const HighlightSection: React.FC = () => {
  const [humorItems, setHumorItems] = useState<HighlightColumnProps["items"]>([]);
  const [praiseItems, setPraiseItems] = useState<HighlightColumnProps["items"]>([]);
  const [debateItems, setDebateItems] = useState<HighlightColumnProps["items"]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/highlight/humor`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setHumorItems(data);
        else console.error("❗ humor 응답이 배열이 아닙니다", data);
      });

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/highlight/praise`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPraiseItems(data);
        else if (Array.isArray(data.items)) setPraiseItems(data.items);
        else console.error("❗ praise 응답이 배열이 아닙니다", data);
      });

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/highlight/debate`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDebateItems(data);
        else if (Array.isArray(data.items)) setDebateItems(data.items);
        else console.error("❗ debate 응답이 배열이 아닙니다", data);
      });
  }, []);
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
