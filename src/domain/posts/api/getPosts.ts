import { PageObjectResponse } from "@notionhq/client";
import { generateSlug } from "@/shared/lib/utils";
import { PostType, BlogPost, ProjectPost, BookPost } from "../types";
import { notionHQClient, NOTION_DB } from "../lib/notionClient";
import { getPropertyValue, getPageFirstContent } from "../lib/helpers";

export async function getPosts(type: PostType.blog): Promise<BlogPost[]>;
export async function getPosts(type: PostType.project): Promise<ProjectPost[]>;
export async function getPosts(type: PostType.book): Promise<BookPost[]>;
export async function getPosts(
  type: PostType
): Promise<BlogPost[] | ProjectPost[] | BookPost[]>;

export async function getPosts(type: PostType) {
  console.log(`getPosts 함수 호출됨 (타입: ${type})`);
  const database_id = NOTION_DB[type];

  try {
    const response = await notionHQClient.databases.query({
      database_id,
      filter: {
        property: "숨김",
        checkbox: {
          equals: false,
        },
      },
      sorts: [
        {
          property: "날짜",
          direction: "descending",
        },
      ],
    });

    const pages = response.results as PageObjectResponse[];
    const posts = await Promise.all(
      pages.map(async (page) => {
        const properties = page.properties;
        const title = getPropertyValue(properties["제목"]) as string;
        const slug = generateSlug(title);
        const date = getPropertyValue(properties["날짜"]) as string;
        const tags = getPropertyValue(properties["키워드"]) as string[];
        const excerpt = getPropertyValue(properties["설명"]) as string;
        const content = await getPageFirstContent(page.id);

        const basePost = {
          id: page.id,
          title,
          slug,
          date,
          tags,
          excerpt,
          content,
        };

        switch (type) {
          case PostType.blog:
            return { ...basePost } as BlogPost;

          case PostType.project:
            return {
              ...basePost,
              date,
              status: getPropertyValue(properties["진행 상태"]) as string,
              techStack: getPropertyValue(properties["기술 스택"]) as string[],
              coverImage:
                page.cover?.type === "external"
                  ? page.cover.external.url
                  : page.cover?.type === "file"
                  ? page.cover.file.url
                  : undefined,
            } as ProjectPost;

          case PostType.book:
            return {
              ...basePost,
              author: getPropertyValue(properties["저자"]) as string,
              rating: getPropertyValue(properties["평점"]) as number,
            } as BookPost;

          default:
            return basePost;
        }
      })
    );

    return posts;
  } catch (error) {
    console.log(error);
    return [];
  }
}
