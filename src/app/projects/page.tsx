import { getPosts, getUniqueTags } from "@/shared/lib/api/notion";
import { PostType } from "@/shared/types/notion";
import ProjectScreen from "@/screens/project/ProjectScreen";

export default async function ProjectsPage() {
  const posts = await getPosts(PostType.project);
  const uniqueTags = await getUniqueTags(PostType.project);

  return <ProjectScreen posts={posts} uniqueTags={uniqueTags} />;
}
