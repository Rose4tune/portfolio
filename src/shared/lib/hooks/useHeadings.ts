import { useEffect, useState } from "react";
import { Heading } from "../../types/common";
import { generateSlug } from "../utils";

export default function useHeadings(selector: string = "h2") {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(selector));
    const headingElements = elements.map((element, index) => {
      if (!element.id) {
        const text = element.textContent || "";
        const slug = generateSlug(text);
        element.id = `${slug}-${index}`;
      }

      return {
        id: element.id,
        text: element.textContent || "",
        level: Number(element.tagName.charAt(1)),
      };
    });
    setHeadings(headingElements);
  }, [selector]);

  return headings;
}
