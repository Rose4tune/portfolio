<<<<<<< HEAD
<<<<<<< HEAD
import { getPosts, getUniqueTags } from "@/shared/lib/api/notion";
import { PostType } from "@/shared/types/notion";
=======
import { getPosts, getUniqueTags, PostType } from "@/lib/notion/notionhqClient";
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
=======
import { getPosts, getUniqueTags } from "@/shared/lib/api/notion";
import { PostType } from "@/shared/types/notion";
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))
import BlogScreen from "@/screens/blog/BlogScreen";

export default async function BlogPage() {
  const posts = await getPosts(PostType.blog);
  const uniqueTags = await getUniqueTags(PostType.blog);

  return <BlogScreen posts={posts} uniqueTags={uniqueTags} />;
}
