import { notFound } from "next/navigation";
import { getPageIdBySlug, PostType } from "@/lib/notion/notionhqClient";
import { getRecordMap } from "@/lib/notion/notionClient";
import BlogPostClient from "./BlogPostClient";

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { params } = props;
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const pageId = await getPageIdBySlug(PostType.blog, slug);

  if (!pageId) {
    return notFound();
  }
  
  try {
    const recordMap = await getRecordMap(pageId);
    const serializedRecordMap = JSON.stringify(recordMap);
    return <BlogPostClient pageId={pageId} serializedRecordMap={serializedRecordMap} />;
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return <BlogPostClient pageId={pageId} serializedRecordMap="" />;
  }
}
