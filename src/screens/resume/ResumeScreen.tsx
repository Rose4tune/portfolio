"use client";

import { useHeadings } from "@/shared/lib/hooks";
import { ResumeContents, TableOfContents } from "./ui";

export default function ResumeScreen() {
  const headings = useHeadings("h2");

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
