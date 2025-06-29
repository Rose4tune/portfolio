"use client";

import dynamic from "next/dynamic";
import { NotionRenderer } from "react-notion-x";
import type { ExtendedRecordMap } from "notion-types";
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

interface NotionRandererProps {
  recordMap: ExtendedRecordMap;
}

export default function NotionPageClient({ recordMap }: NotionRandererProps) {
  const Code = dynamic(
    () => import("react-notion-x/build/third-party/code").then((m) => m.Code),
    {
      ssr: false,
    }
  );
  const Collection = () => null;
  const Equation = dynamic(
    () =>
      import("react-notion-x/build/third-party/equation").then(
        (m) => m.Equation
      ),
    {
      ssr: false,
    }
  );
  const Modal = dynamic(
    () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
    {
      ssr: false,
    }
  );

  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={false}
      components={{
        Code,
        Collection,
        Equation,
        Modal,
      }}
    />
  );
}
