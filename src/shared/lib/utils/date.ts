export function formatDate(
  date: string | Date,
  locale: string = "ko-KR"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = typeof date === "string" ? new Date(date) : date;
  const diffInMs = now.getTime() - past.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "오늘";
  if (diffInDays === 1) return "어제";
  if (diffInDays < 7) return `${diffInDays}일 전`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}개월 전`;
  return `${Math.floor(diffInDays / 365)}년 전`;
}
