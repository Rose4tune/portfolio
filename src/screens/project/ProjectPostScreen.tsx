"use client";

import type { ExtendedRecordMap } from "notion-types";
import { NotionRenderer, PostLayout } from "@/shared/ui";

interface ProjectPostScreenProps {
  recordMap: ExtendedRecordMap;
}

const linkText = "프로젝트 목록으로";
const href = "/projects";

export default function ProjectPostScreen({
  recordMap,
}: ProjectPostScreenProps) {
  return (
    <PostLayout className="project" linkText={linkText} href={href}>
      <NotionRenderer recordMap={recordMap} />
    </PostLayout>
  );
}
