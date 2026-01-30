import { notFound } from "next/navigation";
import { getPageIdBySlug, getPosts, PostType } from "@/domain/posts";
import { getRecordMap } from "@/domain/notion";
import BlogPostScreen from "@/screens/blog/BlogPostScreen";

// 매 요청마다 서버에서 getRecordMap 호출 (signed URL 만료 방지, dynamic 테스트와 동일)
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  try {
    const posts = await getPosts(PostType.blog);
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

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
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function BlogPostPage(props: any) {
  const { slug } = await props.params;
  try {
    const pageId = await withTimeout(
      getPageIdBySlug(PostType.blog, slug),
      30000
    );

    if (!pageId) {
      return notFound();
    }

    let recordMap;
    try {
      recordMap = await withTimeout(getRecordMap(pageId), 60000);
    } catch (firstAttemptError) {
      if (process.env.NODE_ENV === "production" && !process.env.NEXT_RUNTIME) {
        console.warn("First attempt failed, retrying after 5s...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        recordMap = await withTimeout(getRecordMap(pageId), 90000);
      } else {
        throw firstAttemptError;
      }
    }

    return <BlogPostScreen pageId={pageId} recordMap={recordMap} />;
  } catch (error) {
    console.error("Failed to load blog post:", error);
    return notFound();
  }
}
