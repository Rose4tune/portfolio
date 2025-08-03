'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { ExtendedRecordMap } from 'notion-types';
import NotionPageRenderer from "@/components/NotionPageRenderer";

interface BlogPostClientProps {
  pageId: string;
  serializedRecordMap: string;
}

export default function BlogPostClient({ pageId, serializedRecordMap }: BlogPostClientProps) {
  const [error, setError] = useState<Error | null>(null);
  const [recordMap, setRecordMap] = useState<ExtendedRecordMap | null>(null);

  useEffect(() => {
    try {
      if (serializedRecordMap) {
        const parsedRecordMap = JSON.parse(serializedRecordMap) as ExtendedRecordMap;
        setRecordMap(parsedRecordMap);
      }
    } catch (e) {
      console.error("Failed to parse recordMap:", e);
      setError(e as Error);
    }
  }, [serializedRecordMap]);

  if (error) {
    return (
      <article>
        <Link href="/blog" className="mb-8 inline-block">
          ← 블로그 목록으로
        </Link>
        <div className="mt-8 p-4 border border-red-200 rounded bg-red-50">
          <h1 className="text-xl font-bold text-red-600 mb-2">콘텐츠를 불러오는 중 오류가 발생했습니다</h1>
          <p>다시 시도해주세요. 문제가 계속되면 관리자에게 문의하세요.</p>
          <p className="text-sm text-gray-500 mt-2">페이지 ID: {pageId}</p>
        </div>
      </article>
    );
  }

  if (!recordMap) {
    return (
      <article>
        <Link href="/blog" className="mb-8 inline-block">
          ← 블로그 목록으로
        </Link>
        <div className="mt-4 py-8">콘텐츠를 불러오는 중...</div>
      </article>
    );
  }

  return (
    <article>
      <Link href="/blog" className="mb-8 inline-block">
        ← 블로그 목록으로
      </Link>
      <div className="mt-4">
        <NotionPageRenderer recordMap={recordMap} />
      </div>
    </article>
  );
}
