'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `/notice?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

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
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
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
      <Link
        href={createPageURL(currentPage - 1)}
        className={`px-4 py-2 mx-1 rounded-md text-sm ${
          currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'
        }`}
        aria-disabled={currentPage === 1}
      >
        이전
      </Link>
      {renderPageNumbers()}
      <Link
        href={createPageURL(currentPage + 1)}
        className={`px-4 py-2 mx-1 rounded-md text-sm ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'hover:bg-gray-100'
        }`}
        aria-disabled={currentPage === totalPages}
      >
        다음
      </Link>
    </div>
  );
}
