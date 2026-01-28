import { notionClient } from "../lib/client";
import { withRetry } from "../lib/withRetry";
import { notionHQClient } from "@/domain/posts/lib/notionClient";

export async function getRecordMap(pageId: string) {
  if (!pageId) {
    throw new Error("Invalid pageId");
  }

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

      // 이미지 블록의 실제 S3 URL을 가져와서 signed_urls에 추가
      await enhanceImageUrls(recordMap, idFormat);

      // 페이지 커버 이미지도 처리
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
  recordMap: Awaited<ReturnType<typeof notionClient.getPage>>,
  pageId: string
) {
  try {
    // recordMap에서 이미지 블록 ID들 찾기
    const imageBlockIds: string[] = [];
    for (const [blockId, block] of Object.entries(recordMap.block)) {
      const blockValue = block?.value;
      if (blockValue?.type === "image") {
        imageBlockIds.push(blockId);
      }
    }

    // 각 이미지 블록의 실제 S3 URL 가져오기
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
            // S3 URL을 signed_urls에 추가 (홈 화면과 동일한 형식)
            recordMap.signed_urls[blockId] = imageUrl;
          }
        }
      } catch (error) {
        // 개별 블록 조회 실패 시 무시
        console.warn(`Failed to fetch image block ${blockId}:`, error);
      }
    }
  } catch (error) {
    // 이미지 URL 강화 실패해도 계속 진행
    console.warn("Failed to enhance image URLs:", error);
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
        // 페이지 ID를 키로 사용하여 커버 이미지 URL 저장
        recordMap.signed_urls[pageId] = coverUrl;
      }
    }
  } catch (error) {
    // 커버 이미지 조회 실패 시 무시
    console.warn("Failed to fetch page cover:", error);
  }
}
