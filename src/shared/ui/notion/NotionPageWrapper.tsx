"use client";

import React, { useState, useEffect } from "react";
import type { ExtendedRecordMap } from "notion-types";
import NotionRenderer from "./NotionRenderer";

interface NotionPageWrapperProps {
  pageId: string;
  initialRecordMap: ExtendedRecordMap;
}

export default function NotionPageWrapper({
  pageId,
  initialRecordMap,
}: NotionPageWrapperProps) {
  const [recordMap, setRecordMap] =
    useState<ExtendedRecordMap>(initialRecordMap);

  useEffect(() => {
    setRecordMap(initialRecordMap);
  }, [initialRecordMap, pageId]);

  return <NotionRenderer recordMap={recordMap} />;
}
