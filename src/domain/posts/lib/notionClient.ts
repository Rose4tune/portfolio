import { Client } from "@notionhq/client";

const NOTION_API_KEY = process.env.NOTION_API_KEY;

export const NOTION_DB = {
  blog: process.env.NOTION_DB_ID_BLOG as string,
  project: process.env.NOTION_DB_ID_PROJECT as string,
  book: process.env.NOTION_DB_ID_BOOK as string,
};

export const notionHQClient = new Client({
  auth: NOTION_API_KEY,
});
