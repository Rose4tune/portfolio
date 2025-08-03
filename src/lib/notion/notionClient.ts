import { NotionAPI } from "notion-client";

const notionApi = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL || "https://www.notion.so/api/v3",
  userTimeZone: "Asia/Seoul",
});

export async function getRecordMap(pageId: string) {
  if (!pageId) {
    console.error("Invalid pageId provided to getRecordMap");
    throw new Error("Invalid pageId");
  }

  const cleanPageId = pageId;
  
  const hasPrefix = pageId.includes('-');
  console.log(`[DEBUG] getRecordMap - Original pageId: "${pageId}"`);
  console.log(`[DEBUG] getRecordMap - Using pageId: "${cleanPageId}" (has prefix: ${hasPrefix})`);
  
  try {
    console.log(`[DEBUG] Fetching Notion page with ID: ${cleanPageId}`);
    const recordMap = await notionApi.getPage(cleanPageId);
    console.log(`[DEBUG] ✅ Successfully fetched Notion page`);
    return recordMap;
  } catch (error) {
    console.error(`[DEBUG] ❌ Error fetching Notion page: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}