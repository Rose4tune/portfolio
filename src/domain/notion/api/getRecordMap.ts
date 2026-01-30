import { notionClient } from "../lib/client";
import { withRetry } from "../lib/withRetry";
import { notionHQClient } from "@/domain/posts/lib/notionClient";

const RETRIES = 5;
const DELAY_MS = 2000;
const TIMEOUT_MS = 30000;

export async function getRecordMap(pageId: string) {
  if (!pageId) {
    throw new Error("Invalid pageId");
  }

  const formats = [pageId, pageId.replace(/-/g, "")];
  let lastError: Error | unknown = null;

  for (const idFormat of formats) {
    try {
      const recordMap = await withRetry(
        () =>
          notionClient.getPage(idFormat, {
            signFileUrls: true,
          }),
        RETRIES,
        DELAY_MS,
        TIMEOUT_MS
      );

      if (
        !recordMap ||
        !recordMap.block ||
        Object.keys(recordMap.block).length === 0
      ) {
        throw new Error("Empty recordMap returned from Notion API");
      }

      await enhanceImageUrls(recordMap);
      await enhancePageCover(recordMap, idFormat);

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

/**
 * recordMap의 이미지 블록들을 찾아서 @notionhq/client로 실제 S3 URL을 가져옴
 * 홈 화면과 동일한 방식으로 이미지를 로드하기 위함
 */
async function enhanceImageUrls(
  recordMap: Awaited<ReturnType<typeof notionClient.getPage>>
) {
  try {
    const imageBlockIdSet = new Set<string>();
    for (const [blockId, block] of Object.entries(recordMap.block)) {
      const blockValue = block?.value;
      const blockType =
        blockValue?.type || (block as { type?: string } | undefined)?.type;
      const hasSource =
        !!(blockValue as { properties?: { source?: unknown } } | undefined)
          ?.properties?.source ||
        !!(block as { properties?: { source?: unknown } } | undefined)
          ?.properties?.source;
      if (blockType === "image" || hasSource) {
        imageBlockIdSet.add(blockId);
      }
    }
    const imageBlockIds = Array.from(imageBlockIdSet);

    // 디버깅: 이미지 블록 0개일 때 원인 파악용
    // if (imageBlockIds.length === 0) {
    //   const blockTypes: Record<string, number> = {};
    //   for (const [, b] of Object.entries(recordMap.block)) {
    //     const t = (b?.value?.type || (b as any)?.type) || "unknown";
    //     blockTypes[t] = (blockTypes[t] || 0) + 1;
    //   }
    //   console.warn("[enhanceImageUrls] 이미지 블록 0개, 블록 타입:", blockTypes);
    // }

    for (const blockId of imageBlockIds) {
      try {
        const block = await notionHQClient.blocks.retrieve({
          block_id: blockId,
        });

        if ("type" in block && block.type === "image") {
          const imageUrl =
            block.image.type === "external"
              ? block.image.external.url
              : block.image.type === "file"
              ? block.image.file.url
              : null;

          if (imageUrl && imageUrl.includes("amazonaws.com")) {
            recordMap.signed_urls[blockId] = imageUrl;
            const normalizedId = blockId.replace(/-/g, "");
            recordMap.signed_urls[normalizedId] = imageUrl;
            const notionUrl = `https://www.notion.so/image/${encodeURIComponent(imageUrl)}?table=block&id=${blockId}`;
            recordMap.signed_urls[notionUrl] = imageUrl;
          }
        }
      } catch (error) {
        console.error(
          `[enhanceImageUrls] block ${blockId}:`,
          error instanceof Error ? error.message : error
        );
      }
    }
  } catch (error) {
    console.warn("[enhanceImageUrls] 실패:", error);
  }
}

/**
 * 페이지 커버 이미지의 실제 S3 URL을 가져옴
 */
async function enhancePageCover(
  recordMap: Awaited<ReturnType<typeof notionClient.getPage>>,
  pageId: string
) {
  try {
    const page = await notionHQClient.pages.retrieve({
      page_id: pageId,
    });

    if ("cover" in page && page.cover) {
      const coverUrl =
        page.cover.type === "external"
          ? page.cover.external.url
          : page.cover.type === "file"
          ? page.cover.file.url
          : null;

      if (coverUrl && coverUrl.includes("amazonaws.com")) {
        recordMap.signed_urls[pageId] = coverUrl;
        const normalizedId = pageId.replace(/-/g, "");
        recordMap.signed_urls[normalizedId] = coverUrl;
      }
    }
  } catch (error) {
    console.warn("[enhancePageCover] 실패:", error);
  }
}
