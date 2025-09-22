import { Metadata } from "next";
import HomeScreen from "@/screens/home/HomeScreen";

export const metadata: Metadata = {
  title: "Ye Seo, LEE",
  description: "Front-developer YeSeo, LEE portfolio and blog",
};

export default function Home() {
  return <HomeScreen />;
}
