"use client";

import { useState, useEffect, ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { usePathname } from "next/navigation";
import { shuffleArray, getRandomItem } from "@/shared/lib/utils/array";

interface RandomKeywordCloudProps {
  keywords: string[];
  renderKeyword: (word: string, size: string) => ReactNode;
}

const FontSizes = ["text-xl", "text-2xl", "text-3xl"];

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
      .slice(0, 12)
      .map((word) => ({ word, size: getRandomItem(FontSizes) }));
    setDisplayKeywords((prev) => {
      return JSON.stringify(prev) === JSON.stringify(newKeywords)
        ? [...newKeywords]
        : newKeywords;
    });
  };

  useEffect(() => {
    const newKeywords = shuffleArray(keywords)
      .slice(0, 10)
      .map((word) => ({ word, size: getRandomItem(FontSizes) }));
    setDisplayKeywords(newKeywords);
  }, [pathname, keywords]);

  if (displayKeywords.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-x-3 gap-y-1 items-center justify-center sm:justify-start">
        {displayKeywords.map(({ word, size }) => renderKeyword(word, size))}
      </div>
      <button
        onClick={handleShuffle}
        title="키워드 다시 섞기"
        className="cursor-pointer absolute -bottom-8 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0"
      >
        <RefreshCw className="w-5 h-5 text-purple-100 hover:text-purple-300" />
      </button>
    </>
  );
}
