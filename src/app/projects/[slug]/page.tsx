import { notFound } from "next/navigation";
import { getPageIdBySlug, getPosts, PostType } from "@/domain/posts";
import { getRecordMap } from "@/domain/notion";
import ProjectPostScreen from "@/screens/project/ProjectPostScreen";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const posts = await getPosts(PostType.project);
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
export default async function ProjectPostPage(props: any) {
  const { slug } = await props.params;

  try {
    const pageId = await withTimeout(
      getPageIdBySlug(PostType.project, slug),
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

    return <ProjectPostScreen recordMap={recordMap} />;
  } catch (error) {
    console.error("Failed to load project post:", error);
    return notFound();
  }
}
