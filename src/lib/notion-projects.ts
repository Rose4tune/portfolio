import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_BLOG_DATABASE_ID!;

export async function getPageIdBySlug(slug: string): Promise<string | null> {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "이름",
      rich_text: {
        contains: slug.replace(/-/g, " "),
      },
    },
  });

  console.log("Response from Notion:", response);

  const result = response.results[0];
  if (!result || !("id" in result)) return null;

  return result.id.replace(/-/g, "");
}

// export async function getBlogPost(slug: string): Promise<BlogPost | null> {
//   const databaseId = process.env.NOTION_BLOG_DATABASE_ID!;
//   const response = await notion.databases.query({
//     database_id: databaseId,
//     filter: {
//       property: "숨김",
//       checkbox: { equals: false },
//     },
//   });

//   const pages = response.results as NotionPage[];

//   for (const page of pages) {
//     const title = getPropertyValue(page, "이름", "title") as string;
//     const generatedSlug = title
//       .toLowerCase()
//       .replace(/\s+/g, "-")
//       .replace(/[^a-z0-9-]/g, "")
//       .replace(/-+$/, "");

//     if (generatedSlug === slug) {
//       const date = getPropertyValue(page, "작성일", "date") as string;
//       const content = await getPageContent(page.id);
//       const tags = getPropertyValue(page, "키워드", "multi_select") as string[];

//       return {
//         id: page.id,
//         title,
//         content,
//         slug: generatedSlug,
//         date,
//         tags,
//       };
//     }
//   }

//   return null;
// }
