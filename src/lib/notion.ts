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

async function getPageContent(
  blockId: string,
  indentation = 0
): Promise<string> {
  const blocksResponse = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 100, // Notion API max page size
  });

  const markdownPromises = blocksResponse.results.map(async (block) => {
    if (!("type" in block)) return "";

    let blockContent = "";
    const prefix = "  ".repeat(indentation);

    switch (block.type) {
      case "paragraph":
        if ("paragraph" in block) {
          const text = block.paragraph.rich_text
            .map((text: NotionRichText) => {
              let content = text.plain_text;
              if (text.annotations) {
                if (text.annotations.bold) content = `**${content}**`;
                if (text.annotations.italic) content = `*${content}*`;
                if (text.annotations.strikethrough) content = `~~${content}~~`;
                if (text.annotations.code) content = `\`${content}\``;
              }
              return content;
            })
            .join("");
          blockContent = text ? `${prefix}${text}\n\n` : "";
        }
        break;

      case "heading_1":
        if ("heading_1" in block) {
          const text = block.heading_1.rich_text
            .map((text: NotionRichText) => text.plain_text)
            .join("");
          blockContent = text ? `# ${text}\n\n` : "";
        }
        break;

      case "heading_2":
        if ("heading_2" in block) {
          const text = block.heading_2.rich_text
            .map((text: NotionRichText) => text.plain_text)
            .join("");
          blockContent = text ? `## ${text}\n\n` : "";
        }
        break;

      case "heading_3":
        if ("heading_3" in block) {
          const text = block.heading_3.rich_text
            .map((text: NotionRichText) => text.plain_text)
            .join("");
          blockContent = text ? `### ${text}\n\n` : "";
        }
        break;

      case "bulleted_list_item":
        if ("bulleted_list_item" in block) {
          const text = block.bulleted_list_item.rich_text
            .map((text: NotionRichText) => text.plain_text)
            .join("");
          blockContent = text ? `${prefix}- ${text}\n` : `${prefix}- \n`;
          if (block.has_children) {
            const childrenMarkdown = await getPageContent(
              block.id,
              indentation + 1
            );
            blockContent += childrenMarkdown;
          }
        }
        break;

      case "numbered_list_item":
        if ("numbered_list_item" in block) {
          const text = block.numbered_list_item.rich_text
            .map((text: NotionRichText) => text.plain_text)
            .join("");
          blockContent = text ? `${prefix}1. ${text}\n` : `${prefix}1. \n`;
          if (block.has_children) {
            const childrenMarkdown = await getPageContent(
              block.id,
              indentation + 1
            );
            blockContent += childrenMarkdown;
          }
        }
        break;

      case "code":
        if ("code" in block) {
          const text = block.code.rich_text
            .map((text: NotionRichText) => text.plain_text)
            .join("");
          const language = block.code.language;
          blockContent = text ? `\`\`\`${language}\n${text}\n\`\`\`\n\n` : "";
        }
        break;

      case "quote":
        if ("quote" in block) {
          const text = block.quote.rich_text
            .map((text: NotionRichText) => text.plain_text)
            .join("");
          blockContent = text ? `> ${text}\n\n` : "";
        }
        break;

      case "image":
        if ("image" in block) {
          let url: string | undefined;
          if (block.image.type === "file") {
            url = block.image.file.url;
          } else if (block.image.type === "external") {
            url = block.image.external.url;
          }

          if (!url) return "";

          const caption = block.image.caption
            ?.map((text: NotionRichText) => text.plain_text)
            .join("");
          return `<img src="${url}" alt="${caption || ""}" />\n\n`;
        }
        break;

      case "column_list":
        if ("column_list" in block) {
          const columnChildren = await notion.blocks.children.list({
            block_id: block.id,
            page_size: 100, // Max page size for children
          });

          const columnContentsPromises = columnChildren.results.map(
            async (colBlock) => {
              // Each child of a column_list should be a 'column' block
              if ("type" in colBlock && colBlock.type === "column") {
                const content = await getPageContent(colBlock.id, indentation); // Keep same indentation for content inside column
                return `<div class="notion-column-item">${content}</div>`; // Use a custom class
              }
              return "";
            }
          );
          const validColumnContents = (
            await Promise.all(columnContentsPromises)
          ).filter(Boolean);
          const columnCount = validColumnContents.length;

          if (columnCount > 0) {
            blockContent = `<div class="notion-column-list notion-columns-${columnCount}">${validColumnContents.join(
              ""
            )}</div>\n\n`;
          }
        }
        break;

      default:
        // For any other block type that might have children (like toggle, synced block, etc.)
        if (block.has_children && block.type !== "column") {
          // Exclude 'column' here as it's handled by 'column_list'
          const childrenMarkdown = await getPageContent(
            block.id,
            indentation + 1
          );
          blockContent += childrenMarkdown;
        }
        break;
    }
    return blockContent;
  });

  const allMarkdown = await Promise.all(markdownPromises);
  return allMarkdown.join("");
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
    page_size: process.env.NODE_ENV === "development" ? 1 : undefined,
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
