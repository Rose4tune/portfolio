import { Client, PageObjectResponse } from '@notionhq/client';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DB = {
  blog: process.env.NOTION_DB_ID_BLOG as string,
  project: process.env.NOTION_DB_ID_PROJECT as string,
  book: process.env.NOTION_DB_ID_BOOK as string,
};

const notion = new Client({
  auth: NOTION_API_KEY,
});

export enum PostType {
  blog = "blog",
  project = "project",
  book = "book",
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt?: string;
  content?: string;
}

export interface ProjectPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  status?: string;
  techStack?: string[];
}

export interface BookPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  author?: string;
  rating?: number;
}

export async function getPosts(type: PostType.blog): Promise<BlogPost[]>;
export async function getPosts(type: PostType.project): Promise<ProjectPost[]>;
export async function getPosts(type: PostType.book): Promise<BookPost[]>;
export async function getPosts(type: PostType): Promise<BlogPost[] | ProjectPost[] | BookPost[]>;

export async function getPosts(type: PostType) {
  const response = await notion.databases.query({
    database_id: NOTION_DB[type],
    filter: {
      property: "숨김",
      checkbox: {
        equals: false,
      },
    },
    sorts: [
      {
        property: "작성일",
        direction: "descending",
      },
    ],
  });

  const pages = response.results as PageObjectResponse[];
  
  const posts = await Promise.all(
    pages.map(async (page) => {
      const properties = page.properties;
      const title = getPropertyValue(properties["이름"]) as string;
      const slug = generateSlug(title);
      const date = getPropertyValue(properties["작성일"]) as string;
      const tags = getPropertyValue(properties["키워드"]) as string[];

      const basePost = {
        id: page.id,
        title,
        slug,
        date,
        tags,
      };

      switch (type) {
        case PostType.blog:
          const excerpt = getPropertyValue(properties["요약"]) as string;
          const content = excerpt || (await getPageFirstContent(page.id));
          return {
            ...basePost,
            excerpt,
            content,
          } as BlogPost;
          
        case PostType.project:
          return {
            ...basePost,
            status: getPropertyValue(properties["상태"]) as string,
            techStack: getPropertyValue(properties["기술스택"]) as string[],
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
}








export async function getPageIdBySlug(
  database_id: string,
  slug: string
): Promise<string | null> {
  
  if (!slug || typeof slug !== 'string') {
    console.error('Invalid slug provided:', slug);
    return null;
  }

  const response = await notion.databases.query({
    database_id,
    filter: {
      property: "이름",
      rich_text: {
        contains: slug.replace(/-/g, " "),
      },
    },
  });

  const result = response.results[0];
  if (!result || !("id" in result)) return null;

  return result.id.replace(/-/g, "");
}



function getPropertyValue(
  property: PageObjectResponse['properties'][string]
): string | string[] | number | boolean {
  if (!property) return "";

  switch (property.type) {
    case "title":
      return property.title?.map((t) => t.plain_text).join("") || "";
    case "rich_text":
      return property.rich_text?.[0]?.plain_text || "";
    case "date":
      const date = property.date?.start || "";
      return new Date(date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "select":
      return property.select?.name || "";
    case "multi_select":
      return property.multi_select?.map((item) => item.name) || [];
    case "number":
      return property.number || 0;
    case "checkbox":
      return property.checkbox || false;
    default:
      return "";
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+$/, "");
}

export async function getUniqueTags(type: PostType): Promise<string[]> {
  const response = await notion.databases.query({
    database_id: NOTION_DB[type],
    filter: {
      property: "숨김",
      checkbox: { equals: false },
    },
  });

  const pages = response.results as PageObjectResponse[];
  const allTags = pages.flatMap((page) => {
    const tags = getPropertyValue(page.properties["키워드"]) as string[];
    return tags;
  });
  return [...new Set(allTags)].sort();
}

export async function getPageFirstContent(pageId: string): Promise<string> {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 10,
    });

    let content = '';
    for (const block of response.results) {
      if ('type' in block) {
        switch (block.type) {
          case 'paragraph':
            if (block.paragraph?.rich_text) {
              content += block.paragraph.rich_text.map(text => text.plain_text).join('') + '\n';
            }
            break;
          case 'heading_1':
            if (block.heading_1?.rich_text) {
              content += '# ' + block.heading_1.rich_text.map(text => text.plain_text).join('') + '\n';
            }
            break;
          case 'heading_2':
            if (block.heading_2?.rich_text) {
              content += '## ' + block.heading_2.rich_text.map(text => text.plain_text).join('') + '\n';
            }
            break;
          case 'heading_3':
            if (block.heading_3?.rich_text) {
              content += '### ' + block.heading_3.rich_text.map(text => text.plain_text).join('') + '\n';
            }
            break;
          case 'bulleted_list_item':
            if (block.bulleted_list_item?.rich_text) {
              content += '• ' + block.bulleted_list_item.rich_text.map(text => text.plain_text).join('') + '\n';
            }
            break;
          case 'numbered_list_item':
            if (block.numbered_list_item?.rich_text) {
              content += '1. ' + block.numbered_list_item.rich_text.map(text => text.plain_text).join('') + '\n';
            }
            break;
        }
      }
    }
    return content.trim();
  } catch (error) {
    console.error('Error fetching page content:', error);
    return '';
  }
}














// type NotionProperty = {
//   type: "title" | "rich_text" | "date" | "checkbox" | "multi_select";
//   id: string;
//   title?: { plain_text: string }[];
//   rich_text?: { plain_text: string }[];
//   date?: { start: string };
//   checkbox?: { equals: boolean };
//   multi_select?: { name: string }[];
// };

// type NotionProperties = {
//   [key: string]: NotionProperty;
// };

// type NotionPage = PageObjectResponse & {
//   properties: NotionProperties;
// };







// 기존 BlogPostMeta는 BlogPost로 대체됨

// export async function getBlogPostMeta(
//   slug: string
// ): Promise<BlogPostMeta | null> {
//   const databaseId = process.env.NOTION_DB_ID_BLOG!;
//   const response = await notion.databases.query({
//     database_id: databaseId,
//     filter: {
//       property: "숨김",
//       checkbox: { equals: false },
//     },
//   });

//   const pages = response.results as PageObjectResponse[];
//   for (const page of pages) {
//     const title = getPropertyValue(page.properties["이름"], "title") as string;
//     const generatedSlug = generateSlug(title);
//     if (generatedSlug === slug) {
//       const date = getPropertyValue(page.properties["작성일"], "date") as string;
//       const tags = getPropertyValue(page.properties["키워드"], "multi_select") as string[];
//       return {
//         id: page.id,
//         title,
//         slug: generatedSlug,
//         date,
//         tags,
//       };
//     }
//   }
//   return null;
// }
