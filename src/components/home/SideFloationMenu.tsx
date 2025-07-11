// ✅ src/components/home/SideFloatingMenu.tsx
"use client";

import React from "react";
import { Pencil, Search, RotateCcw, ArrowUp } from "lucide-react";

export const SideFloatingMenu = () => {
  return (
    <>
      {/* ✅ 데스크탑용 사이드 고정 메뉴 */}
      <div className="hidden lg:flex flex-col gap-3 fixed top-[150px] z-50 lg:right-6 xl:right-[calc((100vw-1280px)/2-24px)]">
        <button className="bg-white shadow-md p-3 rounded-full hover:bg-gray-100 transition">
          <Pencil className="w-5 h-5 text-gray-700" />
        </button>
        <button className="bg-white shadow-md p-3 rounded-full hover:bg-gray-100 transition">
          <Search className="w-5 h-5 text-gray-700" />
        </button>
        <button className="bg-white shadow-md p-3 rounded-full hover:bg-gray-100 transition">
          <RotateCcw className="w-5 h-5 text-gray-700" />
        </button>
        <button
          className="bg-indigo-500 p-3 rounded-full hover:bg-indigo-600 transition"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* ✅ 모바일 대응: 우측 하단 FAB */}
      <div className="lg:hidden fixed bottom-6 right-4 z-50 flex gap-3">
        <button
          className="bg-indigo-500 p-3 rounded-full shadow-md"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      </div>
    </>
  );
};
