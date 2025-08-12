import { apiFetch } from "./apiFetch";

export const uploadImages = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append("images", file);
  });

  const response = await apiFetch("/api/post-images/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("이미지 업로드 실패: " + response.status);
  }

  const presignedUrls: string[] = await response.json();

  // presigned → 정적 URL로 변환
  const staticUrls = presignedUrls.map(url => {
    const pathname = new URL(url).pathname; // "/bipan-image/xxx.jpg"
    return `http://localhost:9000${pathname}`;
  });

  return staticUrls;
};
