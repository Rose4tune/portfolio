import { NotionAPI } from "notion-client";

const notion = new NotionAPI();

export async function getNotionPage(pageId: string) {
  return await notion.getPage(pageId);
}
