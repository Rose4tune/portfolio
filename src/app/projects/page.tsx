import { getPosts, getUniqueTags, PostType } from "@/domain/posts";
import ProjectScreen from "@/screens/project/ProjectScreen";

export default async function ProjectsPage() {
  const posts = await getPosts(PostType.project);
  const uniqueTags = await getUniqueTags(PostType.project);

  return <ProjectScreen posts={posts} uniqueTags={uniqueTags} />;
}
