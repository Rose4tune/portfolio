import { notFound } from "next/navigation";
import { getPageIdBySlug, PostType } from "@/lib/notion/notionhqClient";
import { getRecordMap } from "@/lib/notion/notionClient";
import BlogPostClient from "./BlogPostClient";

const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then(value => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { params } = props;
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  console.log(`[DEBUG] Blog page requested for slug: "${slug}"`);
  console.log(`[DEBUG] Environment: ${process.env.NODE_ENV}`);
  
  try {
    const pageId = await withTimeout(getPageIdBySlug(PostType.blog, slug), 10000);

    if (!pageId) {
      console.log(`[DEBUG] ❌ No page found with slug: "${slug}"`);
      return notFound();
    }
    
    console.log(`[DEBUG] Found page ID: "${pageId}" for slug: "${slug}"`);
    
    try {
      console.log(`[DEBUG] Attempting to fetch record map for page ID: "${pageId}"`);
      const recordMap = await withTimeout(getRecordMap(pageId), 20000);
      
      try {
        const serializedRecordMap = JSON.stringify(recordMap);
        console.log(`[DEBUG] ✅ Successfully fetched and serialized record map`);
        return <BlogPostClient pageId={pageId} serializedRecordMap={serializedRecordMap} />;
      } catch (serializeError) {
        console.error(`[DEBUG] ❌ Failed to serialize record map: ${serializeError instanceof Error ? serializeError.message : String(serializeError)}`);
        throw serializeError;
      }
    } catch (error) {
      console.error(`[DEBUG] ❌ Failed to fetch blog post: ${error instanceof Error ? error.message : String(error)}`);
      
      if (error instanceof Error) {
        console.error(`[DEBUG] Error stack: ${error.stack}`);
        console.error(`[DEBUG] Error details: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`);
      }
      
      return <BlogPostClient pageId={pageId} serializedRecordMap="" />;
    }
  } catch (error) {
    console.error(`[DEBUG] ❌ Failed to get page ID for slug "${slug}": ${error instanceof Error ? error.message : String(error)}`);
    
    if (error instanceof Error) {
      console.error(`[DEBUG] Error stack: ${error.stack}`);
      console.error(`[DEBUG] Error details: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`);
    }
    
    return notFound();
  }
}
