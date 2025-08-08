"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { useUserStore } from "@/stores/userStore";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hook/userAuth";
import { useRouter, usePathname } from "next/navigation";
import { NavLink } from "@/types/MenuItem";

interface HeaderProps {
  navLinks: NavLink[];
}

export const Header = ({ navLinks }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { userInfo, setUser } = useUserStore();
  const isLoggedIn = !!userInfo;
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
          credentials: "include", // 서버가 쿠키 기반 JWT라면 유지
        });

        if (!res.ok) throw new Error("Unauthorized");

        const user = await res.json();
        setUser(user);
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
        // alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        // logout();
        // router.push("/login");
      }
    };

    fetchUser();
  }, []);

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

  const handleLogout = () => {
    logout();
    router.replace("/");
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    const currentPath = window.location.pathname + window.location.search;
    const encodedRedirect = encodeURIComponent(currentPath);
    router.push(`/login?redirectUri=${encodedRedirect}`);
  };

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
          {/* 로고 + 메뉴 */}
          <div className="flex items-center space-x-6">
            <div className="text-2xl font-bold min-w-[100px] mr-32">
              <Link href="/">비판생</Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6 text-sm text-gray-700">
              {navLinks.map(link => {
                const isDropdown = !!link.dropdown?.length;
                const isActive =
                  pathname === link.href ||
                  link.dropdown?.some(item => pathname.startsWith(item.href));

                return isDropdown ? (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => {
                      if (timeoutRef.current) clearTimeout(timeoutRef.current);
                      setOpenDropdown(link.name);
                    }}
                    onMouseLeave={() => {
                      timeoutRef.current = setTimeout(() => {
                        setOpenDropdown(null);
                      }, 200);
                    }}
                  >
                    <Link
                      href={link.href || "#"}
                      className={`text-gray-600 hover:text-gray-900 inline-block ${
                        isActive ? "text-blue-600 font-bold" : ""
                      }`}
                    >
                      {link.name}
                    </Link>

                    {openDropdown === link.name && (
                      <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-[9999]">
                        {link.dropdown?.map(item => {
                          const isSubActive = pathname === item.href;
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                                isSubActive ? "text-blue-600 font-semibold" : "text-gray-700"
                              }`}
                            >
                              {item.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href!}
                    className={`text-gray-600 hover:text-gray-900 ${
                      isActive ? "text-blue-600 font-bold" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 로그인/검색 영역 */}
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
                <Link href="/mypage">
                  <span className="text-xl">👤</span>
                </Link>

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
                <button onClick={handleLogin} className="text-gray-600 hover:text-gray-900">
                  로그인
                </button>
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
        <div className="md:hidden fixed top-2 right-3 z-50">
          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="text-gray-600 hover:text-gray-900 p-2"
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
        <div className="md:hidden fixed top-[64px] left-0 right-0 bg-white shadow-md px-4 pt-4 pb-6 space-y-4 z-50 max-h-[calc(100vh-64px)] overflow-y-auto">
          {navLinks.map(link => {
            const hasDropdown = Array.isArray(link.dropdown) && link.dropdown.length > 0;
            return (
              <div key={link.name}>
                {hasDropdown ? (
                  <div>
                    <p className="font-semibold text-gray-800">{link.name}</p>
                    <div className="pl-4 mt-2 space-y-2">
                      {link.dropdown?.map(item => (
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
                    href={link.href!}
                    className="block text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            );
          })}
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
