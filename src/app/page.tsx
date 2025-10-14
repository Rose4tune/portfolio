import { Metadata } from "next";
import HomeScreen from "@/screens/home/HomeScreen";
import { getPosts, getUniqueTags } from "@/shared/lib/api/notion";
import { PostType } from "@/shared/types/notion";

export const metadata: Metadata = {
  title: "Ye Seo, LEE",
  description: "Front-developer YeSeo, LEE portfolio and blog",
};

export default async function Home() {
  const [blogTags, projects] = await Promise.all([
    getUniqueTags(PostType.blog),
    getPosts(PostType.project),
  ]);

  const latestProjects = projects.slice(0, 3);

  return <HomeScreen initialTags={blogTags} initialProjects={latestProjects} />;
}
