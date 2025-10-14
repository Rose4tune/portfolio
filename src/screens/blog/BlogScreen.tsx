"use client";

<<<<<<< HEAD
<<<<<<< HEAD
import Link from "next/link";
import { BlogPost } from "@/shared/types/notion";
import { getPreviewText } from "@/shared/lib/utils";
import {
  SearchFilterBar,
  useSearchTagFilterBar,
} from "@/widgets/SearchFilterBar";
import animate from "@/styles/animation.module.css";
=======
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BlogPost } from "@/lib/notion/notionhqClient";
import { TagFilter, TagButton } from "@/shared/notionRenderer";
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
=======
import Link from "next/link";
import { BlogPost } from "@/shared/types/notion";
import { getPreviewText } from "@/shared/lib/utils";
import {
  SearchFilterBar,
  useSearchTagFilterBar,
} from "@/widgets/SearchFilterBar";
import animate from "@/styles/animation.module.css";
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))

export default function BlogScreen({
  posts,
  uniqueTags,
}: {
  posts: BlogPost[];
  uniqueTags: string[];
}) {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))
  const {
    filteredItems,
    selectedTag,
    searchQuery,
    handleTagSelect,
    setSearchQuery,
    filteredTags,
  } = useSearchTagFilterBar(posts, uniqueTags);
<<<<<<< HEAD

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
=======
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    try {
      const tagParam = searchParams.get("tag");
      if (tagParam && uniqueTags.includes(tagParam)) {
        setSelectedTag(tagParam);
      } else {
        setSelectedTag(null);
      }
    } catch (error) {
      console.error("Error setting tag:", error);
      setSelectedTag(null);
    }
  }, [searchParams, uniqueTags]);

  const handleTagSelect = (tag: string | null) => {
    try {
      setSelectedTag(tag);
      const params = new URLSearchParams(searchParams.toString());
      if (tag && uniqueTags.includes(tag)) {
        params.set("tag", tag);
      } else {
        params.delete("tag");
      }
      router.replace(`${pathname}?${params.toString()}`);
    } catch (error) {
      console.error("Error handling tag selection:", error);
      setSelectedTag(null);
    }
  };

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags?.includes(selectedTag))
    : posts;

  const [searchQuery, setSearchQuery] = useState("");
  const getPreviewText = (content: string) => {
    let plainText = content.replace(/<[^>]*>/g, "");
    plainText = plainText
      .replace(/[#*_~`>]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\n{2,}/g, " ")
      .trim();

    return plainText.length > 60 ? `${plainText.slice(0, 60)}...` : plainText;
  };

  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return uniqueTags;
    const query = searchQuery.toLowerCase().trim();
    return uniqueTags.filter((tag) => tag.toLowerCase().includes(query));
  }, [uniqueTags, searchQuery]);

  const searchFilteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return filteredPosts;
    const query = searchQuery.toLowerCase().trim();
    return filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [filteredPosts, searchQuery]);
=======
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))

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
<<<<<<< HEAD
                    <div className="mt-3 flex flex-wrap gap-3 justify-end">
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
=======
                    <div className="flex flex-wrap gap-3 font-light text-gray-400">
                      <time className="text-xs w-[70px]">
                        {post.date
                          .replaceAll("년", ".")
                          .replaceAll("월", ".")
                          .replaceAll("일", ".")}
                      </time>
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))
                      {post.tags.map((tag: string) => (
                        <button
                          key={tag}
                          onClick={(e) => {
                            e.preventDefault();
                            handleTagSelect(tag);
                          }}
<<<<<<< HEAD
<<<<<<< HEAD
                          className={`text-xs cursor-pointer ${
                            selectedTag === tag
                              ? "text-primary-300"
                              : "text-gray-400"
=======
                          className={`text-xs ${
                            selectedTag === tag
                              ? "text-purple-400"
                              : "text-gray-500"
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
=======
                          className={`text-xs cursor-pointer ${
                            selectedTag === tag
                              ? "text-primary-300"
                              : "text-gray-400"
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
<<<<<<< HEAD
<<<<<<< HEAD
                </Link>
              </div>
            </div>
          );
        })}
      </div>
=======
                </article>
              </Link>
            </li>
          );
        })}
      </ul>
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
=======
                </Link>
              </div>
            </div>
          );
        })}
      </div>
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))
    </>
  );
}
