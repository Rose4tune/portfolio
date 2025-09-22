import { notFound } from "next/navigation";
import {
  getPageIdBySlug,
  getPosts,
  PostType,
} from "@/lib/notion/notionhqClient";
import { getRecordMap } from "@/lib/notion/notionClient";
import BlogPostScreen from "@/screens/blog/BlogPostScreen";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    console.log("🚀 [ISR] Generating static params for blog posts");
    console.error(
      "🚀 [ISR] Generating static params for blog posts (error log)"
    );

    const posts = await getPosts(PostType.blog);

    console.log(`✅ [ISR] Found ${posts.length} blog posts to pre-render`);
    console.error(
      `✅ [ISR] Found ${posts.length} blog posts to pre-render (error log)`
    );

    const slugs = posts.map((post) => post.slug);
    console.log(
      `📋 [ISR] Slugs to generate: ${JSON.stringify(slugs.slice(0, 3))}... (${
        slugs.length
      } total)`
    );

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("❌ [ISR] Error generating static params:", error);
    return [];
  }
}

const withTimeout = <T,>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> => {
const withTimeout = <T,>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((value) => {
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function BlogPostPage(props: any) {
  const slug = props.params?.slug;
  const isDevEnv = process.env.NODE_ENV === "development";
  console.log(`[DEBUG] Blog page requested for slug: "${slug}"`);
  console.log(`[DEBUG] Environment: ${process.env.NODE_ENV}`);
  console.log(`[DEBUG] ISR Mode: revalidate=${revalidate}s`);

  if (isDevEnv) {
    console.log(
      `[DEBUG-DEV] 💡 This is development mode. In production, this page would be statically generated.`
    );
    console.log(
      `[DEBUG-DEV] 💡 To test ISR locally, run: pnpm run build && pnpm run start`
    );
  }

  try {
    const pageId = await withTimeout(
      getPageIdBySlug(PostType.blog, slug),
      30000
    );
    const pageId = await withTimeout(
      getPageIdBySlug(PostType.blog, slug),
      30000
    );

    if (!pageId) {
      return notFound();
    }

    console.log(`[DEBUG] Found page ID: "${pageId}" for slug: "${slug}"`);

    try {
      console.log(
        `[DEBUG] Attempting to fetch record map for page ID: "${pageId}"`
      );

      let recordMap;
      try {
        recordMap = await withTimeout(getRecordMap(pageId), 60000);
      } catch (firstAttemptError) {
        if (
          process.env.NODE_ENV === "production" &&
          !process.env.NEXT_RUNTIME
        ) {
          console.log(`[DEBUG] First attempt failed, retrying after delay...`);
          await new Promise((resolve) => setTimeout(resolve, 5000));
          recordMap = await withTimeout(getRecordMap(pageId), 90000);
        } else {
          throw firstAttemptError;
        }
      }


      try {
        const serializedRecordMap = JSON.stringify(recordMap);
        console.log(
          `[DEBUG] ✅ Successfully fetched and serialized record map`
        );
        return (
          <BlogPostScreen
            pageId={pageId}
            serializedRecordMap={serializedRecordMap}
          />
        );
      } catch (serializeError) {
        console.error(
          `[DEBUG] ❌ Failed to serialize record map: ${
            serializeError instanceof Error
              ? serializeError.message
              : String(serializeError)
          }`
        );

        if (process.env.NODE_ENV === "production") {
          console.error(
            "[DEBUG] Returning empty record map for build to continue"
          );
          return <BlogPostScreen pageId={pageId} serializedRecordMap="" />;
        }


        throw serializeError;
      }
    } catch (error) {
      console.error(
        `[DEBUG] ❌ Failed to fetch blog post: ${
          error instanceof Error ? error.message : String(error)
        }`
      );

      if (error instanceof Error) {
        console.error(`[DEBUG] Error stack: ${error.stack}`);
        console.error(
          `[DEBUG] Error details: ${JSON.stringify(
            error,
            Object.getOwnPropertyNames(error),
            2
          )}`
        );
      }

      return <BlogPostScreen pageId={pageId} serializedRecordMap="" />;
    }
  } catch (error) {
    console.error(
      `[DEBUG] ❌ Failed to get page ID for slug "${slug}": ${
        error instanceof Error ? error.message : String(error)
      }`
    );

    if (error instanceof Error) {
      console.error(`[DEBUG] Error stack: ${error.stack}`);
      console.error(
        `[DEBUG] Error details: ${JSON.stringify(
          error,
          Object.getOwnPropertyNames(error),
          2
        )}`
      );
    }

    return notFound();
  }
}
