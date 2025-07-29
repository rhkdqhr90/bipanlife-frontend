"use client";
import { fetchFreePostsByType, FreeType } from "@/lib/apis/free";
import { PostListItem } from "@/types/PostListItem";
import { navLinks } from "@/constants/navLinks";
import { useEffect, useState } from "react";
import { Pagination } from "../common/Pagination";
import { SearchControls } from "../common/SearchControls";
import Link from "next/link";
import { formatDateTime } from "@/utils/data";

interface Props {
  type: FreeType;
  query: string;
  currentPage: number;
}
export const FreePageClient = ({ type, query, currentPage }: Props) => {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { content, totalPages, totalElements } = await fetchFreePostsByType(
          type,
          query,
          currentPage,
        );
        setPosts(content);
        setTotalPages(totalPages);
        setTotalElements(totalElements);
      } catch (err) {
        console.error("자유게시판 목록 조회 실패", err);
      }
    };
    load();
  }, [type, query, currentPage]);

  const freeTitle =
    navLinks
      .find(link => link.name === "자유게시판")
      ?.dropdown?.find(item => item.href === `/free/${type}`)?.name ?? "자유게시판";

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          {/* 헤더 */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">{freeTitle}</h1>
            <p className="text-sm text-gray-500 mt-2">총 {totalElements}개</p>
          </div>

          {/* 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 font-semibold border-b">
                <tr>
                  <th className="w-[8%] py-4 text-center">번호</th>
                  <th className="w-[52%] py-4">제목</th>
                  <th className="w-[13%] py-4 text-center">작성자</th>
                  <th className="w-[13%] py-4 text-center">작성일</th>
                  <th className="w-[7%] py-4 text-center">조회</th>
                  <th className="w-[7%] py-4 text-center">추천</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-500">
                      {query
                        ? `'${query}'에 대한 검색 결과가 없습니다.`
                        : "📭 등록된 게시물이 없습니다."}
                    </td>
                  </tr>
                ) : (
                  posts.map((post, index) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-center text-gray-500 font-medium">
                        {totalElements - (currentPage - 1) * 10 - index}
                      </td>
                      <td className="py-4">
                        <Link
                          href={`/free/${type}/${post.id}`}
                          className={`flex items-center space-x-2 hover:underline text-gray-900 ${
                            post.commentCount > 0 ? "font-semibold" : ""
                          }`}
                        >
                          <span className="truncate">{post.title}</span>
                          {post.commentCount > 0 && (
                            <span className="text-gray-500 text-sm">[{post.commentCount}]</span>
                          )}
                        </Link>
                      </td>
                      <td className="py-4 text-center text-gray-600">{post.authorNickname}</td>
                      <td className="py-4 text-center text-gray-600">
                        {formatDateTime(post.createdAt)}
                      </td>
                      <td className="py-4 text-center text-gray-600">{post.viewCount}</td>
                      <td className="py-4 text-center text-red-500 font-semibold">
                        {post.likeCount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 하단 */}
          <div className="px-8 py-8 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/free/${type}`}
            />
            <div className="mt-6 flex justify-between">
              <SearchControls
                query={query}
                basePath={`/free/${type}`}
                writePath={`/free/${type}/write`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
