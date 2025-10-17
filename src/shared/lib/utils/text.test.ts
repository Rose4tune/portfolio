import { describe, it, expect } from "vitest";
import { generateSlug, getPreviewText } from "./text";

describe("text utils", () => {
  describe("generateSlug", () => {
    it("should convert Korean text to slug", () => {
      const text = "안녕하세요";
      const result = generateSlug(text);

      expect(result).toBe("안녕하세요");
    });

    it("should convert English text to lowercase slug", () => {
      const text = "Hello World";
      const result = generateSlug(text);

      expect(result).toBe("hello-world");
    });

    it("should replace spaces with hyphens", () => {
      const text = "This is a test";
      const result = generateSlug(text);

      expect(result).toBe("this-is-a-test");
    });

    it("should handle mixed Korean and English text", () => {
      const text = "React로 만든 프로젝트";
      const result = generateSlug(text);

      expect(result).toBe("react로-만든-프로젝트");
    });

    it("should remove special characters", () => {
      const text = "Hello@World!#Test$";
      const result = generateSlug(text);

      expect(result).toBe("hello-world-test");
    });

    it("should remove leading and trailing hyphens", () => {
      const text = "  Hello World  ";
      const result = generateSlug(text);

      expect(result).toBe("hello-world");
      expect(result.startsWith("-")).toBe(false);
      expect(result.endsWith("-")).toBe(false);
    });

    it("should handle multiple consecutive spaces", () => {
      const text = "Hello    World";
      const result = generateSlug(text);

      // 여러 공백이 하나의 하이픈으로 변환되어야 함
      expect(result).toBe("hello-world");
      expect(result).not.toContain("--");
    });

    it("should handle numbers in text", () => {
      const text = "React 18 Features";
      const result = generateSlug(text);

      expect(result).toBe("react-18-features");
    });

    it("should handle empty string", () => {
      const text = "";
      const result = generateSlug(text);

      expect(result).toBe("");
    });

    it("should handle only special characters", () => {
      const text = "!@#$%^&*()";
      const result = generateSlug(text);

      expect(result).toBe("");
    });

    it("should normalize Unicode characters", () => {
      const text = "Café";
      const result = generateSlug(text);

      expect(result).toContain("caf");
    });
  });

  describe("getPreviewText", () => {
    it("should return text as-is if shorter than maxLength", () => {
      const text = "Short text";
      const result = getPreviewText(text, 20);

      expect(result).toBe("Short text");
    });

    it("should truncate text and add ellipsis if longer than maxLength", () => {
      const text = "This is a very long text that should be truncated";
      const result = getPreviewText(text, 20);

      expect(result).toBe("This is a very long ...");
      expect(result.length).toBe(23); // 20 + "..."
    });

    it("should use default maxLength of 60 when not specified", () => {
      const text = "a".repeat(100);
      const result = getPreviewText(text);

      expect(result.length).toBe(63); // 60 + "..."
      expect(result.endsWith("...")).toBe(true);
    });

    it("should remove HTML tags", () => {
      const text = "<p>Hello <strong>World</strong></p>";
      const result = getPreviewText(text);

      expect(result).toBe("Hello World");
      expect(result).not.toContain("<");
      expect(result).not.toContain(">");
    });

    it("should remove markdown bold/italic syntax", () => {
      const text = "**Bold** and *italic* text";
      const result = getPreviewText(text);

      expect(result).toBe("Bold and italic text");
      expect(result).not.toContain("**");
      expect(result).not.toContain("*");
    });

    it("should handle markdown links", () => {
      const text = "Check out [this link](https://example.com)";
      const result = getPreviewText(text);

      expect(result).toBe("Check out this link");
      expect(result).not.toContain("[");
      expect(result).not.toContain("]");
      expect(result).not.toContain("(");
    });

    it("should remove code blocks", () => {
      const text = "Some text ```const x = 1;``` more text";
      const result = getPreviewText(text);

      expect(result).toBe("Some text  more text");
      expect(result).not.toContain("```");
    });

    it("should remove inline code backticks", () => {
      const text = "Use `console.log()` to debug";
      const result = getPreviewText(text);

      expect(result).toBe("Use console.log() to debug");
      expect(result).not.toContain("`");
    });

    it("should replace multiple newlines with single space", () => {
      const text = "Line 1\n\n\nLine 2\n\nLine 3";
      const result = getPreviewText(text);

      expect(result).toBe("Line 1 Line 2 Line 3");
      expect(result).not.toContain("\n");
    });

    it("should trim whitespace", () => {
      const text = "   Text with spaces   ";
      const result = getPreviewText(text);

      expect(result).toBe("Text with spaces");
      expect(result.startsWith(" ")).toBe(false);
      expect(result.endsWith(" ")).toBe(false);
    });

    it("should handle complex markdown", () => {
      const text = `
        # Title
        **Bold** text with [link](url)
        
        More text here
        \`code\` and more
      `;
      const result = getPreviewText(text);

      expect(result).not.toContain("#");
      expect(result).not.toContain("**");
      expect(result).not.toContain("[");
      expect(result).not.toContain("`");
    });

    it("should handle empty string", () => {
      const text = "";
      const result = getPreviewText(text);

      expect(result).toBe("");
    });

    it("should handle Korean text", () => {
      const longText = "안녕하세요".repeat(20);
      const result = getPreviewText(longText, 20);

      expect(result.length).toBe(23);
      expect(result.endsWith("...")).toBe(true);
    });

    it("should handle mixed HTML and markdown", () => {
      const text = "<div>**Bold** [link](url)</div>";
      const result = getPreviewText(text);

      expect(result).toBe("Bold link");
    });
  });
});
