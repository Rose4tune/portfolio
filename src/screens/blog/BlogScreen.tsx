"use client";

import Link from "next/link";
import { BlogPost } from "@/domain/posts";
import { getPreviewText } from "@/shared/lib/utils";
import {
  SearchFilterBar,
  useSearchTagFilterBar,
} from "@/widgets/SearchFilterBar";
import animate from "@/styles/animation.module.css";

export default function BlogScreen({
  posts,
  uniqueTags,
}: {
  posts: BlogPost[];
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
