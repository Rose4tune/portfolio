"use client";

import { usePathname } from "next/navigation";
import {
  RandomKeywordCloud,
  StickerLink,
  ProfileSection,
  ProjectSection,
} from "./ui";
import { ProjectPost } from "@/domain/posts";

interface HomeScreenProps {
  initialTags: string[];
  initialProjects: ProjectPost[];
}

export default function HomeScreen({
  initialTags,
  initialProjects,
}: HomeScreenProps) {
  const pathname = usePathname();

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
    <div className="space-y-25">
      <ProfileSection>
        <RandomKeywordCloud
          keywords={initialTags}
          renderKeyword={renderKeyword}
          key={pathname}
        />
      </ProfileSection>
      <ProjectSection projects={initialProjects} />
    </div>
  );
}
