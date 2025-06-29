import { NotionAPI } from "notion-client";
import type { ExtendedRecordMap } from "notion-types";

const notion = new NotionAPI();

export async function getRecordMap(slug: string): Promise<ExtendedRecordMap> {
  try {
    const recordMap = await notion.getPage(slug);
    return recordMap;
  } catch (error) {
    console.error("[getRecordMap error]", error);
    throw new Error("Failed to load Notion page");
  }
}
