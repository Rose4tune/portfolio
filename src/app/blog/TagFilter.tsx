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
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        key="all"
        onClick={() => setSelectedTag(null)}
        className={`px-2 py-0.5 text-sm rounded-full transition-colors duration-150 ${
          selectedTag === null
            ? "bg-purple-100 text-purple-500"
            : "bg-gray-100 text-gray-300 cursor-pointer hover:bg-gray-200 hover:text-gray-500"
        }`}
      >
        전체
      </button>
      {uniqueTags.map((tag: string) => (
        <button
          key={tag}
          onClick={() => setSelectedTag(tag)}
          className={`px-2 py-0.5 text-sm rounded-full transition-colors duration-150 ${
            selectedTag === tag
              ? "bg-purple-100 text-purple-500"
              : "bg-gray-100 text-gray-300 cursor-pointer hover:bg-gray-200 hover:text-gray-500"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagFilter;
