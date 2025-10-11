import { NotionAPI } from "notion-client";

const notionApi = new NotionAPI({
  apiBaseUrl: "https://www.notion.so/api/v3",
  userTimeZone: "Asia/Seoul",
  activeUser: process.env.NOTION_ACTIVE_USER,
  authToken: process.env.NOTION_TOKEN_V2,
  kyOptions: {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      Origin:
        process.env.NEXT_PUBLIC_SITE_URL ||
        "https://rose4tune-portfolio.vercel.app",
      Referer: "https://www.notion.so/",
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      Accept: "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
    timeout: 60000,
    retry: {
      limit: 5,
      methods: ["get", "post"],
      statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
    hooks: {
      afterResponse: [
        (_request, _options, response) => {
          return response;
        },
      ],
      beforeError: [
        (error) => {
          return error;
        },
      ],
    },
  },
});

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 5,
  delay = 2000,
  timeout = 30000
): Promise<T> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(
        () => reject(new Error(`Operation timed out after ${timeout}ms`)),
        timeout
      );
    });

    const result = await Promise.race([fn(), timeoutPromise]);

    return result;
  } catch (error: unknown) {
    if (retries <= 0) {
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));

    return withRetry(fn, retries - 1, delay * 1.5, timeout);
  }
}

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
        () => notionApi.getPage(idFormat),
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
