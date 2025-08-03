import { NotionAPI } from 'notion-client';

const notionApi = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL || 'https://www.notion.so/api/v3',
  userTimeZone: 'Asia/Seoul',
});

export async function getRecordMap(pageId: string) {
  if (!pageId) {
    console.error('Invalid pageId provided to getRecordMap');
    throw new Error('Invalid pageId');
  }

  const cleanPageId = pageId.replace(/-/g, '');
  
  try {
    console.log(`Fetching Notion page with ID: ${cleanPageId}`);
    const recordMap = await notionApi.getPage(cleanPageId);
    return recordMap;
  } catch (error) {
    console.error("Error fetching Notion page:", error);
    throw error;
  }
}