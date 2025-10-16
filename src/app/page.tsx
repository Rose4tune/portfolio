import { Metadata } from "next";
import HomeScreen from "@/screens/home/HomeScreen";
import { getPosts, getUniqueTags, PostType } from "@/domain/posts";

export const metadata: Metadata = {
  title: "Ye Seo, LEE",
  description: "Front-developer YeSeo, LEE portfolio and blog",
};

export const revalidate = 3600;

export default async function Home() {
  const [blogTags, projects] = await Promise.all([
    getUniqueTags(PostType.blog),
    getPosts(PostType.project),
  ]);

  const latestProjects = projects.slice(0, 3);

  return <HomeScreen initialTags={blogTags} initialProjects={latestProjects} />;
}
