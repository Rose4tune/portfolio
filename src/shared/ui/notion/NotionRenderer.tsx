"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { ImageProps } from "next/image";
import type { ExtendedRecordMap, Block } from "notion-types";
import { NotionRenderer as ReactNotionRenderer } from "react-notion-x";
import { defaultMapImageUrl } from "notion-utils";
import Loading from "@/app/loading";

import "react-notion-x/src/styles.css";
import "prismjs/themes/prism.css";
import "katex/dist/katex.min.css";

import "@/styles/notion.style.css";

const Code = dynamic(
  () => import("react-notion-x/build/third-party/code").then((m) => m.Code),
  { ssr: false }
);

const Equation = dynamic(
  () =>
    import("react-notion-x/build/third-party/equation").then((m) => m.Equation),
  { ssr: false }
);

const Collection = dynamic(
  () =>
    import("react-notion-x/build/third-party/collection").then(
      (m) => m.Collection
    ),
  { ssr: false }
);

const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  { ssr: false }
);

const UnoptimizedImage = (props: ImageProps) => {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...props} unoptimized />;
};

export default function NotionRenderer({
  recordMap,
  onImageError,
}: {
  recordMap: ExtendedRecordMap;
  onImageError?: () => void;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <ReactNotionRenderer
        recordMap={recordMap}
        fullPage={true}
        components={{
          nextImage: (props: ImageProps) => (
            <UnoptimizedImage {...props} onError={onImageError} />
          ),
          Code,
          Collection,
          Equation,
          Modal,
        }}
        mapImageUrl={(url, block) => {
          if (!url) return "";

          // 1. defaultMapImageUrl로 URL 변환 (attachment: -> notion.so URL)
          const resolvedUrl = defaultMapImageUrl(url, block as Block) || url;

          // 2. URL에서 block ID 추출하여 signed URL 찾기
          try {
            const urlObj = new URL(resolvedUrl, "https://www.notion.so");
            const blockId = urlObj.searchParams.get("id");

            // block ID로 signed_urls에서 실제 S3 URL 찾기 (홈 화면과 동일한 방식)
            if (blockId && recordMap.signed_urls?.[blockId]) {
              const signedUrl = recordMap.signed_urls[blockId];
              // S3 URL이면 직접 사용 (홈 화면과 동일)
              if (signedUrl.includes("amazonaws.com")) {
                return signedUrl;
              }
            }
          } catch {
            // URL 파싱 실패 시 무시
          }

          // 3. S3 URL이면 직접 반환, 그 외는 변환된 URL 반환
          if (resolvedUrl.includes("amazonaws.com")) {
            return resolvedUrl;
          }

          return resolvedUrl;
        }}
        darkMode={false}
        disableHeader
      />
    </Suspense>
  );
}
