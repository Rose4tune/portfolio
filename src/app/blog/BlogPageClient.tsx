"use client";
import { useState, useEffect } from "react";
import TagFilter from "./TagFilter";
import Link from "next/link";
import { BlogPost } from "@/lib/notion";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function BlogPageClient({
  posts,
  uniqueTags,
}: {
  posts: BlogPost[];
  uniqueTags: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const tagParam = searchParams.get("tag");
    setSelectedTag(tagParam);
  }, [searchParams]);

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    const params = new URLSearchParams(searchParams.toString());
    if (tag) {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const filteredPosts = selectedTag
    ? posts.filter(
        (post) => Array.isArray(post.tags) && post.tags.includes(selectedTag)
      )
    : posts;

  const getPreviewText = (content: string) => {
    let plainText = content.replace(/<[^>]*>/g, "");
    plainText = plainText
      .replace(/[#*_~`>]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\n{2,}/g, " ")
      .trim();

    return plainText.length > 100 ? `${plainText.slice(0, 100)}...` : plainText;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">블로그</h1>
      <TagFilter
        uniqueTags={uniqueTags}
        selectedTag={selectedTag}
        setSelectedTag={handleTagSelect}
      />

      <ul
        className={`grid gap-6 ${
          filteredPosts.length <= 6
            ? "grid-cols-1 w-full"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {filteredPosts.map((post) => {
          return (
            <li key={post.id} className="w-full">
              <Link
                href={`/blog/${post.slug}`}
                className="block border rounded-lg p-6 hover:shadow-lg transition-shadow hover:border-purple-600 h-full"
              >
                <article className="h-full flex flex-col">
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <time className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <p className="mt-2 text-gray-300 line-clamp-3 flex-grow">
                    {getPreviewText(post.content)}
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
                </article>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
