import { NextResponse } from "next/server";
import { getPosts } from "@/shared/lib/api/notion";
import { PostType } from "@/shared/types/notion";

export async function GET() {
  try {
    const posts = await getPosts(PostType.project);
    const latestProjects = posts.slice(0, 3);

    return NextResponse.json(latestProjects);
  } catch (error) {
    console.error("Failed to fetch latest projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest projects" },
      { status: 500 }
    );
  }
}
