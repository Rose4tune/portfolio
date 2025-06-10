import { getBlogPost } from "@/lib/notion";
import { NotionProperties } from "@/types/notion";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function BlogPost({ params }: PageProps) {
  const post = await getBlogPost(params.id);

  if (!post) {
    notFound();
  }

  console.log(post);

  const properties = post.properties as unknown as NotionProperties;
  const title = properties.이름.title[0]?.plain_text ?? "제목 없음";
  const date = properties.작성일.date?.start ?? "";
  const isHidden = properties.숨김.checkbox;

  if (isHidden) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <div className="text-gray-600 mb-8">
        {new Date(date).toLocaleDateString()}
      </div>
      <div className="prose dark:prose-invert max-w-none">
        {/* Notion 블록 컨텐츠는 별도의 컴포넌트로 렌더링해야 합니다 */}
        <p>블로그 내용이 여기에 표시됩니다.</p>
      </div>
    </article>
  );
}
