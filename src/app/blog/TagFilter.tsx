"use client";

import { useState, useMemo } from "react";
import TagButton from "./TagButton";

const TagFilter = ({
  uniqueTags,
  selectedTag,
  setSelectedTag,
}: {
  uniqueTags: string[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTags = useMemo(() => {
    if (!searchQuery) return uniqueTags;
    return uniqueTags.filter((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [uniqueTags, searchQuery]);

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-4xl font-bold">블로그</h1>
        <div className="relative w-2/5">
          <input
            type="text"
            placeholder="태그 검색..."
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
      </div>
      <div className="flex flex-wrap gap-2 my-6">
        <TagButton
          tag={null}
          selectedTag={selectedTag}
          onClick={() => setSelectedTag(null)}
        />
        {filteredTags.map((tag: string) => (
          <TagButton
            key={tag}
            tag={tag}
            selectedTag={selectedTag}
            onClick={() => setSelectedTag(tag)}
          />
        ))}
      </div>
    </>
  );
};

export default TagFilter;
