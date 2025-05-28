"use client";

import { useEffect, useState } from "react";
import TableOfContents from "./TableOfContents";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface BlogLayoutProps {
  children: React.ReactNode;
}

const BlogLayout = ({ children }: BlogLayoutProps) => {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    );
    const headingElements = elements.map((element) => ({
      id: element.id,
      text: element.textContent || "",
      level: Number(element.tagName.charAt(1)),
    }));
    setHeadings(headingElements);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <article className="lg:col-span-8 prose dark:prose-invert max-w-none">
          {children}
        </article>
        <aside className="lg:col-span-4">
          <div className="sticky top-20">
            <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogLayout;
