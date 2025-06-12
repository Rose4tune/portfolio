import { getBlogPosts } from "@/lib/notion";
import Link from "next/link";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <article>
              <h2 className="text-2xl font-semibold mb-2 hover:text-primary">
                {post.title}
              </h2>
              <time className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
