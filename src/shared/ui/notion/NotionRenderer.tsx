"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { NotionContentProps } from "@/shared/types/common";
import { NotionRenderer as ReactNotionRenderer } from "react-notion-x";

import "react-notion-x/src/styles.css";
import "prismjs/themes/prism.css";
import "katex/dist/katex.min.css";

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

export default function NotionRenderer({ recordMap }: NotionContentProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>콘텐츠를 준비하는 중...</div>;
  }

  return (
    <Suspense fallback={<div>콘텐츠를 불러오는 중...</div>}>
      <ReactNotionRenderer
        recordMap={recordMap}
        fullPage={true}
        components={{
          nextImage: Image,
          Code,
          Collection,
          Equation,
          Modal,
        }}
        darkMode={false}
        disableHeader
      />
    </Suspense>
  );
}
