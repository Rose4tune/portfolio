export function generateSlug(text: string): string {
  return text
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^\p{Script=Hangul}a-z0-9]+/gu, "-")
    .replace(/(^-|-$)/g, "");
}

export const getPreviewText = (content: string, maxLength: number = 60) => {
  let plainText = content.replace(/<[^>]*>/g, "");
  plainText = plainText
    .replace(/[#*_~`>]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\n{2,}/g, " ")
    .trim();

  return plainText.length > maxLength
    ? `${plainText.slice(0, maxLength)}...`
    : plainText;
};
