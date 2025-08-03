import { notFound } from "next/navigation";
import { getPageIdBySlug, PostType } from "@/lib/notion/notionhqClient";
import { getRecordMap } from "@/lib/notion/notionClient";
import BlogPostClient from "./BlogPostClient";

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { params } = props;
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  console.log(`[DEBUG] Blog page requested for slug: "${slug}"`);
  console.log(`[DEBUG] Environment: ${process.env.NODE_ENV}`);
  
  const pageId = await getPageIdBySlug(PostType.blog, slug);

  if (!pageId) {
    console.log(`[DEBUG] ❌ No page found with slug: "${slug}"`);
    return notFound();
  }
  
  console.log(`[DEBUG] Found page ID: "${pageId}" for slug: "${slug}"`);
  
  try {
    console.log(`[DEBUG] Attempting to fetch record map for page ID: "${pageId}"`);
    const recordMap = await getRecordMap(pageId);
    const serializedRecordMap = JSON.stringify(recordMap);
    console.log(`[DEBUG] ✅ Successfully fetched and serialized record map`);
    return <BlogPostClient pageId={pageId} serializedRecordMap={serializedRecordMap} />;
  } catch (error) {
    console.error(`[DEBUG] ❌ Failed to fetch blog post: ${error instanceof Error ? error.message : String(error)}`);
    return <BlogPostClient pageId={pageId} serializedRecordMap="" />;
  }
}
