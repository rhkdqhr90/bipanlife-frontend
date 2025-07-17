export const uploadImages = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();

  files.forEach(file => {
    formData.append("images", file); // ✅ 같은 키(images)로 여러 번 append
  });

  const response = await fetch("/api/post-images/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("이미지 업로드 실패: " + response.status);
  }
  alert("이미지가 업로드 되었습니다.");

  const urls: string[] = await response.json();
  return urls;
};
