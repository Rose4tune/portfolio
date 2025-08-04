import { NotionAPI } from "notion-client";

// console.log(`[DEBUG] Notion Auth Config:
//   - API Base URL: ${process.env.NOTION_API_BASE_URL || "https://www.notion.so/api/v3"}
//   - Active User: ${process.env.NOTION_ACTIVE_USER ? "설정됨" : "설정되지 않음"}
//   - Auth Token: ${process.env.NOTION_AUTH_TOKEN ? "설정됨" : "설정되지 않음"}
//   - 환경: ${process.env.NODE_ENV}
// `);

const notionApi = new NotionAPI({
  apiBaseUrl: "https://www.notion.so/api/v3",
  userTimeZone: "Asia/Seoul",
  activeUser: process.env.NOTION_ACTIVE_USER,
  authToken: process.env.NOTION_TOKEN_V2,
  kyOptions: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
      'Origin': process.env.NEXT_PUBLIC_SITE_URL || 'https://rose4tune-portfolio.vercel.app',
      'Referer': 'https://www.notion.so/',
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    },
    timeout: 60000,
    retry: {
      limit: 5,
      methods: ['get', 'post'],
      statusCodes: [408, 413, 429, 500, 502, 503, 504]
    }
  }
});

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 5,
  delay = 2000,
  timeout = 30000
): Promise<T> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Operation timed out after ${timeout}ms`)), timeout);
    });
    
    return await Promise.race([fn(), timeoutPromise]);
  } catch (error: unknown) {
    if (retries <= 0) {
      console.error("모든 재시도 시도 실패:", error);
      
      if (error instanceof Error) {
        const errorObj = error as unknown as Record<string, unknown>;
        console.error(
          `[DEBUG] 최종 실패 상세 정보:
          - 에러 이름: ${error.name}
          - 에러 메시지: ${error.message}
          - 에러 코드: ${errorObj.code || 'N/A'}
          - 상태 코드: ${errorObj.statusCode || 'N/A'}
          - 요청 URL: ${errorObj.requestUrl || 'N/A'}`
        );
      }
      
      throw error;
    }

    console.log(`재시도 중... (${retries} 회 남음)`);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return withRetry(fn, retries - 1, delay * 1.5);
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
    pageId.includes("-") ? pageId.split("-").slice(1).join("-") : pageId,
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
        5,
        2000,
        30000
      );

      if (!recordMap || !recordMap.block || Object.keys(recordMap.block).length === 0) {
        console.error(`[DEBUG] Empty recordMap returned for ID: ${idFormat}`);
        throw new Error("Empty recordMap returned from Notion API");
      }

      console.log(
        `[DEBUG] ✅ Successfully fetched Notion page with ID format: ${idFormat}`
      );
      return recordMap;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `[DEBUG] 상세 에러 정보 for ID ${idFormat}:
          - 에러 이름: ${error.name}
          - 에러 메시지: ${error.message}
          - 에러 스택: ${error.stack}
          - 환경: ${process.env.NODE_ENV}
          - 에러 객체: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`
        );
      } else {
        console.error(
          `[DEBUG] 비표준 에러 객체 for ID ${idFormat}: ${String(error)}
          - 타입: ${typeof error}
          - 환경: ${process.env.NODE_ENV}
          - 세부 정보: ${JSON.stringify(error)}`
        );
      }
      
      console.error(
        `[DEBUG] Failed with ID format ${idFormat}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      lastError = error;
    }
  }

  console.error(`[DEBUG] ❌ All ID formats failed for pageId: ${pageId}`);
  
  if (lastError instanceof Error) {
    throw new Error(`Failed to fetch Notion page: ${lastError.message}`);
  } else {
    throw new Error(`Failed to fetch Notion page with unknown error`);
  }
}
