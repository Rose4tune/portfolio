import { getPosts, getUniqueTags, PostType } from "@/lib/notion/notionhqClient";
import BlogClient from "./BlogClient";

export default async function BlogPage() {
  const posts = await getPosts(PostType.blog);
  const uniqueTags = await getUniqueTags(PostType.blog);

  return <BlogClient posts={posts} uniqueTags={uniqueTags} />;
}
