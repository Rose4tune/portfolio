import { getPosts, getUniqueTags, PostType } from "@/lib/notion/notionhqClient";
import BlogPageClient from "./BlogPageClient";

export default async function BlogPage() {
  const posts = await getPosts(PostType.blog);
  const uniqueTags = await getUniqueTags(PostType.blog);

  return <BlogPageClient posts={posts} uniqueTags={uniqueTags} />;
}
