import { notFound } from "next/navigation";
import { getPageIdBySlug } from "@/lib/notion-projects";
import { getRecordMap } from "@/lib/notion-client";
import NotionPageClient from "@/components/NotionPageClient";
import Link from "next/link";

type Props = { params: { slug: string } };

export default async function ProjectPostPage({ params }: Props) {
  const pageId = await getPageIdBySlug(params.slug);

  if (!pageId) return notFound();
  const recordMap = await getRecordMap(pageId);

  return (
    <article>
      <Link href="/blog" className="mb-8">
        ← 블로그 목록으로
      </Link>
      <NotionPageClient recordMap={recordMap} />
    </article>
  );
}
