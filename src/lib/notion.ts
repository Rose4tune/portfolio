import { Client, PageObjectResponse } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function getBlogPosts(): Promise<PageObjectResponse[]> {
  const databaseId = process.env.NOTION_DATABASE_ID!;
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "숨김",
      checkbox: { equals: false },
    },
    sorts: [
      {
        property: "작성일",
        direction: "descending",
      },
    ],
  });
  return response.results as PageObjectResponse[];
}

export async function getBlogPost(pageId: string): Promise<PageObjectResponse> {
  const response = (await notion.pages.retrieve({
    page_id: pageId,
  })) as PageObjectResponse;
  return response;
}
