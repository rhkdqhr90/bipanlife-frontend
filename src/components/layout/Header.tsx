"use client";
import Link from "next/link";
import { useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { LogOut } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { userInfo, logout } = useUserStore();
  const isLoggedIn = !!userInfo;

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1080px] flex items-center justify-between px-4 py-3">
          {/* 왼쪽: 로고 + 네비 */}
          <div className="flex items-center space-x-6">
            {/* ✅ 로고 위치 맞춤 (왼쪽 너무 붙지 않게) */}
            <div className="text-2xl font-bold min-w-[100px]">
              <Link href="/">비판생</Link>
            </div>
            {/* 데스크탑 네비게이션 */}
            <nav className="hidden md:flex items-center space-x-6 text-sm text-gray-700">
              {/* 일반 링크 메뉴 */}
              <Link href="/hot" className="text-gray-600 hover:text-gray-900">
                핫판
              </Link>

              {/* "비판" 드롭다운 메뉴 */}
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown("bipan")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
                  비판
                </button>
                {openDropdown === "bipan" && (
                  <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <Link
                      href="/bipan/sub1"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      비판 하위메뉴 1
                    </Link>
                    <Link
                      href="/bipan/sub2"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      비판 하위메뉴 2
                    </Link>
                  </div>
                )}
              </div>

              {/* "토론방" 드롭다운 메뉴 */}
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown("discussion")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
                  토론방
                </button>
                {openDropdown === "discussion" && (
                  <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <Link
                      href="/discussion/sub1"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      토론방 하위메뉴 1
                    </Link>
                    <Link
                      href="/discussion/sub2"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      토론방 하위메뉴 2
                    </Link>
                  </div>
                )}
              </div>

              {/* "자유게시판" 드롭다운 메뉴 */}
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown("freeboard")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
                  자유게시판
                </button>
                {openDropdown === "freeboard" && (
                  <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <Link
                      href="/freeboard/sub1"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      자유게시판 하위메뉴 1
                    </Link>
                    <Link
                      href="/freeboard/sub2"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      자유게시판 하위메뉴 2
                    </Link>
                  </div>
                )}
              </div>

              {/* 일반 링크 메뉴 */}
              <Link href="/humor" className="text-gray-600 hover:text-gray-900">
                유머
              </Link>
              <Link href="/notice" className="text-gray-600 hover:text-gray-900">
                공지
              </Link>
            </nav>
          </div>
          {/* 데스크탑 로그인/회원가입 */}
          <div className="hidden md:flex items-center space-x-4">
            {/* 검색창 */}
            <input
              type="text"
              placeholder="검색어 입력"
              className="border border-gray-300 rounded px-3 py-1 text-sm w-[180px]"
            />

            {/* 로그인 상태 */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">{userInfo.nickname}</span>
                {/* 👉 프로필 이미지 대신 이모지 대체 가능 */}
                <span className="text-xl">👤</span>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-red-500 transition"
                  title="로그아웃"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900">
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 모바일 햄버거 버튼 */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pt-4 pb-6 space-y-4">
          <Link href="/community" className="block text-gray-700">
            커뮤니티
          </Link>
          <Link href="/qna" className="block text-gray-700">
            Q&A
          </Link>
          <Link href="/news" className="block text-gray-700">
            뉴스
          </Link>
          <hr />
          <Link href="/login" className="block text-gray-700">
            로그인
          </Link>
          <Link
            href="/signup"
            className="block bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600"
          >
            회원가입
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
