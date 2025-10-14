import { TagButtonProps } from "../types";

export default function TagButton({
  tag,
  selectedTag,
  onClick,
}: TagButtonProps) {
  const isSelected = tag === selectedTag;
  return (
    <button
      onClick={onClick}
      className={`px-2 py-0.5 text-sm rounded-full transition-all duration-150 transform hover:scale-105 active:scale-90 ${
        isSelected
          ? "bg-purple-100 text-purple-500"
          : "bg-gray-100 text-gray-300 cursor-pointer hover:bg-gray-200 hover:text-gray-500"
      }`}
    >
      {tag || "전체"}
    </button>
  );
}
