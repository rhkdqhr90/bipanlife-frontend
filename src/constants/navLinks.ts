// ✅ src/constants/navLinks.ts
import { MenuItem } from "@/types/MenuItem";

interface NavLink {
  name: string;
  href?: string;
  dropdown?: MenuItem[];
}

export const navLinks: NavLink[] = [
  {
    name: "핫판",
    href: "/hot",
    dropdown: [
      { name: "핫게시글", href: "/hot" },
      { name: "핫태그", href: "/hot/comments" },
    ],
  },

  {
    name: "비판",
    href: "/criticism",
    dropdown: [
      { name: "경제", href: "/criticism/economic" },
      { name: "음식점", href: "/criticism/food" },
      { name: "여행지", href: "/criticism/travel" },
      { name: "가게", href: "/criticism/store" },
      { name: "사이트", href: "/criticism/site" },
      { name: "제품", href: "/criticism/goods" },
      { name: "자동차", href: "/criticism/car" },
    ],
  },
  {
    name: "토론방",
    href: "/discussion",
    dropdown: [
      { name: "실시간 토론방", href: "/discussion/live" },
      { name: "주제별 토론", href: "/discussion/topics" },
    ],
  },
  {
    name: "자유게시판",
    href: "/free",
    dropdown: [
      { name: "자유게시판", href: "/free/free" },
      { name: "잡담", href: "/free/general" },
      { name: "일상", href: "/free/life" },
      { name: "취미", href: "/free/hobby" },
    ],
  },
  {
    name: "유머",
    href: "/humor",
  },
  {
    name: "공지",
    href: "/notice/notice",
    dropdown: [
      { name: "공지 사항", href: "/notice/notice" },
      { name: "이용약관", href: "/notice/terms" },
      { name: "자주 묻는 질문", href: "/notice/faq" },
      { name: "가이드라인", href: "/notice/guideline" },
    ],
  },
];
