"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // 예: "/notice/terms" 또는 "/boards/1"
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${basePath}?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Link
          key={i}
          href={createPageURL(i)}
          className={`px-4 py-2 mx-1 rounded-md text-sm ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {i}
        </Link>,
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center mt-8">
      {currentPage === 1 ? (
        <span
          className="px-4 py-2 mx-1 rounded-md text-sm text-gray-400 cursor-not-allowed"
          aria-disabled="true"
        >
          이전
        </span>
      ) : (
        <Link
          href={createPageURL(currentPage - 1)}
          className="px-4 py-2 mx-1 rounded-md text-sm hover:bg-gray-100"
        >
          이전
        </Link>
      )}
      {renderPageNumbers()}
      {currentPage === totalPages ? (
        <span
          className="px-4 py-2 mx-1 rounded-md text-sm text-gray-400 cursor-not-allowed"
          aria-disabled="true"
        >
          다음
        </span>
      ) : (
        <Link
          href={createPageURL(currentPage + 1)}
          className="px-4 py-2 mx-1 rounded-md text-sm hover:bg-gray-100"
        >
          다음
        </Link>
      )}
    </div>
  );
}
