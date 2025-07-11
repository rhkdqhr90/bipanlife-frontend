"use client";

import React from "react";
import { Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1F2937] text-gray-300 text-sm pt-10 pb-6 px-4 md:px-10 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-600 pb-10">
        {/* 브랜드 및 소개 */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-3">BipanLife</h2>
          <p className="mb-4 text-gray-400">더 나은 소비 결정을 위한 비판적 리뷰 플랫폼</p>
          <div className="flex space-x-4">
            <Facebook className="w-5 h-5 text-gray-400 hover:text-white" />
            <Twitter className="w-5 h-5 text-gray-400 hover:text-white" />
            <Instagram className="w-5 h-5 text-gray-400 hover:text-white" />
          </div>
        </div>

        {/* 카테고리 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">카테고리</h3>
          <ul className="space-y-2">
            <li>핫판</li>
            <li>비판</li>
            <li>칭찬</li>
            <li>토론방</li>
            <li>자유게시판</li>
          </ul>
        </div>

        {/* 이용 안내 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">이용 안내</h3>
          <ul className="space-y-2">
            <li>이용약관</li>
            <li>개인정보처리방침</li>
            <li>커뮤니티 가이드라인</li>
            <li>토론방 이용 규칙</li>
            <li>자주 묻는 질문</li>
          </ul>
        </div>

        {/* 문의하기 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">문의하기</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>contact@bipanlife.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>02-123-4567</span>
            </li>
            <li>
              <button className="bg-indigo-500 text-white py-1 px-4 rounded hover:bg-indigo-600 text-sm">
                제휴 문의하기
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* 하단 카피라이트 + 결제 수단 */}
      <div className="max-w-7xl mx-auto mt-6 flex flex-col md:flex-row justify-between items-center px-4 md:px-0 text-gray-500">
        <p className="text-xs">
          © 2025 BipanLife - 비판과 토론을 위한 커뮤니티. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <img src="/icons/visa.svg" alt="Visa" className="h-5" />
          <img src="/icons/mastercard.svg" alt="MasterCard" className="h-5" />
          <img src="/icons/paypal.svg" alt="PayPal" className="h-5" />
        </div>
      </div>
    </footer>
  );
};
