"use client";

import Link from "next/link";
import { ProjectPost } from "@/shared/types/notion";
import {
  SearchFilterBar,
  useSearchTagFilterBar,
} from "@/widgets/SearchFilterBar";

export default function ProjectScreen({
  posts,
  uniqueTags,
}: {
  posts: ProjectPost[];
  uniqueTags: string[];
}) {
  const {
    filteredItems,
    selectedTag,
    searchQuery,
    handleTagSelect,
    setSearchQuery,
    filteredTags,
  } = useSearchTagFilterBar(posts, uniqueTags);

  return (
    <>
      <SearchFilterBar
        selectedTag={selectedTag}
        searchQuery={searchQuery}
        filteredTags={filteredTags}
        onTagSelect={handleTagSelect}
        onSearchChange={setSearchQuery}
      />

      <div className="space-y-0 border-t border-primary-100 dark:border-gray-700">
        {filteredItems.map((post) => {
          return (
            <div
              key={post.id}
              className="py-6 border-b border-primary-100 dark:border-gray-700"
            >
              <Link href={`/projects/${post.slug}`}>
                <h2 className="text-xl font-normal">{post.title}</h2>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
