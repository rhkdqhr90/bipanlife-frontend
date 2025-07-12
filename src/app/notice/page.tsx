// src/app/notice/page.tsx

import { Suspense } from "react";
import { Pagination } from "@/components/notice/Pagination";
import { NoticeControls } from "@/components/notice/NoticeControls";
import { fetchNoticePosts } from "@/lib/apis/notice";
import { formatDateTime } from "@/utils/data";
import Link from "next/link";
import { PostListItem } from "@/types/PostListItem";

const boardId = 1;

const NoticePage = async (props: { searchParams?: { query?: string; page?: string } }) => {
  const searchParams = await props.searchParams; // ✅ 핵심 수정

  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;

  const {
    content: posts,
    totalPages,
    totalElements,
  } = await fetchNoticePosts(boardId, query, currentPage);

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b">
            <h1 className="text-2xl font-bold">공지사항</h1>
            <p className="text-sm text-gray-500 mt-1">총 {totalElements}개</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs text-gray-500 text-center">번호</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">제목</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-center">작성자</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-center">작성일</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(posts as PostListItem[]).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      {query
                        ? `'${query}'에 대한 검색 결과가 없습니다.`
                        : "등록된 공지사항이 없습니다."}
                    </td>
                  </tr>
                ) : (
                  (posts as PostListItem[]).map((post, index) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {totalElements - (currentPage - 1) * 10 - index}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <Link href={`/notice/${post.id}`} className="hover:underline">
                          {post.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {post.authorNickname}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {formatDateTime(post.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t">
            <Pagination currentPage={currentPage} totalPages={totalPages} />
            <Suspense fallback={<div>Loading...</div>}>
              <NoticeControls query={query} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticePage;
