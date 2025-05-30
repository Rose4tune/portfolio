import { notFound } from "next/navigation";
import { getMDXComponent } from "next-contentlayer/hooks";
import { allPosts } from "contentlayer/generated";
import BlogLayout from "@/components/layout/BlogLayout";
import type { Post } from "contentlayer/generated";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateStaticParams() {
  return allPosts.map((post: Post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: PageProps) {
  const resolvedParams = await params;
  const post = allPosts.find((post: Post) => post.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const Content = getMDXComponent(post.body.code);

  return (
    <BlogLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString()}
          </time>
          {post.tags && (
            <div className="flex space-x-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <Content />
    </BlogLayout>
  );
}
