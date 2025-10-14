"use client";

import { useEffect, useState } from "react";
import { Heading } from "@/shared/types/common";

interface TableOfContentsProps {
  headings: Heading[];
}

const TableOfContents = ({ headings }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    headings.forEach((heading: Heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
      <ul className="space-y-2 text-sm">
        {headings.map((heading: Heading) => (
          <li
            key={heading.id}
            style={{ marginLeft: `${(heading.level - 1) * 1}rem` }}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1 hover:text-purple-400 dark:hover:text-purple-300 ${
                activeId === heading.id
                  ? "text-purple-400 dark:text-purple-300 font-medium"
                  : "text-gray-600 dark:text-gray-400"
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
