import { Client, PageObjectResponse } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

type NotionProperty = {
  type: "title" | "rich_text" | "date" | "checkbox" | "multi_select";
  id: string;
  title?: { plain_text: string }[];
  rich_text?: { plain_text: string }[];
  date?: { start: string };
  checkbox?: { equals: boolean };
  multi_select?: { name: string }[];
};

type NotionProperties = {
  [key: string]: NotionProperty;
};

type NotionPage = PageObjectResponse & {
  properties: NotionProperties;
};

export interface BlogPostMeta {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags?: string[];
}

function getPropertyValue(
  page: NotionPage,
  propertyName: string,
  type: string
): string | string[] {
  const property = page.properties[propertyName];
  if (!property || property.type !== type)
    return type === "multi_select" ? [] : "";

  switch (type) {
    case "title":
      return property.title?.[0]?.plain_text || "";
    case "rich_text":
      return property.rich_text?.[0]?.plain_text || "";
    case "date":
      return property.date?.start || "";
    case "multi_select":
      return property.multi_select?.map((item) => item.name) || [];
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

export async function getBlogPosts(): Promise<BlogPostMeta[]> {
  const databaseId = process.env.NOTION_DB_ID_BLOG!;
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "숨김",
      checkbox: { equals: false },
    },
    sorts: [
      {
        property: "작성일",
        direction: "descending",
      },
    ],
  });

  const pages = response.results as NotionPage[];
  return pages.map((page) => {
    const title = getPropertyValue(page, "이름", "title") as string;
    const slug = generateSlug(title);
    const date = getPropertyValue(page, "작성일", "date") as string;
    const tags = getPropertyValue(page, "키워드", "multi_select") as string[];
    return {
      id: page.id,
      title,
      slug,
      date,
      tags,
    };
  });
}

export async function getBlogPostMeta(
  slug: string
): Promise<BlogPostMeta | null> {
  const databaseId = process.env.NOTION_DB_ID_BLOG!;
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "숨김",
      checkbox: { equals: false },
    },
  });

  const pages = response.results as NotionPage[];
  for (const page of pages) {
    const title = getPropertyValue(page, "이름", "title") as string;
    const generatedSlug = generateSlug(title);
    if (generatedSlug === slug) {
      const date = getPropertyValue(page, "작성일", "date") as string;
      const tags = getPropertyValue(page, "키워드", "multi_select") as string[];
      return {
        id: page.id,
        title,
        slug: generatedSlug,
        date,
        tags,
      };
    }
  }
  return null;
}

export async function getUniqueTags(): Promise<string[]> {
  const databaseId = process.env.NOTION_DB_ID_BLOG!;
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "숨김",
      checkbox: { equals: false },
    },
  });

  const pages = response.results as NotionPage[];
  const allTags = pages.flatMap((page) => {
    const tags = getPropertyValue(page, "키워드", "multi_select") as string[];
    return tags;
  });
  return [...new Set(allTags)].sort();
}
