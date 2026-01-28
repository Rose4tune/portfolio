"use client";

import type { ExtendedRecordMap } from "notion-types";
import { NotionPageWrapper, PostLayout } from "@/shared/ui";

interface BlogPostScreenProps {
  pageId: string;
  recordMap: ExtendedRecordMap;
}

const linkText = "블로그 목록으로";
const href = "/blog";

export default function BlogPostScreen({
  pageId,
  recordMap,
}: BlogPostScreenProps) {
  return (
    <PostLayout linkText={linkText} href={href}>
      <NotionPageWrapper pageId={pageId} initialRecordMap={recordMap} />
    </PostLayout>
  );
}
