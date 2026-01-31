/**
 * public/images/cover 기준 커버 이미지 URL.
 * 홈·상세 프로젝트 커버를 동일한 로컬 이미지로 통일할 때 사용.
 */
export const COVER_FALLBACK = "/images/test.jpeg";

export function getCoverSrc(title: string): string {
  return `/images/cover/${encodeURIComponent(title)}.png`;
}
