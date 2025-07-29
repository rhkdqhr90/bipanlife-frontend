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
}

export function PostListPage({
  boardName,
  boardCode,
  page,
  postList,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navLinks,
  errorMessage,
}: PostListPageProps) {
  const posts = postList?.content ?? [];
  console.log(posts);
  const totalPages = postList?.totalPages ?? 1;
  const totalElements = postList?.totalElements ?? 0;
  const pageSize = postList?.size ?? 10;

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6 sm:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          {/* 헤더 */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">{boardName}</h1>
            <p className="text-sm text-gray-500 mt-2">총 {totalElements}개</p>
          </div>

          {/* 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 font-semibold border-b">
                <tr>
                  <th className="w-[8%] py-4 text-center">번호</th>
                  <th className="w-[50%] py-4">제목</th>
                  <th className="w-[7%] py-4 text-center">별점</th>
                  <th className="w-[10%] py-4 text-center">작성자</th>
                  <th className="w-[11%] py-4 text-center">작성일</th>
                  <th className="w-[7%] py-4 text-center">조회</th>
                  <th className="w-[7%] py-4 text-center">추천</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {errorMessage ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-red-500 font-medium">
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
                          className={`flex items-center space-x-2 hover:underline}`}
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
                        {post.viewCount.toLocaleString()}
                      </td>
                      <td className="py-4 text-center text-red-500 font-semibold">
                        {post.likeCount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-500">
                      📭 아직 등록된 게시글이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 하단 */}
          <div className="px-8 py-8 border-t border-gray-200">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={`/critic/${boardCode}`}
            />
            <div className="mt-6 flex justify-between">
              <SearchControls
                query=""
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
