"use client";

const TagFilter = ({
  uniqueTags,
  selectedTag,
  setSelectedTag,
}: {
  uniqueTags: string[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">태그 필터</h2>
      <div className="flex flex-wrap gap-2">
        <button
          key="all"
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1 rounded-full font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 ${
            selectedTag === null
              ? "bg-purple-500 text-white shadow-lg ring-2 ring-purple-400"
              : "bg-gray-200 text-gray-800 hover:bg-purple-100"
          }`}
        >
          전체
        </button>
        {uniqueTags.map((tag: string) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 ${
              selectedTag === tag
                ? "bg-purple-500 text-white shadow-lg ring-2 ring-purple-400"
                : "bg-gray-200 text-gray-800 hover:bg-purple-100"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;
