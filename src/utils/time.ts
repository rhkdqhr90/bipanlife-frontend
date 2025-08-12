// utils/time.ts
export function formatTimeAgo(isoDate: string): string {
  const created = new Date(isoDate);
  const now = new Date();
  const diff = (now.getTime() - created.getTime()) / 1000; // 초 단위

  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}
