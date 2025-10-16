"use client";

import type { ExtendedRecordMap } from "notion-types";
import { NotionRenderer, PostLayout } from "@/shared/ui";

interface BlogPostScreenProps {
  recordMap: ExtendedRecordMap;
}

const linkText = "블로그 목록으로";
const href = "/blog";

export default function BlogPostScreen({ recordMap }: BlogPostScreenProps) {
  return (
    <PostLayout linkText={linkText} href={href}>
      <NotionRenderer recordMap={recordMap} />
    </PostLayout>
  );
}
