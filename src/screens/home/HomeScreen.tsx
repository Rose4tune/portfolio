"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { RandomKeywordCloud, StickerLink, ProfileSection } from "./ui";
import { useFetch } from "@/shared/lib/hooks";

export default function HomeScreen() {
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const pathname = usePathname();
  const { data: tags } = useFetch<string[]>("/api/tags", []);

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
    <div className="space-y-15">
      <ProfileSection>
        <RandomKeywordCloud
          keywords={uniqueTags}
          renderKeyword={renderKeyword}
          key={pathname}
        />
      </ProfileSection>
      {/* <Section
        title="Skill"
        contents={[
          { text: "JavaScript, TypeScript, HTML, CSS" },
          {
            text: "React, Next.js, Three.js, Tanstack, Shadcn, Styled-Component",
          },
        ]}
      />
      <Section
        title="Career"
        contents={[
          {
            boldText: "엔젠바이오 데이터모델링팀 웹 프론트엔드 개발자",
            date: "2021.12 ~ 2024.03",
          },
          {
            boldText: "프렌츠 서비스개발팀 웹 프론트엔드 개발자",
            date: "2020.05 ~ 2021.05",
          },
        ]}
      />
      <Section
        title="Side Project"
        contents={[
          {
            boldText: "클IE밍",
            date: "2025.09 ~ ",
            description:
              "클라이밍 볼더링 파티를 위한 게임 진행 웹 프론트엔드 개발",
            link: "https://clime.app",
          },
          {
            boldText: "To Tasty!",
            date: "2025.06 ~ 2025.08",
            description: "시음회 모임 웹 프론트엔드 개발",
            link: "https://totasty.co.kr",
          },
        ]}
      />
      <Section
        title="Education"
        contents={[
          {
            boldText: "코드잇 단기 심화 프론트엔드 과정 수료",
            date: "2025.06 ~ 2025.08",
          },
          {
            boldText: "항해 프론트엔드 ",
            date: "2025.06 ~ 2025.08",
          },
        ]}
      /> */}
    </div>
  );
}
