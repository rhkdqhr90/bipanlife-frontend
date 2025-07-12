export const navLinks = [
  { name: "핫판", href: "/hot" },
  {
    name: "비판",
    dropdown: [
      { name: "비판 하위메뉴 1", href: "/bipan/sub1" },
      { name: "비판 하위메뉴 2", href: "/bipan/sub2" },
    ],
  },
  {
    name: "토론방",
    dropdown: [
      { name: "토론방 하위메뉴 1", href: "/discussion/sub1" },
      { name: "토론방 하위메뉴 2", href: "/discussion/sub2" },
    ],
  },
  {
    name: "자유게시판",
    dropdown: [
      { name: "자유게시판 하위메뉴 1", href: "/freeboard/sub1" },
      { name: "자유게시판 하위메뉴 2", href: "/freeboard/sub2" },
    ],
  },
  { name: "유머", href: "/humor" },
  {
    name: "공지",
    dropdown: [
      { name: "공지", href: "/notice" },
      { name: "이용약관", href: "/notice/terms" },
      { name: "개인정보처리방침", href: "/notice/privacy" },
      { name: "커뮤니티 가이드라인", href: "/notice/guidelines" },
      { name: "토론방 이용규칙", href: "/notice/rules" },
      { name: "자주 묻는 질문(FAQ)", href: "/notice/faq" },
    ],
  },
];
