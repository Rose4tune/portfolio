import { Metadata } from "next";
import HomePage from "@/components/HomePage";

export const metadata: Metadata = {
  title: "Ye Seo, LEE",
  description: "Front-developer YeSeo, LEE portfolio and blog",
};

export default function Home() {
  return <HomePage />;
}
