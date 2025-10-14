"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  RandomKeywordCloud,
  StickerLink,
  ProfileSection,
  ProjectSection,
} from "./ui";
import { useFetch } from "@/shared/lib/hooks";
import { ProjectPost } from "@/shared/types/notion";

export default function HomeScreen() {
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const pathname = usePathname();
  const { data: tags } = useFetch<string[]>("/api/tags", []);
  const { data: projects } = useFetch<ProjectPost[]>(
    "/api/projects/latest",
    []
  );

  useEffect(() => {
    setUniqueTags(tags);
  }, [setUniqueTags, tags]);

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
          keywords={uniqueTags}
          renderKeyword={renderKeyword}
          key={pathname}
        />
      </ProfileSection>
      <ProjectSection projects={projects} />
    </div>
  );
}
