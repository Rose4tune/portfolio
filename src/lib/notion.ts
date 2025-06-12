import { Client, PageObjectResponse } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

type NotionProperty = {
  type: "title" | "rich_text" | "date" | "checkbox";
  id: string;
  title?: { plain_text: string }[];
  rich_text?: { plain_text: string }[];
  date?: { start: string };
  checkbox?: { equals: boolean };
};

type NotionProperties = {
  [key: string]: NotionProperty;
};

type NotionPage = PageObjectResponse & {
  properties: NotionProperties;
};

interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  date: string;
}

function getPropertyValue(
  page: NotionPage,
  propertyName: string,
  type: string
): string {
  const property = page.properties[propertyName];

  if (!property || property.type !== type) return "";

  switch (type) {
    case "title":
      return property.title?.[0]?.plain_text || "";
    case "rich_text":
      return property.rich_text?.[0]?.plain_text || "";
    case "date":
      return property.date?.start || "";
    default:
      return "";
  }
}

async function getPageContent(pageId: string): Promise<string> {
  const blocks = await notion.blocks.children.list({
    block_id: pageId,
  });

  return blocks.results
    .map((block) => {
      if (
        "type" in block &&
        block.type === "paragraph" &&
        "paragraph" in block
      ) {
        return block.paragraph.rich_text
          .map((text: { plain_text: string }) => text.plain_text)
          .join("");
      }
      return "";
    })
    .join("\n");
}

async function convertToBlogPost(page: NotionPage): Promise<BlogPost> {
  const title = getPropertyValue(page, "이름", "title");
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+$/, "");
  const date = getPropertyValue(page, "작성일", "date");
  const content = await getPageContent(page.id);

  return {
    id: page.id,
    title,
    content,
    slug,
    date,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const databaseId = process.env.NOTION_DATABASE_ID!;
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
  return Promise.all(pages.map(convertToBlogPost));
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const databaseId = process.env.NOTION_DATABASE_ID!;
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "숨김",
      checkbox: { equals: false },
    },
  });

  const pages = response.results as NotionPage[];

  for (const page of pages) {
    const title = getPropertyValue(page, "이름", "title");
    const generatedSlug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+$/, "");

    if (generatedSlug === slug) {
      const date = getPropertyValue(page, "작성일", "date");
      const content = await getPageContent(page.id);

      return {
        id: page.id,
        title,
        content,
        slug: generatedSlug,
        date,
      };
    }
  }

  return null;
}
