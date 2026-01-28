import { NextRequest, NextResponse } from "next/server";
import { getRecordMap } from "@/domain/notion";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("pageId");

  if (!pageId) {
    return NextResponse.json({ error: "pageId is required" }, { status: 400 });
  }

  try {
    const recordMap = await getRecordMap(pageId);

    return NextResponse.json(recordMap, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Failed to fetch recordMap:", error);
    return NextResponse.json(
      { error: "Failed to fetch recordMap" },
      { status: 500 }
    );
  }
}
