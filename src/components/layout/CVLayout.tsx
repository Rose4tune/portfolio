"use client";

import { useEffect, useState } from "react";
import TableOfContents from "./TableOfContents";
import { FiDownload } from "react-icons/fi";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface CVLayoutProps {
  children: React.ReactNode;
  pdfUrl?: string;
}

const CVLayout = ({ children, pdfUrl }: CVLayoutProps) => {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    );
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
        <article className="lg:col-span-8 prose dark:prose-invert max-w-none">
          {pdfUrl && (
            <div className="flex justify-end mb-8">
              <a
                href={pdfUrl}
                download
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Download PDF
              </a>
            </div>
          )}
          {children}
        </article>
        <aside className="lg:col-span-4">
          <div className="sticky top-20">
            <h2 className="text-lg font-semibold mb-4">Contents</h2>
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CVLayout;
