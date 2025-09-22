import { Metadata } from "next";
import HomeScreen from "@/screens/home/HomeScreen";
<<<<<<< HEAD
import { getPosts, getUniqueTags } from "@/shared/lib/api/notion";
import { PostType } from "@/shared/types/notion";
=======
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))

export const metadata: Metadata = {
  title: "Ye Seo, LEE",
  description: "Front-developer YeSeo, LEE portfolio and blog",
};

<<<<<<< HEAD
export default async function Home() {
  const [blogTags, projects] = await Promise.all([
    getUniqueTags(PostType.blog),
    getPosts(PostType.project),
  ]);

  const latestProjects = projects.slice(0, 3);

  return <HomeScreen initialTags={blogTags} initialProjects={latestProjects} />;
=======
export default function Home() {
  return <HomeScreen />;
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
}
