"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/stores/userStore";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooK/userAuth";
import { useRouter } from "next/navigation";

import { navLinks } from "@/constants/navLinks";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const { userInfo } = useUserStore();
  const { logout } = useAuth();
  const isLoggedIn = !!userInfo;

  const handleLogout = () => {
    logout();
    router.replace("/");
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1080px] flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-6">
            <div className="text-2xl font-bold min-w-[100px]">
              <Link href="/">비판생</Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6 text-sm text-gray-700">
              {navLinks.map(link =>
                link.dropdown ? (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => {
                      if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                      }
                      setOpenDropdown(link.name);
                    }}
                    onMouseLeave={() => {
                      timeoutRef.current = setTimeout(() => {
                        setOpenDropdown(null);
                      }, 200);
                    }}
                  >
                    <button className="text-gray-600 hover:text-gray-900">{link.name}</button>
                    {openDropdown === link.name && (
                      <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        {link.dropdown.map(item => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {link.name}
                  </Link>
                ),
              )}
            </nav>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="검색어 입력"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm w-[180px]"
              />
            </form>
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">{userInfo.nickname}</span>
                <span className="text-xl">👤</span>
                <button
                  onClick={handleLogout}
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
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="text-gray-600 hover:text-gray-900"
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
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pt-4 pb-6 space-y-4">
          {navLinks.map(link => (
            <div key={link.name}>
              {link.dropdown ? (
                <div>
                  <p className="font-semibold text-gray-800">{link.name}</p>
                  <div className="pl-4 mt-2 space-y-2">
                    {link.dropdown.map(item => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block text-gray-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={link.href}
                  className="block text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
          <hr />
          {isLoggedIn ? (
            <div className="flex items-center justify-between text-gray-700 px-2">
              <span className="text-sm">{userInfo.nickname}</span>
              <button onClick={handleLogout} className="text-red-500 text-sm hover:underline">
                로그아웃
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="block text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="block bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
