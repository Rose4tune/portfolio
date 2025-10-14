import { Metadata } from "next";
import HomeScreen from "@/screens/home/HomeScreen";
<<<<<<< HEAD
<<<<<<< HEAD
import { getPosts, getUniqueTags } from "@/shared/lib/api/notion";
import { PostType } from "@/shared/types/notion";
=======
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
=======
import { getPosts, getUniqueTags } from "@/shared/lib/api/notion";
import { PostType } from "@/shared/types/notion";
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))

export const metadata: Metadata = {
  title: "Ye Seo, LEE",
  description: "Front-developer YeSeo, LEE portfolio and blog",
};

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))
export default async function Home() {
  const [blogTags, projects] = await Promise.all([
    getUniqueTags(PostType.blog),
    getPosts(PostType.project),
  ]);

  const latestProjects = projects.slice(0, 3);

  return <HomeScreen initialTags={blogTags} initialProjects={latestProjects} />;
<<<<<<< HEAD
=======
export default function Home() {
  return <HomeScreen />;
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
=======
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))
}
