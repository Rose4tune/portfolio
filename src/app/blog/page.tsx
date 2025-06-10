import { getBlogPosts } from "@/lib/notion";
import { NotionProperties } from "@/types/notion";
import Link from "next/link";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">블로그</h1>
      <div className="grid gap-6">
        {posts.map((post) => {
          const properties = post.properties as unknown as NotionProperties;
          const title = properties.이름.title[0]?.plain_text ?? "제목 없음";
          const description = properties.설명?.rich_text[0]?.plain_text ?? "";
          const date = properties.작성일.date?.start ?? "";
          const isHidden = properties.숨김.checkbox;

          if (isHidden) return null;

          return (
            <article
              key={post.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <Link href={`/blog/${post.id}`}>
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                {description && <p className="text-gray-600">{description}</p>}
                <div className="mt-4 text-sm text-gray-500">
                  {new Date(date).toLocaleDateString()}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
