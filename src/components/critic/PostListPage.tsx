"use client";

import { formatDateTime } from "@/utils/data";
import { Pagination } from "@/components/common/Pagination";
import { SearchControls } from "@/components/common/SearchControls";
import Link from "next/link";
import { PostListItem } from "@/types/PostListItem";
import { Page } from "@/lib/apis/posts";
import { NavLink } from "@/types/MenuItem";
import { AverageRatingDisplay } from "../rating/AverageRating";

interface PostListPageProps {
  boardName: string;
  boardCode: string;
  page: number;
  postList: Page<PostListItem> | null; // null 허용
  navLinks: NavLink[];
  errorMessage?: string;
  query?: string;
}

export function PostListPage({
  boardName,
  boardCode,
  page,
  postList,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navLinks,
  errorMessage,
  query,
}: PostListPageProps) {
  const posts = postList?.content ?? [];
  const totalPages = postList?.totalPages ?? 1;
  const totalElements = postList?.totalElements ?? 0;
  const pageSize = postList?.size ?? 10;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          {/* 🧷 헤더 */}
          <div className="px-6 sm:px-8 py-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">{boardName}</h1>
            <p className="text-sm text-gray-500 mt-1">총 {totalElements}개</p>
          </div>

          {/* 🖥 PC 테이블 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[700px] w-full table-fixed text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 font-semibold border-b">
                <tr>
                  <th className="w-[8%] py-4 px-2 text-center">번호</th>
                  <th className="w-[50%] py-4 px-2">제목</th>
                  <th className="w-[7%] py-4 px-2 text-center">별점</th>
                  <th className="w-[10%] py-4 px-2 text-center">작성자</th>
                  <th className="w-[11%] py-4 px-2 text-center">작성일</th>
                  <th className="w-[7%] py-4 px-2 text-center">조회</th>
                  <th className="w-[7%] py-4 px-2 text-center">추천</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {errorMessage ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-red-500 font-medium">
                      {errorMessage}
                    </td>
                  </tr>
                ) : posts.length > 0 ? (
                  posts.map((post, index) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-center text-gray-500 font-medium">
                        {totalElements - index - (page - 1) * pageSize}
                      </td>
                      <td className="py-4">
                        <Link
                          href={`/${boardCode}/${post.id}`}
                          className="flex items-center gap-1 hover:underline"
                        >
                          <span className="truncate">{post.title}</span>
                          {post.commentCount > 0 && (
                            <span className="text-gray-500 text-sm">[{post.commentCount}]</span>
                          )}
                        </Link>
                      </td>
                      <td className="py-4 text-center">
                        <AverageRatingDisplay ratings={post.ratings} />
                      </td>
                      <td className="py-4 text-center text-gray-600">{post.authorNickname}</td>
                      <td className="py-4 text-center text-gray-600">
                        {formatDateTime(post.createdAt)}
                      </td>
                      <td className="py-4 text-center text-gray-600">
                        {(post.viewCount ?? 0).toLocaleString()}
                      </td>
                      <td className="py-4 text-center text-red-500 font-semibold">
                        {post.likeCount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-gray-500">
                      📭 아직 등록된 게시글이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 📱 모바일 카드형 리스트 */}
          <div className="md:hidden px-4 divide-y divide-gray-100">
            {errorMessage ? (
              <div className="py-16 text-center text-red-500 font-medium">{errorMessage}</div>
            ) : posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} className="py-4">
                  <Link href={`/${boardCode}/${post.id}`} className="block">
                    <h2 className="font-semibold text-gray-800 line-clamp-2">{post.title}</h2>

                    <div className="mt-2">
                      <AverageRatingDisplay ratings={post.ratings} />
                    </div>

                    {post.commentCount > 0 && (
                      <p className="text-gray-500 text-sm mt-1">댓글 {post.commentCount}개</p>
                    )}

                    <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-2">
                      <span>작성자: {post.authorNickname}</span>
                      <span>작성일: {formatDateTime(post.createdAt)}</span>
                      <span>조회수: {post.viewCount}</span>
                      <span className="text-red-500">추천: {post.likeCount}</span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-gray-500">📭 아직 게시글이 없습니다.</div>
            )}
          </div>

          {/* 📌 하단 */}
          <div className="px-6 sm:px-8 py-8 border-t border-gray-200">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={`/critic/${boardCode}`}
            />
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-4">
              <SearchControls
                query={query ?? ""}
                basePath={`/${boardCode}`}
                writePath={`/${boardCode}/write`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
