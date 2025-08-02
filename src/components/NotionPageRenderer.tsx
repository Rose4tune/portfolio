'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from "next/dynamic";
import { ExtendedRecordMap } from 'notion-types';
import { NotionRenderer } from 'react-notion-x';

import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

interface NotionRendererProps {
  recordMap: ExtendedRecordMap;
}

export default function NotionPageRenderer({ recordMap }: NotionRendererProps) {
  const [error, setError] = useState<Error | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      if (recordMap) {
        setIsLoaded(true);
      }
    } catch (e) {
      setError(e as Error);
      console.error("Error loading Notion content:", e);
    }
  }, [recordMap]);

  if (error) {
    return (
      <div className="error-container">
        <h3>콘텐츠를 불러오는데 문제가 발생했습니다</h3>
        <p>다시 시도해주세요.</p>
      </div>
    );
  }

  if (!isLoaded || !recordMap) {
    return <div>콘텐츠를 불러오는 중...</div>;
  }

  // 동적으로 컴포넌트 로드
  const Code = dynamic(
    () => import("react-notion-x/build/third-party/code").then((m) => m.Code),
    { ssr: false }
  );
  
  const Collection = () => null;
  
  const Equation = dynamic(
    () => import("react-notion-x/build/third-party/equation").then((m) => m.Equation),
    { ssr: false }
  );

  const Modal = dynamic(
    () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
    { ssr: false }
  );

  return (
    <NotionRenderer
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
  );
}
