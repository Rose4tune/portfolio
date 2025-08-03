import { NotionAPI } from "notion-client";

const notionApi = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL || "https://www.notion.so/api/v3",
  userTimeZone: "Asia/Seoul",
});

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error: unknown) {
    if (retries <= 0) {
      console.error("모든 재시도 시도 실패:", error);
      throw error;
    }

    console.log(`재시도 중... (${retries} 회 남음)`);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return withRetry(fn, retries - 1, delay * 2);
  }
}

export async function getRecordMap(pageId: string) {
  if (!pageId) {
    console.error("Invalid pageId provided to getRecordMap");
    throw new Error("Invalid pageId");
  }

  const formats = [
    pageId,
    pageId.replace(/-/g, ""),
    pageId.split("-")[0],
  ];

  console.log(`[DEBUG] getRecordMap - Original pageId: "${pageId}"`);
  console.log(
    `[DEBUG] getRecordMap - Will try these formats: ${JSON.stringify(formats)}`
  );

  let lastError: Error | unknown = null;

  for (const idFormat of formats) {
    try {
      console.log(`[DEBUG] Fetching Notion page with ID format: ${idFormat}`);

      const recordMap = await withRetry(
        () => notionApi.getPage(idFormat),
        2,
        1000
      );

      console.log(
        `[DEBUG] ✅ Successfully fetched Notion page with ID format: ${idFormat}`
      );
      return recordMap;
    } catch (error: unknown) {
      console.error(
        `[DEBUG] Failed with ID format ${idFormat}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      lastError = error;
    }
  }

  console.error(`[DEBUG] ❌ All ID formats failed for pageId: ${pageId}`);
  throw (
    lastError || new Error("Failed to fetch Notion page with all ID formats")
  );
}
