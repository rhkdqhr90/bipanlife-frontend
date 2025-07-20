"use client";

import { formatDateTime } from "@/utils/data";
import { useEffect, useState } from "react";
import { Pagination } from "../common/Pagination";
import { PostListItem } from "@/types/PostListItem";
import { fetchPostsByBoardId } from "@/lib/apis/posts";

import { SearchControls } from "../common/SearchControls";

interface Props {
  query: string;
  currentPage: number;
}

export const HumorPageClient = ({ query, currentPage }: Props) => {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;
  const boardId = 10;

  useEffect(() => {
    const load = async () => {
      if (boardId === null || isNaN(boardId)) {
        console.error("유효하지 않은 boardId입니다.");
        return; // boardId가 null이거나 NaN이면 함수 종료
      }
      try {
        const { content, totalPages, totalElements } = await fetchPostsByBoardId(
          boardId,
          currentPage,
          pageSize,
          query,
        );
        setPosts(content);
        setTotalPages(totalPages);
        setTotalElements(totalElements);
      } catch (err) {
        console.log(err);
      }
    };
    load();
  }, [boardId, currentPage, pageSize, query]);

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">유머 게시판</h1>
      </div>

      <table className="table-fixed w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="w-[8%] py-2">번호</th>
            <th className="w-[52%] py-2">제목</th>
            <th className="w-[13%] py-2">작성자</th>
            <th className="w-[13%] py-2 text-center">작성일</th>
            <th className="w-[10%] py-2 text-center">조회</th>
            <th className="w-[10%] py-2 text-center">추천</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={post.id} className="border-b hover:bg-gray-50">
              <td className="w-[8%] py-2 text-left">
                {totalElements - index - (currentPage - 1) * pageSize}
              </td>
              <td className="w-[52%] py-2">
                <a href={`/humor/${post.id}`} className="block">
                  <div className="flex items-center space-x-2">
                    <div className="truncate text-blue-600 hover:underline max-w-full">
                      {post.title}
                    </div>
                    {post.commentCount >= 0 && (
                      <div className="text-gray-500 text-sm flex-shrink-0">
                        [{post.commentCount}]
                      </div>
                    )}
                  </div>
                </a>
              </td>
              <td className="w-[14%] py-2 text-left">{post.authorNickname}</td>
              <td className="w-[14%] py-2 text-center">{formatDateTime(post.createdAt)}</td>
              <td className="w-[10%] py-2 text-center">{post.viewCount}</td>
              <td className="w-[10%] py-2 text-center">{post.likeCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/humor" />
      <div className="flex justify-between">
        <SearchControls query={query} basePath="/humor" writePath="/humor/write" />
      </div>
    </div>
  );
};
