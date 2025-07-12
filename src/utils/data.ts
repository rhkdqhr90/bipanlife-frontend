export const formatDateTime = (datetime: string | Date) => {
  const date = typeof datetime === "string" ? new Date(datetime) : datetime;
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
