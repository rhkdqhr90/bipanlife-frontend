// src/app/error.tsx
"use client";
export const runtime = "edge";

export default function GlobalError({ error }: { error: unknown }) {
  console.error(error);
  return (
    <main style={{ padding: 24 }}>
      <h1>문제가 발생했습니다</h1>
      <p>잠시 후 다시 시도해 주세요.</p>
    </main>
  );
}
