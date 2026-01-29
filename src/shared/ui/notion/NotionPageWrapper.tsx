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
  const hasRefreshed = useRef(false);
  const currentPageIdRef = useRef(pageId);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    currentPageIdRef.current = pageId;
    setRecordMap(initialRecordMap);
    lastFetchTime.current = Date.now();
    hasRefreshed.current = false;
    abortControllerRef.current?.abort();
  }, [initialRecordMap, pageId]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const refreshRecordMap = useCallback(async () => {
    const now = Date.now();
    // 스로틀 체크: 첫 갱신 이후 15초 이내면 무시
    if (hasRefreshed.current && now - lastFetchTime.current < THROTTLE_TIME) {
      return;
    }

    const requestPageId = pageId;
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch(
        `/api/notion-recordmap?pageId=${requestPageId}`,
        {
          signal: controller.signal,
        }
      );
      if (!res.ok) {
        return;
      }

      const newRecordMap = await res.json();
      if (currentPageIdRef.current !== requestPageId) {
        return;
      }

      setRecordMap(newRecordMap);
      lastFetchTime.current = Date.now();
      hasRefreshed.current = true;
      // 디버깅: console.log("[NotionPageWrapper] recordMap 갱신 완료");
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }
      console.error("[NotionPageWrapper] 갱신 실패:", error);
    }
  }, [pageId]);

  // 55분 주기 자동 갱신 (페이지를 오래 켜둘 때)
  useEffect(() => {
    const interval = setInterval(() => {
      // 디버깅: console.log("[NotionPageWrapper] 55분 경과 → 갱신");
      refreshRecordMap();
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refreshRecordMap]);

  // 탭이 다시 활성화될 때 갱신 (다른 탭에서 돌아올 때)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const now = Date.now();
        const timeSinceLastFetch = now - lastFetchTime.current;

        // 5분 이상 지났으면 갱신 (너무 자주 갱신 방지)
        if (timeSinceLastFetch > 5 * 60 * 1000) {
          // 디버깅: console.log("[NotionPageWrapper] 탭 활성화 → 갱신");
          refreshRecordMap();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [refreshRecordMap]);

  // 초기 로드 시 signed URL 유효성 체크
  useEffect(() => {
    const signedUrlCount = Object.keys(recordMap.signed_urls || {}).length;
    // 디버깅: console.log("[NotionPageWrapper] 초기 signed_urls:", signedUrlCount);

    if (signedUrlCount === 0) {
      refreshRecordMap();
      return;
    }

    const sampleUrl = Object.values(recordMap.signed_urls || {})[0];
    if (typeof sampleUrl === "string" && sampleUrl.includes("X-Amz-Date=")) {
      try {
        const urlObj = new URL(sampleUrl);
        const amzDate = urlObj.searchParams.get("X-Amz-Date");
        if (amzDate) {
          const year = parseInt(amzDate.substring(0, 4));
          const month = parseInt(amzDate.substring(4, 6)) - 1;
          const day = parseInt(amzDate.substring(6, 8));
          const hour = parseInt(amzDate.substring(9, 11));
          const minute = parseInt(amzDate.substring(11, 13));
          const second = parseInt(amzDate.substring(13, 15));

          const urlCreatedAt = new Date(
            Date.UTC(year, month, day, hour, minute, second)
          );
          const urlAge = Date.now() - urlCreatedAt.getTime();
          const urlAgeMinutes = Math.floor(urlAge / 1000 / 60);

          // 30분 이상 된 URL이면 즉시 갱신
          if (urlAgeMinutes >= 30) {
            console.warn(
              "[NotionPageWrapper] URL 오래됨 (",
              urlAgeMinutes,
              "분) → 갱신"
            );
            refreshRecordMap();
          }
        }
      } catch {
        // URL 나이 파싱 실패 시 무시
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  return (
    <NotionRenderer recordMap={recordMap} onImageError={refreshRecordMap} />
  );
}
