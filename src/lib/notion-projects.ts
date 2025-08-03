import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DB_ID_PROJECT!;

export async function getPageIdBySlug(
  slug: string
): Promise<string | null> {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "이름",
      rich_text: {
        contains: slug.replace(/-/g, " "),
      },
    },
  });

  const result = response.results[0];
  if (!result || !("id" in result)) return null;

  return result.id.replace(/-/g, "");
}
