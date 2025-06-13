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

type NotionAnnotation = {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  code?: boolean;
  color?: string;
};

type NotionRichText = {
  plain_text: string;
  annotations?: NotionAnnotation;
};

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
      if (!("type" in block)) return "";

      switch (block.type) {
        case "paragraph":
          if ("paragraph" in block) {
            const text = block.paragraph.rich_text
              .map((text: NotionRichText) => {
                let content = text.plain_text;
                if (text.annotations) {
                  if (text.annotations.bold) content = `**${content}**`;
                  if (text.annotations.italic) content = `*${content}*`;
                  if (text.annotations.strikethrough)
                    content = `~~${content}~~`;
                  if (text.annotations.code) content = `\`${content}\``;
                }
                return content;
              })
              .join("");
            return text ? `${text}\n\n` : "";
          }
          return "";

        case "heading_1":
          if ("heading_1" in block) {
            const text = block.heading_1.rich_text
              .map((text: NotionRichText) => text.plain_text)
              .join("");
            return text ? `# ${text}\n\n` : "";
          }
          return "";

        case "heading_2":
          if ("heading_2" in block) {
            const text = block.heading_2.rich_text
              .map((text: NotionRichText) => text.plain_text)
              .join("");
            return text ? `## ${text}\n\n` : "";
          }
          return "";

        case "heading_3":
          if ("heading_3" in block) {
            const text = block.heading_3.rich_text
              .map((text: NotionRichText) => text.plain_text)
              .join("");
            return text ? `### ${text}\n\n` : "";
          }
          return "";

        case "bulleted_list_item":
          if ("bulleted_list_item" in block) {
            const text = block.bulleted_list_item.rich_text
              .map((text: NotionRichText) => text.plain_text)
              .join("");
            return text ? `- ${text}\n` : "";
          }
          return "";

        case "numbered_list_item":
          if ("numbered_list_item" in block) {
            const text = block.numbered_list_item.rich_text
              .map((text: NotionRichText) => text.plain_text)
              .join("");
            return text ? `1. ${text}\n` : "";
          }
          return "";

        case "code":
          if ("code" in block) {
            const text = block.code.rich_text
              .map((text: NotionRichText) => text.plain_text)
              .join("");
            const language = block.code.language;
            return text ? `\`\`\`${language}\n${text}\n\`\`\`\n\n` : "";
          }
          return "";

        case "quote":
          if ("quote" in block) {
            const text = block.quote.rich_text
              .map((text: NotionRichText) => text.plain_text)
              .join("");
            return text ? `> ${text}\n\n` : "";
          }
          return "";

        case "image":
          if ("image" in block && block.image.type === "external") {
            const url = block.image.external.url;
            const caption = block.image.caption
              ?.map((text: NotionRichText) => text.plain_text)
              .join("");
            return caption ? `![${caption}](${url})\n\n` : `![](${url})\n\n`;
          }
          return "";

        default:
          return "";
      }
    })
    .join("");
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
