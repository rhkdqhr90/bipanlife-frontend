import { PostListPage } from "@/components/post/PostListPage";
import { getPanels } from "@/lib/apis/getPanels";
import { getPostListByBoardCode } from "@/lib/apis/posts";
import { Metadata } from "next";

interface Props {
  params: Promise<{ code: string[] }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `비판 - ${code.join("/")}`,
  };
}

export default async function CriticBoardPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const boardCode = resolvedParams.code.join("/");
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page ?? 1);
  console.log(boardCode);
  const postList = await getPostListByBoardCode(boardCode, page);

  if (!postList) {
    return <div>📛 게시글을 불러오지 못했습니다.</div>;
  }

  const navLinks = await getPanels();
  const criticPanels = navLinks.filter(panel => panel.href === "critic");

  return (
    <div className="px-4 sm:px-8 md:px-12 py-6 max-w-screen-xl mx-auto">
      <PostListPage
        postList={postList}
        boardName={"ㅇd"}
        page={page}
        boardCode={boardCode}
        navLinks={criticPanels}
      />
    </div>
  );
}
