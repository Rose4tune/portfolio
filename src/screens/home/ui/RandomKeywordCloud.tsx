"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

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

interface RandomKeywordCloudProps {
  keywords: string[];
  renderKeyword: (word: string, size: string) => ReactNode;
}

export default function RandomKeywordCloud({
  keywords,
  renderKeyword,
}: RandomKeywordCloudProps) {
  const pathname = usePathname();

  const [displayKeywords, setDisplayKeywords] = useState<
    Array<{ word: string; size: string }>
  >([]);

  const handleShuffle = () => {
    const newKeywords = shuffleArray(keywords)
      .slice(0, 10)
      .map((word) => ({ word, size: getRandomFontSize() }));
    setDisplayKeywords((prev) => {
      return JSON.stringify(prev) === JSON.stringify(newKeywords)
        ? [...newKeywords]
        : newKeywords;
    });
  };

  useEffect(() => {
    const newKeywords = shuffleArray(keywords)
      .slice(0, 10)
      .map((word) => ({ word, size: getRandomFontSize() }));
    setDisplayKeywords(newKeywords);
  }, [pathname, keywords]);

  if (displayKeywords.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-x-3 gap-y-1 items-center">
        {displayKeywords.map(({ word, size }) => renderKeyword(word, size))}
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
