"use client";

import TagFilter from "./ui/TagFilter";
import TagButton from "./ui/TagButton";
import { SearchFilterBarProps } from "./types";

export default function SearchFilterBar({
  title,
  className = "",
  selectedTag,
  searchQuery,
  filteredTags,
  onTagSelect,
  onSearchChange,
}: SearchFilterBarProps) {
  return (
    <div className={`mb-12 ${className}`}>
      {title && <h2 className="text-4xl font-bold mb-6">{title}</h2>}

      <TagFilter searchQuery={searchQuery} setSearchQuery={onSearchChange} />

      <div className="flex flex-wrap gap-2 mt-6">
        <TagButton
          tag={null}
          selectedTag={selectedTag}
          onClick={() => onTagSelect(null)}
        />
        {filteredTags.map((tag: string) => (
          <TagButton
            key={tag}
            tag={tag}
            selectedTag={selectedTag}
            onClick={() => onTagSelect(tag)}
          />
        ))}
      </div>
    </div>
  );
}
