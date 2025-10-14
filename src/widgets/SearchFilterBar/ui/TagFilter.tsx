import { TagFilterProps } from "../types";

export default function TagFilter({
  searchQuery,
  setSearchQuery,
}: TagFilterProps) {
  return (
    <div className="relative w-full md:w-2/3">
      <input
        type="text"
        placeholder="태그 및 제목 검색..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-2 py-0.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}
