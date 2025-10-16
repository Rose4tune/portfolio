import { PageObjectResponse } from "@notionhq/client";
import { uniqueArray } from "@/shared/lib/utils";
import { PostType } from "../types";
import { notionHQClient, NOTION_DB } from "../lib/notionClient";
import { getPropertyValue } from "../lib/helpers";

export async function getUniqueTags(type: PostType): Promise<string[]> {
  const database_id = NOTION_DB[type];

  if (!database_id) {
    return [];
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
    const allTags = pages.flatMap((page) => {
      const tags = getPropertyValue(page.properties["키워드"]) as string[];
      return tags;
    });
    const uniqueTags = uniqueArray(allTags).sort();

    return uniqueTags;
  } catch (error) {
    console.log(error);
    return [];
  }
}
