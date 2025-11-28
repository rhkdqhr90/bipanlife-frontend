// // src/lib/apis/apiFetch.ts
// const getBaseUrl = () => {
//   // 서버 렌더링(SSR)
//   if (typeof window === "undefined") {
//     // 1순위: 내부 호출용 (도커 네트워크에서 직접 백엔드로)
//     if (process.env.SSR_INTERNAL_API_URL) return process.env.SSR_INTERNAL_API_URL; // 예: http://backend:8080
//     // 2순위: 퍼블릭 API 도메인
//     if (process.env.NEXT_PUBLIC_API_BASE_URL) return process.env.NEXT_PUBLIC_API_BASE_URL;
//     // 3순위: 도커 기본값(백업)
//     return "http://backend:8080";
//   }
//   // 브라우저(CSR)는 상대경로로 Nginx/리라이트를 타게 함
//   return "";
// };

// export const apiFetch = (url: string, options?: RequestInit) => {
//   const baseUrl = getBaseUrl();
//   return fetch(`${baseUrl}${url}`, { credentials: "include", ...options });
// };

const getBaseUrl = () => {
  // SSR
  if (typeof window === "undefined") {
    return "http://backend:8080";
  }

  // ✅ CSR(브라우저)에서도 무조건 절대 URL 사용
  return "";
};

export const apiFetch = (url: string, options?: RequestInit) => {
  const baseUrl = getBaseUrl();
  console.debug("[apiFetch]", url);
  return fetch(`${baseUrl}${url}`, { credentials: "include", ...options });
};
