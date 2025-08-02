import { NotionAPI } from 'notion-client';

const notionApi = new NotionAPI();

export async function getRecordMap(pageId: string) {
  try {
    const recordMap = await notionApi.getPage(pageId);
    return recordMap;
  } catch (error) {
    console.error("Error fetching Notion page:", error);
    throw error;
  }
}