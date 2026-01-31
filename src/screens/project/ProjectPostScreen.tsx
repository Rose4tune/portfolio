"use client";

import { useState } from "react";
import type { ExtendedRecordMap } from "notion-types";
import { getBlockTitle } from "notion-utils";
import { NotionPageWrapper, PostLayout } from "@/shared/ui";
import { getCoverSrc, COVER_FALLBACK } from "@/shared/lib/utils";

interface ProjectPostScreenProps {
  pageId: string;
  recordMap: ExtendedRecordMap;
}

const linkText = "프로젝트 목록으로";
const href = "/projects";

function getPageTitle(recordMap: ExtendedRecordMap, pageId: string): string {
  const blockRecord = recordMap.block?.[pageId];
  const block = blockRecord?.value;
  if (!block) return "";
  return getBlockTitle(block, recordMap) || "";
}

export default function ProjectPostScreen({
  pageId,
  recordMap,
}: ProjectPostScreenProps) {
  const title = getPageTitle(recordMap, pageId);
  const [imgError, setImgError] = useState(false);
  const coverSrc =
    !title || imgError ? COVER_FALLBACK : getCoverSrc(title);

  return (
    <PostLayout className="project" linkText={linkText} href={href}>
      <div className="w-full rounded-t-xl overflow-hidden mb-0 -mt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverSrc}
          alt={title || "프로젝트 커버"}
          className="w-full h-auto block"
          onError={() => setImgError(true)}
        />
      </div>
      <NotionPageWrapper pageId={pageId} initialRecordMap={recordMap} />
    </PostLayout>
  );
}
