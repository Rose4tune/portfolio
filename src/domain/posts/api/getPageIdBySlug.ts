import { PageObjectResponse } from "@notionhq/client";
import { generateSlug } from "@/shared/lib/utils";
import { PostType } from "../types";
import { notionHQClient, NOTION_DB } from "../lib/notionClient";
import { getPropertyValue } from "../lib/helpers";

export async function getPageIdBySlug(
  type: PostType,
  slug: string
): Promise<string | null> {
  if (!slug || typeof slug !== "string") {
    return null;
  }

  const decodedSlug = decodeURIComponent(slug);
  const database_id = NOTION_DB[type];

  if (!database_id) {
    return null;
  }

  try {
    const response = await notionHQClient.databases.query({
      database_id,
      filter: {
        property: "숨김",
        checkbox: { equals: false },
      },
    });

    const pages = response.results as PageObjectResponse[];
    for (const page of pages) {
      const title = getPropertyValue(page.properties["제목"]) as string;
      const generatedSlug = generateSlug(title);

      if (generatedSlug === decodedSlug) {
        return page.id;
      }
    }

    console.log(`❌ 일치하는 페이지를 찾지 못함`);
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}
