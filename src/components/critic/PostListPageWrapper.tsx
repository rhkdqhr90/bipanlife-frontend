// components/critic/PostListPageWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import { PostListPage } from "@/components/critic/PostListPage";
import { getPostListByBoardCode, Page } from "@/lib/apis/posts";
import { getPanels, NavLink } from "@/lib/apis/getPanels";
import { PostListItem, PostListWithBoardName } from "@/types/PostListItem";

type Props = {
  params: { boardType: string }; // ✅ Already resolved in server component
  searchParams?: { page?: string; query?: string }; // ✅ Already resolved in server component
};

export default function PostListPageWrapper({ params, searchParams }: Props) {
  const boardType = params.boardType;
  const boardCode = `critic/${boardType}`;

  const query = typeof searchParams?.query === "string" ? searchParams.query : "";
  let rawPage = Number(searchParams?.page);
  if (isNaN(rawPage) || rawPage < 1) rawPage = 1;
  const backendPage = rawPage - 1;

  const [postListWithBoardName, setPostListWithBoardName] = useState<PostListWithBoardName | null>(
    null,
  );
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const panels = await getPanels();
      setNavLinks(panels.find(p => p.name === "비판")?.dropdown ?? []);

      try {
        const result = await getPostListByBoardCode(boardCode, backendPage, 10, query);
        setPostListWithBoardName(result);
      } catch (error) {
        console.error("게시글 목록 불러오기 실패:", error);
      }
    };
    fetchData();
  }, [boardCode, backendPage, query]);

  const EMPTY_POST_LIST: Page<PostListItem> = {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 10,
    number: 0,
    first: true,
    last: true,
  };

  const postList = postListWithBoardName?.posts ?? EMPTY_POST_LIST;
  const boardName = postListWithBoardName?.boardName ?? "알 수 없는 게시판";

  return (
    <PostListPage
      postList={postList}
      boardName={boardName}
      page={rawPage}
      boardCode={boardCode}
      query={query}
      navLinks={navLinks}
      errorMessage={!postListWithBoardName ? "📛 게시글을 불러오지 못했습니다." : undefined}
    />
  );
}
