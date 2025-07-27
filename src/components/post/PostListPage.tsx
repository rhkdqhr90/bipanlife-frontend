"use client";

import { formatDateTime } from "@/utils/data";
import { Pagination } from "@/components/common/Pagination";
import { SearchControls } from "@/components/common/SearchControls";

import Link from "next/link";
import { PostListItem } from "@/types/PostListItem";
import { Page } from "@/lib/apis/posts";
import { NavLink } from "@/types/MenuItem";

interface Props {
  boardCode: string;
  boardName: string;
  page: number;
  postList: Page<PostListItem>;
  navLinks: NavLink[];
}

export function PostListPage({ boardCode, boardName, page, postList }: Props) {
  const posts = postList.content;
  const totalPages = postList.totalPages;
  const totalElements = postList.totalElements;
  const pageSize = postList.size;

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{boardName}</h1>
      </div>

      <table className="table-fixed w-full text-left text-sm mt-4">
        <thead>
          <tr className="border-b">
            <th className="w-[8%] py-2">번호</th>
            <th className="w-[52%] py-2">제목</th>
            <th className="w-[13%] py-2">작성자</th>
            <th className="w-[13%] py-2 text-center">작성일</th>
            <th className="w-[7%] py-2 text-center">조회</th>
            <th className="w-[7%] py-2 text-center">추천</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <tr key={post.id} className="border-b hover:bg-gray-50">
                <td>{totalElements - index - (page - 1) * pageSize}</td>
                <td>
                  <Link
                    href={`/free/${boardCode}/${post.id}`}
                    className="block truncate text-blue-600 hover:underline"
                  >
                    {post.title}
                    {post.commentCount > 0 && (
                      <span className="text-sm text-gray-500 ml-1">[{post.commentCount}]</span>
                    )}
                  </Link>
                </td>
                <td>{post.authorNickname}</td>
                <td className="text-center">{formatDateTime(post.createdAt)}</td>
                <td className="text-center">{post.viewCount}</td>
                <td className="text-center">{post.likeCount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-12 text-center text-gray-500">
                📭 아직 등록된 게시글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination currentPage={page} totalPages={totalPages} basePath={`/free/${boardCode}`} />

      <SearchControls
        query=""
        basePath={`/free/${boardCode}`}
        writePath={`/free/${boardCode}/write`}
      />
    </div>
  );
}
