import { Metadata } from "next";
import HomePage from "@/components/HomePage";

export const metadata: Metadata = {
  title: "Fortune's Cookie",
  description: "Front-developer YeSeo, LEE portfolio and blog",
};

export default function Home() {
  return <HomePage />;
}
