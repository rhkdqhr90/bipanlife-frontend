// app/not-found.tsx
export const runtime = "edge"; // ✅ not-found도 Edge에서 실행

// (선택) 클라이언트 UI만 쓰고 싶다면 다음 줄 추가 가능
// 'use client';

export default function NotFound() {
  return (
    <main style={{ padding: 24 }}>
      <h1>페이지를 찾을 수 없어요</h1>
      <p>요청하신 페이지가 존재하지 않습니다.</p>
    </main>
  );
}
