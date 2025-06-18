import { getBlogPosts, getUniqueTags } from "@/lib/notion";
import BlogPageClient from "./BlogPageClient";
import { Suspense } from "react";

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const uniqueTags = await getUniqueTags();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogPageClient posts={posts} uniqueTags={uniqueTags} />
    </Suspense>
  );
}
