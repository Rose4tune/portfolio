"use client";

import type { ExtendedRecordMap } from "notion-types";
import { NotionPageWrapper, PostLayout } from "@/shared/ui";

interface ProjectPostScreenProps {
  pageId: string;
  recordMap: ExtendedRecordMap;
}

const linkText = "프로젝트 목록으로";
const href = "/projects";

export default function ProjectPostScreen({
  pageId,
  recordMap,
}: ProjectPostScreenProps) {
  return (
    <PostLayout className="project" linkText={linkText} href={href}>
      <NotionPageWrapper pageId={pageId} initialRecordMap={recordMap} />
    </PostLayout>
  );
}
