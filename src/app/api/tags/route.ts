import { NextResponse } from "next/server";
import { getUniqueTags, PostType } from "@/lib/notion/notionhqClient";

export async function GET() {
  try {
    const tags = await getUniqueTags(PostType.blog);
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}
