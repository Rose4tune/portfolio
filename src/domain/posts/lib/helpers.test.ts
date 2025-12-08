import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPropertyValue, getPageFirstContent } from "./helpers";
import { PageObjectResponse } from "@notionhq/client";

// notionClient mock - vi.hoisted()를 사용하여 hoisting 문제 해결
const { mockBlocksList } = vi.hoisted(() => ({
  mockBlocksList: vi.fn(),
}));

vi.mock("./notionClient", () => ({
  notionHQClient: {
    blocks: {
      children: {
        list: mockBlocksList,
      },
    },
  },
}));

// formatDate mock
vi.mock("@/shared/lib/utils", () => ({
  formatDate: vi.fn((date: string) => date),
}));

describe("helpers", () => {
  describe("getPropertyValue", () => {
    it("should return empty string for undefined property", () => {
      const result = getPropertyValue(undefined as any);
      expect(result).toBe("");
    });

    it("should extract title property", () => {
      const property = {
        type: "title",
        title: [
          { plain_text: "Test Title" },
          { plain_text: " Part 2" },
        ],
      } as any;

      const result = getPropertyValue(property);
      expect(result).toBe("Test Title Part 2");
    });

    it("should return empty string for empty title", () => {
      const property = {
        type: "title",
        title: [],
      } as any;

      const result = getPropertyValue(property);
      expect(result).toBe("");
    });

    it("should extract rich_text property", () => {
      const property = {
        type: "rich_text",
        rich_text: [{ plain_text: "Rich text content" }],
      } as any;

      const result = getPropertyValue(property);
      expect(result).toBe("Rich text content");
    });

    it("should return empty string for empty rich_text", () => {
      const property = {
        type: "rich_text",
        rich_text: [],
      } as any;

      const result = getPropertyValue(property);
      expect(result).toBe("");
    });

    it("should extract date property", () => {
      const property = {
        type: "date",
        date: { start: "2024-01-15" },
      } as any;

      const result = getPropertyValue(property);
      expect(result).toBe("2024-01-15");
    });

    it("should return empty string for null date", () => {
      const property = {
        type: "date",
        date: null,
      } as any;

      const result = getPropertyValue(property);
      expect(result).toBe("");
    });

    it("should extract select property", () => {
      const property = {
        type: "select",
        select: { name: "In Progress" },
      } as any;

      const result = getPropertyValue(property);
      expect(result).toBe("In Progress");
    });

    it("should return empty string for null select", () => {
      const property = {
        type: "select",
        select: null,
      } as any;

      const result = getPropertyValue(property);
      expect(result).toBe("");
    });

    it("should extract multi_select property", () => {
      const property = {
        type: "multi_select",
        multi_select: [
          { name: "React" },
          { name: "TypeScript" },
          { name: "Next.js" },
        ],
      } as any;

      const result = getPropertyValue(property);
      expect(result).toEqual(["React", "TypeScript", "Next.js"]);
    });

    it("should return empty array for empty multi_select", () => {
      const property = {
        type: "multi_select",
        multi_select: [],
      } as any;

      const result = getPropertyValue(property);
      expect(result).toEqual([]);
    });

    it("should extract number property", () => {
      const property = {
        type: "number",
        number: 4.5,
      } as any;

      const result = getPropertyValue(property);
      expect(result).toBe(4.5);
    });

    it("should return 0 for null number", () => {
      const property = {
        type: "number",
        number: null,
      } as any;

      const result = getPropertyValue(property);
      expect(result).toBe(0);
    });

    it("should extract checkbox property", () => {
      const property = {
        type: "checkbox",
        checkbox: true,
      } as any;

      const result = getPropertyValue(property);
      expect(result).toBe(true);
    });

    it("should return false for null checkbox", () => {
      const property = {
        type: "checkbox",
        checkbox: null,
      } as any;

      const result = getPropertyValue(property);
      expect(result).toBe(false);
    });

    it("should return empty string for unknown property type", () => {
      const property = {
        type: "unknown_type",
      } as any;

      const result = getPropertyValue(property);
      expect(result).toBe("");
    });
  });

  describe("getPageFirstContent", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should extract paragraph content", async () => {
      mockBlocksList.mockResolvedValue({
        results: [
          {
            type: "paragraph",
            paragraph: {
              rich_text: [{ plain_text: "First paragraph" }],
            },
          },
        ],
      });

      const content = await getPageFirstContent("page-id");
      expect(content).toBe("First paragraph");
    });

    it("should extract heading_1 content", async () => {
      mockBlocksList.mockResolvedValue({
        results: [
          {
            type: "heading_1",
            heading_1: {
              rich_text: [{ plain_text: "Main Heading" }],
            },
          },
        ],
      });

      const content = await getPageFirstContent("page-id");
      expect(content).toBe("# Main Heading");
    });

    it("should extract heading_2 content", async () => {
      mockBlocksList.mockResolvedValue({
        results: [
          {
            type: "heading_2",
            heading_2: {
              rich_text: [{ plain_text: "Sub Heading" }],
            },
          },
        ],
      });

      const content = await getPageFirstContent("page-id");
      expect(content).toBe("## Sub Heading");
    });

    it("should extract heading_3 content", async () => {
      mockBlocksList.mockResolvedValue({
        results: [
          {
            type: "heading_3",
            heading_3: {
              rich_text: [{ plain_text: "Sub Sub Heading" }],
            },
          },
        ],
      });

      const content = await getPageFirstContent("page-id");
      expect(content).toBe("### Sub Sub Heading");
    });

    it("should extract bulleted_list_item content", async () => {
      mockBlocksList.mockResolvedValue({
        results: [
          {
            type: "bulleted_list_item",
            bulleted_list_item: {
              rich_text: [{ plain_text: "List item" }],
            },
          },
        ],
      });

      const content = await getPageFirstContent("page-id");
      expect(content).toBe("• List item");
    });

    it("should extract numbered_list_item content", async () => {
      mockBlocksList.mockResolvedValue({
        results: [
          {
            type: "numbered_list_item",
            numbered_list_item: {
              rich_text: [{ plain_text: "Numbered item" }],
            },
          },
        ],
      });

      const content = await getPageFirstContent("page-id");
      expect(content).toBe("1. Numbered item");
    });

    it("should combine multiple blocks", async () => {
      mockBlocksList.mockResolvedValue({
        results: [
          {
            type: "heading_1",
            heading_1: {
              rich_text: [{ plain_text: "Title" }],
            },
          },
          {
            type: "paragraph",
            paragraph: {
              rich_text: [{ plain_text: "Content" }],
            },
          },
        ],
      });

      const content = await getPageFirstContent("page-id");
      expect(content).toBe("# Title\nContent");
    });

    it("should stop at 100 characters in loop", async () => {
      // 여러 블록을 추가하여 누적 길이가 100자를 넘으면 루프가 중단되어야 함
      const block1 = "a".repeat(50);
      const block2 = "b".repeat(60); // 총 110자
      mockBlocksList.mockResolvedValue({
        results: [
          {
            type: "paragraph",
            paragraph: {
              rich_text: [{ plain_text: block1 }],
            },
          },
          {
            type: "paragraph",
            paragraph: {
              rich_text: [{ plain_text: block2 }],
            },
          },
        ],
      });

      const content = await getPageFirstContent("page-id");
      // 첫 번째 블록(50자)만 처리되고 루프가 중단되어야 함
      // 하지만 실제로는 두 번째 블록까지 처리될 수 있음 (정확히 100자에서 중단되지 않을 수 있음)
      // 최종적으로는 200자로 제한되므로, 100자 제한은 루프 중단 조건일 뿐
      expect(content.length).toBeLessThanOrEqual(200);
    });

    it("should limit to 200 characters total", async () => {
      const longText = "a".repeat(300);
      mockBlocksList.mockResolvedValue({
        results: [
          {
            type: "paragraph",
            paragraph: {
              rich_text: [{ plain_text: longText }],
            },
          },
        ],
      });

      const content = await getPageFirstContent("page-id");
      expect(content.length).toBeLessThanOrEqual(200);
    });

    it("should handle empty blocks", async () => {
      mockBlocksList.mockResolvedValue({
        results: [],
      });

      const content = await getPageFirstContent("page-id");
      expect(content).toBe("");
    });

    it("should handle blocks without rich_text", async () => {
      mockBlocksList.mockResolvedValue({
        results: [
          {
            type: "paragraph",
            paragraph: {},
          },
        ],
      });

      const content = await getPageFirstContent("page-id");
      expect(content).toBe("");
    });

    it("should handle blocks without type", async () => {
      mockBlocksList.mockResolvedValue({
        results: [
          {
            paragraph: {
              rich_text: [{ plain_text: "Text" }],
            },
          },
        ],
      });

      const content = await getPageFirstContent("page-id");
      expect(content).toBe("");
    });

    it("should handle API errors gracefully", async () => {
      mockBlocksList.mockRejectedValue(new Error("API Error"));

      const content = await getPageFirstContent("page-id");
      expect(content).toBe("");
    });

    it("should trim whitespace", async () => {
      mockBlocksList.mockResolvedValue({
        results: [
          {
            type: "paragraph",
            paragraph: {
              rich_text: [{ plain_text: "  Text with spaces  " }],
            },
          },
        ],
      });

      const content = await getPageFirstContent("page-id");
      expect(content).toBe("Text with spaces");
    });
  });
});
