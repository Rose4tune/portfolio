"use client";
import { useState, useEffect } from "react";
import TagFilter from "./TagFilter";
import Link from "next/link";
import { BlogPost } from "@/lib/notion";
import { useSearchParams } from "next/navigation";

export default function BlogPageClient({
  posts,
  uniqueTags,
}: {
  posts: BlogPost[];
  uniqueTags: string[];
}) {
  const searchParams = useSearchParams();
  const tagParam = searchParams.get("tag");
  const [selectedTag, setSelectedTag] = useState<string | null>(tagParam);

  useEffect(() => {
    setSelectedTag(tagParam);
  }, [tagParam]);

  const filteredPosts = selectedTag
    ? posts.filter(
        (post) => Array.isArray(post.tags) && post.tags.includes(selectedTag)
      )
    : posts;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">블로그</h1>
      <TagFilter
        uniqueTags={uniqueTags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
      />

      <div className="grid gap-4">
        {filteredPosts.map((post) => {
          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block border rounded-lg p-6 hover:shadow-lg transition-shadow hover:border-purple-600"
            >
              <article>
                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                <time className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`p-1 rounded-full font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 ${
                          selectedTag === tag
                            ? "bg-purple-500 text-white shadow-lg ring-2 ring-purple-400"
                            : "bg-gray-200 text-gray-800 hover:bg-purple-100"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
