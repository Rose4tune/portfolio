"use client";

import { useEffect, useState } from "react";
import TableOfContents from "./TableOfContents";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface CVLayoutProps {
  children: React.ReactNode;
}

const CVLayout = ({ children }: CVLayoutProps) => {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("h2"));
    const headingElements = elements.map((element, index) => {
      // id가 없는 경우 자동으로 생성
      if (!element.id) {
        const text = element.textContent || "";
        const slug = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        element.id = `${slug}-${index}`;
      }

      return {
        id: element.id,
        text: element.textContent || "",
        level: Number(element.tagName.charAt(1)),
      };
    });
    setHeadings(headingElements);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <div className="sticky top-20">
            <TableOfContents headings={headings} />
          </div>
        </aside>
        <article className="lg:col-span-8 prose dark:prose-invert max-w-none">
          {children}
        </article>
      </div>
    </div>
  );
};

export default CVLayout;
