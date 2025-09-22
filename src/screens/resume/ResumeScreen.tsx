"use client";

import { useEffect, useState } from "react";
import { ResumeContents, TableOfContents } from "./ui";
import { Heading } from "./types";

export default function ResumeScreen() {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("h2"));
    const headingElements = elements.map((element, index) => {
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <aside className="lg:col-span-3">
        <div className="sticky top-20">
          <TableOfContents headings={headings} />
        </div>
      </aside>

      <article className="lg:col-span-9 prose dark:prose-invert max-w-none">
        <ResumeContents />
      </article>
    </div>
  );
}
