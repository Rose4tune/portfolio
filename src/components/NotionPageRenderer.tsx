'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { ExtendedRecordMap } from 'notion-types';
import { NotionRenderer } from 'react-notion-x';

import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

// 간소화된 구현으로 대체
const Code = () => null;
const Equation = () => null;
const Modal = () => null;
const Collection = () => null;

interface NotionRendererProps {
  recordMap: ExtendedRecordMap;
}

export default function NotionPageRenderer({ recordMap }: NotionRendererProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>콘텐츠를 준비하는 중...</div>;
  }

  return (
    <Suspense fallback={<div>콘텐츠를 불러오는 중...</div>}>
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
    </Suspense>
  );
}
