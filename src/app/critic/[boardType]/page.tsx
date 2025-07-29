// /critic/[boardType]/page.tsx
import { PostListPage } from "@/components/critic/PostListPage";
import { getPanels } from "@/lib/apis/getPanels";
import { getPostListByBoardCode, Page } from "@/lib/apis/posts";
import { PostListItem, PostListWithBoardName } from "@/types/PostListItem";
import { Metadata } from "next";

interface Props {
  params: Promise<{ boardType: string }>; // Promise 추가
  searchParams: Promise<{ page?: string }>; // Promise 추가
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { boardType } = await params; // ← segments에서 boardType으로 변경
  return {
    title: `비판 - ${boardType}`, // ← join("/") 제거
  };
}

export default async function CriticBoardPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const boardCode = `critic/${resolvedParams.boardType}`;

  const resolvedSearchParams = await searchParams;
  let rawPage = Number(resolvedSearchParams?.page);
  if (isNaN(rawPage) || rawPage < 1) rawPage = 1;
  const backendPage = rawPage - 1;
  let postListWithBoardName: PostListWithBoardName | null = null;

  try {
    postListWithBoardName = await getPostListByBoardCode(boardCode, backendPage);
  } catch (error) {
    console.error("게시글 목록 불러오기 실패:", error);
  }

  const EMPTY_POST_LIST: Page<PostListItem> = {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 10,
    number: 0,
    first: true,
    last: true,
  };

  // 4️⃣ 이제 총 페이지 수 확인해서 잘못된 page를 보정
  const totalPages = postListWithBoardName?.posts.totalPages ?? 1;
  const page = rawPage > totalPages ? totalPages : rawPage;

  // 5️⃣ 필요한 경우 재조회
  if (page !== rawPage) {
    try {
      postListWithBoardName = await getPostListByBoardCode(boardCode, page);
    } catch (error) {
      console.error("게시글 재조회 실패:", error);
    }
  }

  const postList = postListWithBoardName?.posts ?? EMPTY_POST_LIST;
  const boardName = postListWithBoardName?.boardName ?? "알 수 없는 게시판";
  const navLinks = await getPanels();
  const criticPanels = navLinks.filter(panel => panel.href === "critic");

  return (
    <PostListPage
      postList={postList}
      boardName={boardName}
      page={page}
      boardCode={boardCode}
      navLinks={criticPanels}
      errorMessage={!postList ? "📛 게시글을 불러오지 못했습니다." : undefined}
    />
  );
}
