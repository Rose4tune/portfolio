"use client";

import { useMemo } from "react";
import Link from "next/link";
import { BlogPost } from "@/shared/types/notion";
import { TagFilter, TagButton } from "@/shared/ui";
import { getPreviewText } from "@/shared/lib/utils";
import { useTagFilter, useSearchFilter } from "@/shared/lib/hooks";

export default function BlogScreen({
  posts,
  uniqueTags,
}: {
  posts: BlogPost[];
  uniqueTags: string[];
}) {
  const { selectedTag, setSelectedTag, handleTagSelect } =
    useTagFilter(uniqueTags);

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags?.includes(selectedTag))
    : posts;

  const { searchQuery, setSearchQuery, filteredItems } =
    useSearchFilter(filteredPosts);

  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return uniqueTags;
    const query = searchQuery.toLowerCase().trim();
    return uniqueTags.filter((tag) => tag.toLowerCase().includes(query));
  }, [uniqueTags, searchQuery]);

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-4xl font-bold">블로그</h1>
        <TagFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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

      <ul
        className={`grid gap-6 ${
          filteredItems.length <= 6
            ? "grid-cols-1 w-full"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {filteredItems.map((post) => {
          return (
            <li key={post.id} className="w-full">
              <Link
                href={`/blog/${post.slug}`}
                className="block border rounded-lg p-6 hover:shadow-lg transition-shadow hover:border-purple-600 hover:text-purple-800 h-full"
              >
                <div className="h-full flex flex-col">
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <time className="text-sm text-gray-500">{post.date}</time>
                  <p className="mt-2 text-gray-300 line-clamp-3 flex-grow">
                    {post.excerpt
                      ? getPreviewText(post.excerpt)
                      : post.content
                      ? getPreviewText(post.content)
                      : "내용을 확인하려면 클릭하세요."}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-3 justify-end">
                      {post.tags.map((tag: string) => (
                        <button
                          key={tag}
                          onClick={(e) => {
                            e.preventDefault();
                            handleTagSelect(tag);
                          }}
                          className={`text-xs ${
                            selectedTag === tag
                              ? "text-purple-400"
                              : "text-gray-500"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
