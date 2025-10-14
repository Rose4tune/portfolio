import { NextResponse } from "next/server";
import { getUniqueTags } from "@/shared/lib/api/notion";
import { PostType } from "@/shared/types/notion";

export async function GET() {
  try {
    const tags = await getUniqueTags(PostType.blog);
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
