"use client";

import { useMemo } from "react";
import Link from "next/link";
import { BlogPost } from "@/shared/types/notion";
import { TagFilter, TagButton } from "@/shared/ui";
import { getPreviewText } from "@/shared/lib/utils";
import { useTagFilter, useSearchFilter } from "@/shared/lib/hooks";
import animate from "@/styles/animation.module.css";

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
      <div className="mb-12">
        <div className="flex items-end justify-between gap-4">
          <TagFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-6">
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
      </div>

      <div className="space-y-0 border-t border-primary-100 dark:border-gray-700">
        {filteredItems.map((post) => {
          return (
            <div
              className={`${animate.shimmerEffect} -mx-1 px-1`}
              key={post.id}
            >
              <div
                key={post.id}
                className="py-6 border-b border-primary-100 dark:border-gray-700"
              >
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-normal">{post.title}</h2>
                  <div className="mt-1 mb-3 font-light text-sm text-gray-400 dark:text-gray-500">
                    <p className="leading-relaxed line-clamp-3">
                      <span className="after:content-['|'] after:mx-2">
                        {post.tags[0]}
                      </span>
                      {post.excerpt
                        ? post.excerpt
                        : post.content
                        ? getPreviewText(post.content, 100)
                        : "내용을 확인하려면 클릭하세요."}
                    </p>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-3 font-light text-gray-400">
                      <time className="text-xs w-[70px]">
                        {post.date
                          .replaceAll("년", ".")
                          .replaceAll("월", ".")
                          .replaceAll("일", ".")}
                      </time>
                      {post.tags.map((tag: string) => (
                        <button
                          key={tag}
                          onClick={(e) => {
                            e.preventDefault();
                            handleTagSelect(tag);
                          }}
                          className={`text-xs cursor-pointer ${
                            selectedTag === tag
                              ? "text-primary-300"
                              : "text-gray-400"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
