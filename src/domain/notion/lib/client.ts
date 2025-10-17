import { NotionAPI } from "notion-client";

export const notionClient = new NotionAPI({
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
