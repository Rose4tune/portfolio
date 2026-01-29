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
    // 디버깅: console.log("[NotionRenderer] signed_urls:", Object.keys(recordMap.signed_urls || {}).length);
  }, [recordMap]);

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

          const resolvedUrl = defaultMapImageUrl(url, block as Block) || url;

          if (resolvedUrl.includes("amazonaws.com") || resolvedUrl.includes("prod-files-secure")) {
            return resolvedUrl;
          }

          try {
            if (recordMap.signed_urls?.[resolvedUrl]) {
              const signedUrl = recordMap.signed_urls[resolvedUrl];
              if (signedUrl.includes("amazonaws.com")) return signedUrl;
            }

            const urlObj = new URL(resolvedUrl, "https://www.notion.so");
            const blockId = urlObj.searchParams.get("id");

            if (blockId) {
              if (recordMap.signed_urls?.[blockId]) {
                const signedUrl = recordMap.signed_urls[blockId];
                if (signedUrl.includes("amazonaws.com")) return signedUrl;
              }
              const normalizedId = blockId.replace(/-/g, "");
              if (recordMap.signed_urls?.[normalizedId]) {
                const signedUrl = recordMap.signed_urls[normalizedId];
                if (signedUrl.includes("amazonaws.com")) return signedUrl;
              }
            }

            const blockObj = block as any;
            if (blockObj?.id && recordMap.signed_urls?.[blockObj.id]) {
              const signedUrl = recordMap.signed_urls[blockObj.id];
              if (signedUrl.includes("amazonaws.com")) return signedUrl;
            }
          } catch {
            // URL 파싱 실패
          }

          if (resolvedUrl.includes("amazonaws.com")) return resolvedUrl;

          if (url.startsWith("attachment:")) {
            const attachmentMatch = url.match(/attachment:([a-f0-9-]+):/);
            if (attachmentMatch) {
              const attachmentId = attachmentMatch[1];
              for (const [, value] of Object.entries(recordMap.signed_urls || {})) {
                if (typeof value === "string" && value.includes(attachmentId)) return value;
              }
            }
          }

          if (resolvedUrl.includes("amazonaws.com") || resolvedUrl.includes("file.notion.so")) {
            return resolvedUrl;
          }

          if (recordMap.signed_urls) {
            for (const [key, value] of Object.entries(recordMap.signed_urls)) {
              if (
                typeof value === "string" &&
                (value.includes("amazonaws.com") || value.includes("file.notion.so")) &&
                (resolvedUrl.includes(key) || key.includes(resolvedUrl))
              ) {
                return value;
              }
            }
          }

          console.warn(
            "[mapImageUrl] 매칭 실패:",
            url?.substring(0, 60),
            "signed_urls 키:",
            Object.keys(recordMap.signed_urls || {}).slice(0, 3)
          );
          return resolvedUrl;
        }}
        darkMode={false}
        disableHeader
      />
    </Suspense>
  );
}
