"use client";

import { useUserStore } from "@/stores/userStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface SearchControlsProps {
  query: string;
  basePath: string;
  writePath?: string;
  showWriteButton?: boolean;
}

export function SearchControls({
  query,
  basePath,
  writePath,
  showWriteButton = true,
}: SearchControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userInfo } = useUserStore();
  const [searchTerm, setSearchTerm] = useState(query || "");

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm.trim()) {
      params.set("query", searchTerm.trim());
    } else {
      params.delete("query");
    }
    params.set("page", "1");
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className="flex items-center mt-6 w-full">
      <div className="flex justify-center flex-grow">
        <div className="flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="검색어 입력..."
            className="border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="bg-gray-700 text-white px-4 py-2 rounded-r-md hover:bg-gray-800 text-sm"
          >
            검색
          </button>
        </div>
      </div>
      {showWriteButton && userInfo && writePath && (
        <button
          onClick={() => router.push(writePath)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm ml-auto"
        >
          글쓰기
        </button>
      )}
    </div>
  );
}
