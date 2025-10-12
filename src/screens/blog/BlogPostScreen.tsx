"use client";

import { NotionRenderer, PostLayout } from "@/shared/ui";
import { useNotionRecord } from "@/shared/lib/hooks";
import Loading from "@/app/loading";

interface BlogPostScreenProps {
  pageId: string;
  serializedRecordMap: string;
}
const linkText = "블로그 목록으로";
const href = "/blog";

export default function BlogPostScreen({
  pageId,
  serializedRecordMap,
}: BlogPostScreenProps) {
  const { recordMap, loading, error, setLoading, setError } =
    useNotionRecord(serializedRecordMap);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  if (error) {
    return (
      <PostLayout linkText={linkText} href={href}>
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
      </PostLayout>
    );
  }

  if (loading || !recordMap) {
    return <Loading />;
  }

  return (
    <PostLayout linkText={linkText} href={href}>
      <NotionRenderer recordMap={recordMap} />
    </PostLayout>
  );
}
