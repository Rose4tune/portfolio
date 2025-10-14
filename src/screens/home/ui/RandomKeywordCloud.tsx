"use client";

<<<<<<< HEAD
<<<<<<< HEAD
import { useState, useEffect, ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { usePathname } from "next/navigation";
import { shuffleArray, getRandomItem } from "@/shared/lib/utils/array";
=======
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
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
=======
import { useState, useEffect, ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { usePathname } from "next/navigation";
import { shuffleArray, getRandomItem } from "@/shared/lib/utils/array";
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))

interface RandomKeywordCloudProps {
  keywords: string[];
  renderKeyword: (word: string, size: string) => ReactNode;
}

<<<<<<< HEAD
<<<<<<< HEAD
const FontSizes = ["text-xl", "text-2xl", "text-3xl"];

=======
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
=======
const FontSizes = ["text-xl", "text-2xl", "text-3xl"];

>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))
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
<<<<<<< HEAD
<<<<<<< HEAD
      .slice(0, 12)
      .map((word) => ({ word, size: getRandomItem(FontSizes) }));
=======
      .slice(0, 10)
      .map((word) => ({ word, size: getRandomFontSize() }));
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
=======
      .slice(0, 12)
      .map((word) => ({ word, size: getRandomItem(FontSizes) }));
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))
    setDisplayKeywords((prev) => {
      return JSON.stringify(prev) === JSON.stringify(newKeywords)
        ? [...newKeywords]
        : newKeywords;
    });
  };

  useEffect(() => {
    const newKeywords = shuffleArray(keywords)
      .slice(0, 10)
<<<<<<< HEAD
<<<<<<< HEAD
      .map((word) => ({ word, size: getRandomItem(FontSizes) }));
=======
      .map((word) => ({ word, size: getRandomFontSize() }));
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
=======
      .map((word) => ({ word, size: getRandomItem(FontSizes) }));
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))
    setDisplayKeywords(newKeywords);
  }, [pathname, keywords]);

  if (displayKeywords.length === 0) return null;

  return (
    <>
<<<<<<< HEAD
<<<<<<< HEAD
      <div className="flex flex-wrap gap-x-3 gap-y-1 items-center justify-center sm:justify-start">
=======
      <div className="flex flex-wrap gap-x-3 gap-y-1 items-center">
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
=======
      <div className="flex flex-wrap gap-x-3 gap-y-1 items-center justify-center sm:justify-start">
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))
        {displayKeywords.map(({ word, size }) => renderKeyword(word, size))}
      </div>
      <button
        onClick={handleShuffle}
        title="키워드 다시 섞기"
<<<<<<< HEAD
<<<<<<< HEAD
        className="cursor-pointer absolute -bottom-8 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0"
=======
        className="mt-3 cursor-pointer"
>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11))
=======
        className="cursor-pointer absolute -bottom-8 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0"
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))
      >
        <RefreshCw className="w-5 h-5 text-purple-100 hover:text-purple-300" />
      </button>
    </>
  );
}
