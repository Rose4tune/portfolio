import { notFound } from "next/navigation";
import { getPageIdBySlug, PostType } from "@/lib/notion/notionhqClient";
import { getRecordMap } from "@/lib/notion/notionClient";
import Link from "next/link";
import dynamic from 'next/dynamic';

// 클라이언트 컴포넌트를 동적으로 로드
const NotionPageRenderer = dynamic(() => import("@/components/NotionPageRenderer"), {
  ssr: true,
  loading: () => <div>로딩 중...</div>
});

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { params } = props;
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const pageId = await getPageIdBySlug(PostType.blog, slug);

  if (!pageId) {
    return notFound();
  }
  
  try {
    const recordMap = await getRecordMap(pageId);

    return (
      <article>
        <Link href="/blog" className="mb-8">
          ← 블로그 목록으로
        </Link>
        <NotionPageRenderer recordMap={recordMap} />
      </article>
    );
  } catch (error) {
    console.error("Failed to render blog post:", error);
    return (
      <article>
        <Link href="/blog" className="mb-8">
          ← 블로그 목록으로
        </Link>
        <div>
          <h1>콘텐츠를 불러오는 중 오류가 발생했습니다</h1>
          <p>다시 시도해주세요.</p>
        </div>
      </article>
    );
  }
}
