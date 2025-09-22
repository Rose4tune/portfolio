"use client";

<<<<<<< HEAD
import { NotionRenderer, PostLayout } from "@/shared/ui";
import { useNotionRecord } from "@/shared/lib/hooks";
import Loading from "@/app/loading";
=======
import { useState, useEffect } from "react";
import Link from "next/link";
import { ExtendedRecordMap } from "notion-types";
import NotionRenderer from "@/shared/notionRenderer/NotionRenderer";
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))

interface BlogPostScreenProps {
  pageId: string;
  serializedRecordMap: string;
}
<<<<<<< HEAD
const linkText = "블로그 목록으로";
const href = "/blog";
=======
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))

export default function BlogPostScreen({
  pageId,
  serializedRecordMap,
}: BlogPostScreenProps) {
<<<<<<< HEAD
  const { recordMap, loading, error, setLoading, setError } =
    useNotionRecord(serializedRecordMap);
=======
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [recordMap, setRecordMap] = useState<ExtendedRecordMap | null>(null);

  useEffect(() => {
    try {
      if (serializedRecordMap) {
        const parsedRecordMap = JSON.parse(
          serializedRecordMap
        ) as ExtendedRecordMap;
        setRecordMap(parsedRecordMap);
      } else {
        setError(new Error("서버에서 데이터를 가져오지 못했습니다."));
      }
    } catch (e) {
      console.error("Failed to parse recordMap:", e);
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [serializedRecordMap]);
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  if (error) {
    return (
<<<<<<< HEAD
      <PostLayout linkText={linkText} href={href}>
=======
      <article>
        <Link href="/blog" className="mb-8 inline-block">
          ← 블로그 목록으로
        </Link>
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
        <div className="mt-8 p-4 border border-red-200 rounded bg-red-50">
          <h1 className="text-xl font-bold text-red-600 mb-2">
            콘텐츠를 불러오는 중 오류가 발생했습니다
          </h1>
          <p className="mb-4">
            다시 시도해주세요. 문제가 계속되면 관리자에게 문의하세요.
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            다시 시도
          </button>
          <div className="mt-4 p-2 bg-gray-100 rounded text-sm text-gray-700 overflow-auto">
            <p>오류 메시지: {error.message}</p>
            <p className="text-sm text-gray-500 mt-2">페이지 ID: {pageId}</p>
          </div>
        </div>
<<<<<<< HEAD
      </PostLayout>
=======
      </article>
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
    );
  }

  if (loading || !recordMap) {
<<<<<<< HEAD
    return <Loading />;
  }

  return (
    <PostLayout linkText={linkText} href={href}>
      <NotionRenderer recordMap={recordMap} />
    </PostLayout>
=======
    return (
      <article>
        <Link href="/blog" className="mb-8 inline-block">
          ← 블로그 목록으로
        </Link>
        <div className="mt-4 py-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>콘텐츠를 불러오는 중...</p>
        </div>
      </article>
    );
  }

  return (
    <article>
      <Link href="/blog" className="mb-8 inline-block">
        ← 블로그 목록으로
      </Link>
      <div className="mt-4">
        <NotionRenderer recordMap={recordMap} />
      </div>
    </article>
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
  );
}
