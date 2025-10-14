import { notFound } from "next/navigation";
import {
  getPageIdBySlug,
  getPosts,
  getRecordMap,
} from "@/shared/lib/api/notion";
import { PostType } from "@/shared/types/notion";
import ProjectPostScreen from "@/screens/project/ProjectPostScreen";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const posts = await getPosts(PostType.project);

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    throw error;
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

    try {
      let recordMap;
      try {
        recordMap = await withTimeout(getRecordMap(pageId), 60000);
      } catch (firstAttemptError) {
        if (
          process.env.NODE_ENV === "production" &&
          !process.env.NEXT_RUNTIME
        ) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          recordMap = await withTimeout(getRecordMap(pageId), 90000);
        } else {
          throw firstAttemptError;
        }
      }

      try {
        const serializedRecordMap = JSON.stringify(recordMap);
        return (
          <ProjectPostScreen
            pageId={pageId}
            serializedRecordMap={serializedRecordMap}
          />
        );
      } catch (serializeError) {
        if (process.env.NODE_ENV === "production") {
          return <ProjectPostScreen pageId={pageId} serializedRecordMap="" />;
        }

        throw serializeError;
      }
    } catch (error) {
      throw error;
    }
  } catch {
    return notFound();
  }
}
