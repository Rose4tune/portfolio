"use client";

import { useState, useEffect } from "react";
import { StickerLink } from "./StickerLink";
import { allKeywords } from "./keywords";
import { RefreshCw } from "lucide-react";
import { usePathname } from "next/navigation";

const getRandomFontSize = () => {
  const sizes = ["text-xl", "text-2xl", "text-3xl", "text-4xl"];
  return sizes[Math.floor(Math.random() * sizes.length)];
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function generateKeywords() {
  return shuffleArray(allKeywords)
    .slice(0, 10)
    .map((word) => ({
      word,
      size: getRandomFontSize(),
    }));
}

export function RandomKeywordCloud() {
  const pathname = usePathname();

  const [keywords, setKeywords] = useState<
    Array<{ word: string; size: string }>
  >([]);

  const handleShuffle = () => {
    setKeywords(generateKeywords());
  };

  useEffect(() => {
    console.log("IT CHANHED!!! : ", pathname);
    handleShuffle();
  }, [pathname]);

  if (keywords.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-x-3 gap-y-1 items-center">
        {keywords.map(({ word, size }) => (
          <StickerLink
            key={`${word}-${size}`}
            href={`/tags/${encodeURIComponent(word)}`}
            className={size}
          >
            {word}
          </StickerLink>
        ))}
      </div>
      <button
        onClick={handleShuffle}
        title="키워드 다시 섞기"
        className="mt-3 cursor-pointer"
      >
        <RefreshCw className="w-5 h-5 text-purple-100 hover:text-purple-300" />
      </button>
    </>
  );
}
