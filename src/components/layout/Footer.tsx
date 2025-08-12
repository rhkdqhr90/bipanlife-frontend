"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import type { NavLink } from "@/lib/apis/getPanels";

type Props = {
  /** layout.tsx 에서 getPanels()로 만든 메뉴 데이터를 그대로 내려주세요 */
  navLinks: NavLink[];
};

export const Footer: React.FC<Props> = ({ navLinks }) => {
  // 그룹 한글명으로 1차 링크를 찾고, 없으면 fallback 사용
  const findHref = (koName: string, fallback: string) =>
    navLinks.find(n => n.name === koName)?.href ?? fallback;

  const hotHref = "/hot?range=TODAY";
  const criticHref = findHref("비판", "/critic/politics");
  const freeHref = findHref("자유", "/free/general");
  const discussionHref = findHref("토론방", "/discussion");

  return (
    <footer className="bg-[#1F2937] text-gray-300 text-sm pt-10 pb-6 px-4 md:px-10 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-600 pb-10">
        {/* 브랜드 및 소개 */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-3">BipanLife</h2>
          <p className="mb-4 text-gray-400">더 나은 소비 결정을 위한 비판적 리뷰 플랫폼</p>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/bipanlife" target="_blank" rel="noopener noreferrer">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white" />
            </a>
            <a href="https://twitter.com/bipanlife" target="_blank" rel="noopener noreferrer">
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white" />
            </a>
            <a href="https://www.instagram.com/bipanlife" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white" />
            </a>
          </div>
        </div>

        {/* 카테고리 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">카테고리</h3>
          <ul className="space-y-2">
            <li>
              <Link href={hotHref}>핫판</Link>
            </li>
            <li>
              <Link href={criticHref}>비판</Link>
              {/* 필요하면 하위 보드 펼치기 */}
              {/* <ul className="mt-2 ml-3 space-y-1">
                {findDropdown("비판").map(item => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.name}</Link>
                  </li>
                ))}
              </ul> */}
            </li>
            <li>
              <Link href={discussionHref}>토론방</Link>
            </li>
            <li>
              <Link href={freeHref}>자유게시판</Link>
            </li>
          </ul>
        </div>

        {/* 이용 안내 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">이용 안내</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/notice/terms">이용약관</Link>
            </li>
            <li>
              <Link href="/notice/privacy">개인정보처리방침</Link>
            </li>
            <li>
              <Link href="/notice/guideline">커뮤니티 가이드라인</Link>
            </li>
            <li>
              <Link href="/notice/discussion">토론방 이용 규칙</Link>
            </li>
            <li>
              <Link href="/notice/faq">자주 묻는 질문</Link>
            </li>
          </ul>
        </div>

        {/* 문의하기 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">문의하기</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>rhkdqhr09@naver.com</span>
            </li>
            <li>
              <Link href="/partner">
                <button className="bg-indigo-500 text-white py-1 px-4 rounded hover:bg-indigo-600 text-sm">
                  제휴 문의하기
                </button>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* 하단 카피라이트 */}
      <div className="max-w-7xl mx-auto mt-6 flex flex-col md:flex-row justify-between items-center px-4 md:px-0 text-gray-500">
        <p className="text-xs">
          © 2025 BipanLife - 비판과 토론을 위한 커뮤니티. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
