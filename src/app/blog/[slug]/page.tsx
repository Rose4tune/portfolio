import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/notion";
import Link from "next/link";
import { MarkdownContent } from "@/components/MarkdownContent";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/blog"
        className="inline-block mb-8 text-purple-400 hover:underline"
      >
        ← 블로그 목록으로
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <time className="text-gray-500">
          {new Date(post.date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>

      <div className="article">
        <MarkdownContent content={post.content} />
      </div>
    </article>
  );
}
