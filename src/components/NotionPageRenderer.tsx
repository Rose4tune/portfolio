'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from "next/dynamic";
import { ExtendedRecordMap } from 'notion-types';
import { NotionRenderer } from 'react-notion-x';

import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

const Code = dynamic(() => 
  import('react-notion-x/build/third-party/code').then((mod) => mod.Code), 
  { ssr: false }
);

const Equation = dynamic(() => 
  import('react-notion-x/build/third-party/equation').then((mod) => mod.Equation), 
  { ssr: false }
);

const Modal = dynamic(() => 
  import('react-notion-x/build/third-party/modal').then((mod) => mod.Modal), 
  { ssr: false }
);

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
