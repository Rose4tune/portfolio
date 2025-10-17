import { PageObjectResponse } from "@notionhq/client";
import { formatDate } from "@/shared/lib/utils";
import { notionHQClient } from "./notionClient";

export function getPropertyValue(
  property: PageObjectResponse["properties"][string]
): string | string[] | number | boolean {
  if (!property) return "";

  switch (property.type) {
    case "title":
      return property.title?.map((t) => t.plain_text).join("") || "";
    case "rich_text":
      return property.rich_text?.[0]?.plain_text || "";
    case "date":
      const date = property.date?.start || "";
      return formatDate(date);
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

export async function getPageFirstContent(pageId: string): Promise<string> {
  try {
    const response = await notionHQClient.blocks.children.list({
      block_id: pageId,
      page_size: 10,
    });

    let content = "";
    for (const block of response.results) {
      if ("type" in block) {
        switch (block.type) {
          case "paragraph":
            if (block.paragraph?.rich_text) {
              const paragraphText = block.paragraph.rich_text
                .map((text) => text.plain_text)
                .join("");
              content += paragraphText + "\n";
            }
            break;
          case "heading_1":
            if (block.heading_1?.rich_text) {
              const headingText = block.heading_1.rich_text
                .map((text) => text.plain_text)
                .join("");
              content += "# " + headingText + "\n";
            }
            break;
          case "heading_2":
            if (block.heading_2?.rich_text) {
              const headingText = block.heading_2.rich_text
                .map((text) => text.plain_text)
                .join("");
              content += "## " + headingText + "\n";
            }
            break;
          case "heading_3":
            if (block.heading_3?.rich_text) {
              const headingText = block.heading_3.rich_text
                .map((text) => text.plain_text)
                .join("");
              content += "### " + headingText + "\n";
            }
            break;
          case "bulleted_list_item":
            if (block.bulleted_list_item?.rich_text) {
              const bulletText = block.bulleted_list_item.rich_text
                .map((text) => text.plain_text)
                .join("");
              content += "• " + bulletText + "\n";
            }
            break;
          case "numbered_list_item":
            if (block.numbered_list_item?.rich_text) {
              const numberedText = block.numbered_list_item.rich_text
                .map((text) => text.plain_text)
                .join("");
              content += "1. " + numberedText + "\n";
            }
            break;
        }
      }

      if (content.length > 100) break;
    }

    return content.trim().substring(0, 200);
  } catch (error) {
    console.log(error);
    return "";
  }
}
