"use client";

import React from "react";
import { BarChart2, MessageCircle, Users, FileText } from "lucide-react";

export const StatsSection = () => {
  const stats = [
    {
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      label: "오늘 새 글",
      value: 128,
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-green-500" />,
      label: "오늘 댓글",
      value: 562,
    },
    {
      icon: <Users className="w-6 h-6 text-purple-500" />,
      label: "오늘 방문자",
      value: 2045,
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-pink-500" />,
      label: "오늘 가입자",
      value: 31,
    },
  ];

  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 bg-white rounded-xl shadow-md p-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="flex flex-col items-center">
          {stat.icon}
          <div className="mt-2 text-lg font-semibold">{stat.value.toLocaleString()}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </section>
  );
};
