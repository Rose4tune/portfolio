import { NotionAPI } from 'notion-client';

// 향상된 옵션으로 NotionAPI 클라이언트 초기화
const notionApi = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL || 'https://www.notion.so/api/v3',
  activeUser: process.env.NOTION_ACTIVE_USER,
  authToken: process.env.NOTION_AUTH_TOKEN,
  userTimeZone: 'Asia/Seoul',
});

export async function getRecordMap(pageId: string) {
  if (!pageId) {
    console.error('Invalid pageId provided to getRecordMap');
    throw new Error('Invalid pageId');
  }

  // 페이지 ID 정리 (하이픈 제거)
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