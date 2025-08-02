import { notFound } from "next/navigation";
import { getPageIdBySlug, PostType } from "@/lib/notion/notionhqClient";
import { getRecordMap } from "@/lib/notion/notionClient";
import Link from "next/link";
import NotionPageRenderer from "@/components/NotionPageRenderer";

interface Props {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: Props) {
  const pageId = await getPageIdBySlug(PostType.blog, params.slug);

  if (!pageId) return notFound();
  const recordMap = await getRecordMap(pageId);

  return (
    <article>
      <Link href="/blog" className="mb-8">
        ← 블로그 목록으로
      </Link>
      <NotionPageRenderer recordMap={recordMap} />
    </article>
  );
}
