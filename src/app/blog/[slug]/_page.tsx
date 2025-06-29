// import { notFound } from "next/navigation";
// import { getBlogPost } from "@/lib/notion";
// import { getNotionPage } from "@/lib/notion-x";
// import Link from "next/link";
// import NotionPageClient from "@/components/NotionPageClient";

// interface fetchEachPagesProps {
//   params: {
//     pageId: string;
//     slug: string;
//   };
// }

// export default async function PostPage({
//   params: { slug },
// }: fetchEachPagesProps) {
//   const post = await getBlogPost(slug);
//   if (!post || !post.pageId) {
//     notFound();
//   }
//   const recordMap = await getNotionPage(post.pageId);

//   return (
//     <article className="container mx-auto px-4 py-8 max-w-3xl">
//       <Link
//         href="/blog"
//         className="inline-block mb-8 text-purple-400 hover:underline"
//       >
//         ← 블로그 목록으로
//       </Link>
//       <header className="mb-8">
//         <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
//         <time className="text-gray-500">
//           {new Date(post.date).toLocaleDateString("ko-KR", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           })}
//         </time>
//       </header>
//       <div className="article">
//         <NotionPageClient recordMap={recordMap} />
//       </div>
//     </article>
//   );
// }
