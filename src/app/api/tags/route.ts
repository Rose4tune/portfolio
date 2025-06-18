import { getUniqueTags } from "@/lib/notion";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tags = await getUniqueTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags from Notion" },
      { status: 500 }
    );
  }
}
