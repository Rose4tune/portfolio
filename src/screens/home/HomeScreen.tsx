"use client";

<<<<<<< HEAD
import { usePathname } from "next/navigation";
import {
  RandomKeywordCloud,
  StickerLink,
  ProfileSection,
  ProjectSection,
} from "./ui";
import { ProjectPost } from "@/shared/types/notion";

interface HomeScreenProps {
  initialTags: string[];
  initialProjects: ProjectPost[];
}

export default function HomeScreen({
  initialTags,
  initialProjects,
}: HomeScreenProps) {
  const pathname = usePathname();

=======
import { useState, useEffect } from "react";
import {
  ProfileSection,
  // SkillSection,
} from "./section";
import { RandomKeywordCloud, StickerLink } from "./ui";
import { usePathname } from "next/navigation";

export default function HomeScreen() {
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        if (!response.ok) throw new Error("Failed to fetch tags");
        const tags = await response.json();
        setUniqueTags(tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
  const renderKeyword = (word: string, size: string) => (
    <StickerLink
      key={`${word}-${size}`}
      href={`/blog?tag=${encodeURIComponent(word)}`}
      className={size}
    >
      {word}
    </StickerLink>
  );

  return (
<<<<<<< HEAD
    <div className="space-y-25">
      <ProfileSection>
        <RandomKeywordCloud
          keywords={initialTags}
=======
    <div className="space-y-8">
      <ProfileSection>
        <RandomKeywordCloud
          keywords={uniqueTags}
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
          renderKeyword={renderKeyword}
          key={pathname}
        />
      </ProfileSection>
<<<<<<< HEAD
      <ProjectSection projects={initialProjects} />
=======
      {/* <SkillSection /> */}
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
    </div>
  );
}
