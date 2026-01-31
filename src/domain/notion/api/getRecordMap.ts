import { notionClient } from "../lib/client";
import { withRetry } from "../lib/withRetry";

export async function getRecordMap(pageId: string) {
  if (!pageId) {
    throw new Error("Invalid pageId");
  }

  // 디버깅: console.log(`[getRecordMap] pageId=${pageId}`);

  const formats = [
    pageId,
    pageId.replace(/-/g, ""),
    pageId.split("-")[0],
    pageId.includes("-") ? pageId.split("-").slice(1).join("-") : pageId,
  ];

  let lastError: Error | unknown = null;

  for (const idFormat of formats) {
    try {
      const recordMap = await withRetry(
        () =>
          notionClient.getPage(idFormat, {
            signFileUrls: true,
          }),
        5,
        2000,
        30000
      );

      if (
        !recordMap ||
        !recordMap.block ||
        Object.keys(recordMap.block).length === 0
      ) {
        throw new Error("Empty recordMap returned from Notion API");
      }

      return recordMap;
    } catch (error: unknown) {
      lastError = error;
    }
  }

  if (lastError instanceof Error) {
    throw new Error(`Failed to fetch Notion page: ${lastError.message}`);
  } else {
    throw new Error(`Failed to fetch Notion page with unknown error`);
  }
}
