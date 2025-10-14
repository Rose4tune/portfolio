import Link from "next/link";
import React from "react";

export default function Section({
  title,
  contents,
}: {
  title: string;
  contents: {
    boldText?: string;
    date?: string;
    description?: string;
    text?: string;
    link?: string;
  }[];
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-medium capitalize">{title}</h2>
      <ul className="list-disc list-inside ml-5">
        {contents.map(({ boldText, date, description, text, link }, i) => (
          <li key={`${title}-${i}`} className="space-x-2">
            {text && <span>{text}</span>}
            {boldText && (
              <span className="font-semibold">
                {link ? (
                  <Link href={link} target="_blank">
                    {boldText}
                  </Link>
                ) : (
                  boldText
                )}
              </span>
            )}
            {date && <span>({date})</span>}
            {description && <span>: {description}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
