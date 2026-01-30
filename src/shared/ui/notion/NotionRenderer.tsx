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

function UnoptimizedImage(props: ImageProps) {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...props} unoptimized />;
}

export default function NotionRenderer({
  recordMap,
}: {
  recordMap: ExtendedRecordMap;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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
          nextImage: (props: ImageProps) => <UnoptimizedImage {...props} />,
          Code,
          Collection,
          Equation,
          Modal,
        }}
        mapImageUrl={(url, block) => {
          if (!url) return "";

          // 플랜 A: 우리가 채운 signed_urls를 최우선 사용 (만료된 URL 사용 방지)
          const blockWithId = block as Block & { value?: { id?: string } };
          const rawId = blockWithId?.id ?? blockWithId?.value?.id;
          if (rawId) {
            const signed = recordMap.signed_urls?.[rawId];
            if (typeof signed === "string" && signed.includes("amazonaws.com"))
              return signed;
            const normalized = rawId.replace(/-/g, "");
            const signedNorm = recordMap.signed_urls?.[normalized];
            if (
              typeof signedNorm === "string" &&
              signedNorm.includes("amazonaws.com")
            )
              return signedNorm;
          }

          const resolvedUrl = defaultMapImageUrl(url, block as Block) || url;

          // notion.so/image/... 래퍼는 400 반환 → 내부 S3 URL 추출 (signed_urls에 없을 때만 보조)
          if (resolvedUrl.startsWith("https://www.notion.so/image/")) {
            try {
              const pathMatch = resolvedUrl.match(/^https:\/\/www\.notion\.so\/image\/([^?]+)/);
              if (pathMatch?.[1]) {
                let decoded = decodeURIComponent(pathMatch[1]);
                if (decoded.includes("%")) decoded = decodeURIComponent(decoded); // 이중 인코딩
                if (decoded.startsWith("http") && (decoded.includes("amazonaws.com") || decoded.includes("prod-files-secure"))) {
                  return decoded;
                }
              }
            } catch {
              // 디코딩 실패 시 아래 로직 계속
            }
          }

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

            const blockWithId = block as Block & { value?: { id?: string } };
            const blockIdForLookup = blockWithId?.id ?? blockWithId?.value?.id;
            if (blockIdForLookup && recordMap.signed_urls?.[blockIdForLookup]) {
              const signedUrl = recordMap.signed_urls[blockIdForLookup];
              if (signedUrl.includes("amazonaws.com")) return signedUrl;
            }
            if (blockIdForLookup) {
              const normalized = blockIdForLookup.replace(/-/g, "");
              if (recordMap.signed_urls?.[normalized]) {
                const signedUrl = recordMap.signed_urls[normalized];
                if (signedUrl.includes("amazonaws.com")) return signedUrl;
              }
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

          // notion.so/image/... 래퍼는 400을 반환할 수 있음 → 내부 S3 URL 추출해 직접 로드
          if (resolvedUrl.startsWith("https://www.notion.so/image/")) {
            try {
              const pathMatch = resolvedUrl.match(/^https:\/\/www\.notion\.so\/image\/([^?]+)/);
              if (pathMatch?.[1]) {
                const decoded = decodeURIComponent(pathMatch[1]);
                if (decoded.startsWith("http") && (decoded.includes("amazonaws.com") || decoded.includes("prod-files-secure"))) {
                  return decoded;
                }
              }
            } catch {
              // 디코딩 실패 시 아래 resolvedUrl 반환
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
