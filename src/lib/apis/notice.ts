// 📄 src/lib/apis/notice.ts ← 여기에 있어야 함 (확장자 .ts, 컴포넌트 아님)
export const fetchNoticePostById = async (postId: number, token?: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${postId}`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) return null;
  return res.json();
};

export const fetchNoticePosts = async (boardId: number, query: string = "", page: number = 1) => {
  const size = 10;

  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/boards/${boardId}`);
  url.searchParams.append("page", String(page - 1));
  url.searchParams.append("size", String(size));
  if (query) {
    url.searchParams.append("query", query);
  }

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("공지사항 목록을 불러오는 데 실패했습니다.");
  }

  return res.json();
};
