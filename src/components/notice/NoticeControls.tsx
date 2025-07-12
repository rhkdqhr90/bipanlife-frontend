"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ClientWriteButton } from "./ClientWriteButton";

interface NoticeControlsProps {
  query: string;
}

export function NoticeControls({ query }: NoticeControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(query || "");

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm.trim()) {
      params.set("query", searchTerm.trim());
    } else {
      params.delete("query");
    }
    params.set("page", "1"); // Reset to first page on new search
    router.push(`/notice?${params.toString()}`);
  };

  return (
    <div className="flex justify-between items-center mt-6">
      <form onSubmit={handleSearch} className="flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="검색어 입력..."
          className="border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-gray-700 text-white px-4 py-2 rounded-r-md hover:bg-gray-800 text-sm"
        >
          검색
        </button>
      </form>
      <ClientWriteButton />
    </div>
  );
}
