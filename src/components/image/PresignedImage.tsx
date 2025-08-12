import { apiFetch } from "@/lib/apis/apiFetch";
import { useEffect, useState } from "react";

interface Props {
  filename: string; // 예: "posts/abc123.jpg"
}

export const PresignedImage = ({ filename }: Props) => {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch(`/api/post-images/presigned-url?filename=${encodeURIComponent(filename)}`, {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("권한 오류 또는 파일 없음");
        return res.text();
      })
      .then(setUrl)
      .catch(err => {
        console.error("🔴 presigned url 요청 실패:", err);
        setError(true);
      });
  }, [filename]);

  if (error) return <p className="text-red-500">이미지를 불러올 수 없습니다.</p>;
  if (!url) return <p className="text-gray-400">이미지 로딩 중...</p>;

  return <img src={url} alt="이미지" className="rounded-md w-full" />;
};
