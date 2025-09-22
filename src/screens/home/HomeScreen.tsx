"use client";

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
    <div className="space-y-8">
      <ProfileSection>
        <RandomKeywordCloud
          keywords={uniqueTags}
          renderKeyword={renderKeyword}
          key={pathname}
        />
      </ProfileSection>
      {/* <SkillSection /> */}
    </div>
  );
}
