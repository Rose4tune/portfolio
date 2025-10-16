"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { ImageProps } from "next/image";
import type { ExtendedRecordMap } from "notion-types";
import { NotionRenderer as ReactNotionRenderer } from "react-notion-x";
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
}: {
  recordMap: ExtendedRecordMap;
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
          nextImage: UnoptimizedImage,
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
