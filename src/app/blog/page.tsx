import { getBlogPosts, getUniqueTags } from "@/lib/notion";
import BlogPageClient from "./BlogPageClient";

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const uniqueTags = await getUniqueTags();

  return <BlogPageClient posts={posts} uniqueTags={uniqueTags} />;
}
