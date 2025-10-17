import { getPosts, getUniqueTags, PostType } from "@/domain/posts";
import BlogScreen from "@/screens/blog/BlogScreen";

export default async function BlogPage() {
  const posts = await getPosts(PostType.blog);
  const uniqueTags = await getUniqueTags(PostType.blog);

  return <BlogScreen posts={posts} uniqueTags={uniqueTags} />;
}
