"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import type { ExtendedRecordMap } from "notion-types";
import NotionRenderer from "./NotionRenderer";

interface NotionPageWrapperProps {
  pageId: string;
  initialRecordMap: ExtendedRecordMap;
}

const REFRESH_INTERVAL = 55 * 60 * 1000; // 55분
const THROTTLE_TIME = 15 * 1000; // 15초 스로틀

export default function NotionPageWrapper({
  pageId,
  initialRecordMap,
}: NotionPageWrapperProps) {
  const [recordMap, setRecordMap] =
    useState<ExtendedRecordMap>(initialRecordMap);
  const lastFetchTime = useRef<number>(Date.now());

  const refreshRecordMap = useCallback(async () => {
    const now = Date.now();
    // 스로틀 체크: 마지막 요청으로부터 15초 이내면 무시 (최초 요청 제외)
    if (
      now - lastFetchTime.current < THROTTLE_TIME &&
      recordMap !== initialRecordMap
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/notion-recordmap?pageId=${pageId}`);
      if (res.ok) {
        const newRecordMap = await res.json();
        setRecordMap(newRecordMap);
        lastFetchTime.current = Date.now();
        console.log("Notion recordMap refreshed");
      }
    } catch (error) {
      console.error("Error refreshing Notion recordMap:", error);
    }
  }, [pageId, initialRecordMap, recordMap]);

  // 55분 주기 자동 갱신
  useEffect(() => {
    const interval = setInterval(refreshRecordMap, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refreshRecordMap]);

  return (
    <NotionRenderer recordMap={recordMap} onImageError={refreshRecordMap} />
  );
}
