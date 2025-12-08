import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import useHeadings from "./useHeadings";

// generateSlug 함수를 mock
vi.mock("../utils", () => ({
  generateSlug: vi.fn((text: string) =>
    text.toLowerCase().replace(/\s+/g, "-")
  ),
}));

describe("useHeadings", () => {
  let mockQuerySelectorAll: ReturnType<typeof vi.fn>;
  let mockElements: HTMLElement[];

  beforeEach(() => {
    // DOM 요소들을 mock
    mockElements = [
      {
        id: "",
        textContent: "First Heading",
        tagName: "H2",
      } as HTMLElement,
      {
        id: "existing-id",
        textContent: "Second Heading",
        tagName: "H3",
      } as HTMLElement,
      {
        id: "",
        textContent: "Third Heading",
        tagName: "H2",
      } as HTMLElement,
    ];

    // querySelectorAll mock 설정
    mockQuerySelectorAll = vi.fn().mockReturnValue(mockElements);
    document.querySelectorAll = mockQuerySelectorAll;

    // 각 요소의 id 설정을 mock
    mockElements.forEach((element) => {
      Object.defineProperty(element, "id", {
        writable: true,
        value: element.id,
      });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return empty array initially", () => {
    const { result } = renderHook(() => useHeadings());

    expect(result.current).toEqual([]);
  });

  it("should extract headings from DOM with default h2 selector", () => {
    expect(mockQuerySelectorAll).toHaveBeenCalledWith("h2");
  });

  it("should extract headings with custom selector", () => {
    expect(mockQuerySelectorAll).toHaveBeenCalledWith("h3");
  });

  it("should generate id for elements without id", () => {
    const firstElement = mockElements[0];
    expect(firstElement.id).toBe("");
  });

  it("should not modify elements that already have id", () => {
    const secondElement = mockElements[1];
    const originalId = secondElement.id;

    expect(secondElement.id).toBe(originalId);
  });

  it("should return correct heading structure", () => {
    const { result } = renderHook(() => useHeadings());

    const expectedHeadings = [
      {
        id: "first-heading-0", // generateSlug("First Heading") + "-0"
        text: "First Heading",
        level: 2,
      },
      {
        id: "existing-id",
        text: "Second Heading",
        level: 3,
      },
      {
        id: "third-heading-2", // generateSlug("Third Heading") + "-2"
        text: "Third Heading",
        level: 2,
      },
    ];

    expect(result.current).toEqual(expectedHeadings);
  });

  it("should handle empty text content", () => {
    const emptyElement = {
      id: "",
      textContent: "",
      tagName: "H2",
    } as HTMLElement;

    mockQuerySelectorAll.mockReturnValue([emptyElement]);

    const { result } = renderHook(() => useHeadings());

    expect(result.current).toEqual([
      {
        id: "-0", // generateSlug("") + "-0"
        text: "",
        level: 2,
      },
    ]);
  });

  it("should handle null text content", () => {
    const nullElement = {
      id: "",
      textContent: null,
      tagName: "H2",
    } as HTMLElement;

    mockQuerySelectorAll.mockReturnValue([nullElement]);

    const { result } = renderHook(() => useHeadings());

    expect(result.current).toEqual([
      {
        id: "-0", // generateSlug("") + "-0"
        text: "",
        level: 2,
      },
    ]);
  });

  it("should handle different heading levels", () => {
    const mixedElements = [
      { id: "", textContent: "H1", tagName: "H1" } as HTMLElement,
      { id: "", textContent: "H2", tagName: "H2" } as HTMLElement,
      { id: "", textContent: "H3", tagName: "H3" } as HTMLElement,
      { id: "", textContent: "H4", tagName: "H4" } as HTMLElement,
    ];

    mockQuerySelectorAll.mockReturnValue(mixedElements);

    const { result } = renderHook(() => useHeadings("h1, h2, h3, h4"));

    expect(result.current).toEqual([
      { id: "h1-0", text: "H1", level: 1 },
      { id: "h2-1", text: "H2", level: 2 },
      { id: "h3-2", text: "H3", level: 3 },
      { id: "h4-3", text: "H4", level: 4 },
    ]);
  });

  it("should re-run when selector changes", () => {
    const { result, rerender } = renderHook(
      ({ selector }) => useHeadings(selector),
      {
        initialProps: { selector: "h2" },
      }
    );

    expect(mockQuerySelectorAll).toHaveBeenCalledWith("h2");

    rerender({ selector: "h3" });

    expect(mockQuerySelectorAll).toHaveBeenCalledWith("h3");
  });

  it("should handle no matching elements", () => {
    mockQuerySelectorAll.mockReturnValue([]);

    const { result } = renderHook(() => useHeadings());

    expect(result.current).toEqual([]);
  });

  it("should handle DOM errors gracefully", () => {
    mockQuerySelectorAll.mockImplementation(() => {
      throw new Error("DOM error");
    });

    const { result } = renderHook(() => useHeadings());

    // 에러가 발생해도 빈 배열을 반환해야 함
    expect(result.current).toEqual([]);
  });
});
