"use client";

import { useEffect, useState } from "react";
import { Pagination } from "../common/Pagination";
import { fetchNoticePostsByType } from "@/lib/apis/notice";
import { formatDateTime } from "@/utils/data";
import Link from "next/link";
import { PostListItem } from "@/types/PostListItem";
import { navLinks } from "@/constants/navLinks";
import type { NoticeType } from "@/app/notice/[type]/page";
import { SearchControls } from "../common/SearchControls";

interface Props {
  type: NoticeType;
  query: string;
  currentPage: number;
}

export const NoticePageClient = ({ type, query, currentPage }: Props) => {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { content, totalPages, totalElements } = await fetchNoticePostsByType(
          type,
          query,
          currentPage,
        );
        setPosts(content);
        setTotalPages(totalPages);
        setTotalElements(totalElements);
      } catch (err) {
        console.error("공지 목록 조회 실패", err);
      }
    };
    load();
  }, [type, query, currentPage]);

  const noticeTitle =
    navLinks
      .find(link => link.name === "공지")
      ?.dropdown?.find(item => item.href === `/notice/${type}`)?.name ?? "공지사항";

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          {/* 헤더 */}
          <div className="px-6 py-5 border-b">
            <h1 className="text-2xl font-bold">{noticeTitle}</h1>
            <p className="text-sm text-gray-500 mt-1">총 {totalElements}개</p>
          </div>

          {/* 🖥 PC 테이블 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs text-gray-500 text-center">번호</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-left">제목</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-center">작성자</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-center">작성일</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-center">조회수</th>
                  <th className="px-6 py-3 text-xs text-gray-500 text-center">추천</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      {query
                        ? `'${query}'에 대한 검색 결과가 없습니다.`
                        : "등록된 게시물이 없습니다."}
                    </td>
                  </tr>
                ) : (
                  posts.map((post, index) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {totalElements - (currentPage - 1) * 10 - index}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <Link href={`/notice/${type}/${post.id}`} className="hover:underline">
                          {post.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {post.authorNickname}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {formatDateTime(post.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {post.viewCount}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {post.likeCount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 📱 모바일 카드형 리스트 */}
          <div className="md:hidden px-4 divide-y divide-gray-100">
            {posts.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                {query ? `'${query}'에 대한 검색 결과가 없습니다.` : "📭 등록된 게시물이 없습니다."}
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="py-4">
                  <Link href={`/notice/${type}/${post.id}`} className="block">
                    <h2 className="font-semibold text-gray-800 text-base line-clamp-2">
                      {post.title}
                    </h2>
                    <div className="text-sm text-gray-500 mt-1">
                      <span className="mr-3">작성자: {post.authorNickname}</span>
                      <span>{formatDateTime(post.createdAt)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex gap-4">
                      <span>조회 {post.viewCount}</span>
                      <span className="text-red-500">추천 {post.likeCount}</span>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* 하단 */}
          <div className="px-6 py-4 border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/notice/${type}`}
            />
            <SearchControls
              query={query}
              basePath={`/notice/${type}`}
              writePath={`/notice/${type}/write`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
