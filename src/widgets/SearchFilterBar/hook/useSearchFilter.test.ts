import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useSearchFilter from "./useSearchFilter";

describe("useSearchFilter", () => {
  const mockItems = [
    { title: "React Tutorial", content: "Learn React basics" },
    { title: "JavaScript Guide", content: "Complete JS guide" },
    { title: "TypeScript Tips", content: "Advanced TypeScript" },
    { title: "Vue.js Introduction", content: "Vue framework guide" },
  ];

  it("should return all items when search query is empty", () => {
    const { result } = renderHook(() => useSearchFilter(mockItems));

    expect(result.current.searchQuery).toBe("");
    expect(result.current.filteredItems).toEqual(mockItems);
  });

  it("should filter items by title", () => {
    const { result } = renderHook(() => useSearchFilter(mockItems));

    act(() => {
      result.current.setSearchQuery("React");
    });

    expect(result.current.searchQuery).toBe("React");
    expect(result.current.filteredItems).toEqual([
      { title: "React Tutorial", content: "Learn React basics" },
    ]);
  });

  it("should filter items by content", () => {
    const { result } = renderHook(() => useSearchFilter(mockItems));

    act(() => {
      result.current.setSearchQuery("basics");
    });

    expect(result.current.filteredItems).toEqual([
      { title: "React Tutorial", content: "Learn React basics" },
    ]);
  });

  it("should be case insensitive", () => {
    const { result } = renderHook(() => useSearchFilter(mockItems));

    act(() => {
      result.current.setSearchQuery("JAVASCRIPT");
    });

    expect(result.current.filteredItems).toEqual([
      { title: "JavaScript Guide", content: "Complete JS guide" },
    ]);
  });

  it("should filter by partial matches", () => {
    const { result } = renderHook(() => useSearchFilter(mockItems));

    act(() => {
      result.current.setSearchQuery("script");
    });

    expect(result.current.filteredItems).toEqual([
      { title: "JavaScript Guide", content: "Complete JS guide" },
      { title: "TypeScript Tips", content: "Advanced TypeScript" },
    ]);
  });

  it("should return empty array when no matches found", () => {
    const { result } = renderHook(() => useSearchFilter(mockItems));

    act(() => {
      result.current.setSearchQuery("Python");
    });

    expect(result.current.filteredItems).toEqual([]);
  });

  it("should handle items without content", () => {
    const itemsWithoutContent = [
      { title: "React Tutorial" },
      { title: "JavaScript Guide", content: "Complete JS guide" },
    ];

    const { result } = renderHook(() => useSearchFilter(itemsWithoutContent));

    act(() => {
      result.current.setSearchQuery("guide");
    });

    expect(result.current.filteredItems).toEqual([
      { title: "JavaScript Guide", content: "Complete JS guide" },
    ]);
  });

  it("should handle empty items array", () => {
    const { result } = renderHook(() => useSearchFilter([]));

    act(() => {
      result.current.setSearchQuery("test");
    });

    expect(result.current.filteredItems).toEqual([]);
  });

  it("should update filtered items when items prop changes", () => {
    const { result, rerender } = renderHook(
      ({ items }) => useSearchFilter(items),
      {
        initialProps: { items: mockItems },
      }
    );

    act(() => {
      result.current.setSearchQuery("React");
    });

    expect(result.current.filteredItems).toHaveLength(1);

    // 새로운 아이템으로 변경
    const newItems = [
      { title: "React Advanced", content: "Advanced React patterns" },
      { title: "Vue.js Guide", content: "Vue framework" },
    ];

    rerender({ items: newItems });

    // 검색 쿼리는 유지되지만 필터링된 결과는 새로운 아이템 기준
    expect(result.current.searchQuery).toBe("React");
    expect(result.current.filteredItems).toEqual([
      { title: "React Advanced", content: "Advanced React patterns" },
    ]);
  });

  it("should handle special characters in search query", () => {
    const { result } = renderHook(() => useSearchFilter(mockItems));

    act(() => {
      result.current.setSearchQuery("React@#$%");
    });

    expect(result.current.filteredItems).toEqual([]);
  });

  it("should handle whitespace in search query", () => {
    const { result } = renderHook(() => useSearchFilter(mockItems));

    act(() => {
      result.current.setSearchQuery("  React  ");
    });

    expect(result.current.filteredItems).toEqual([
      { title: "React Tutorial", content: "Learn React basics" },
    ]);
  });

  it("should handle multiple word search", () => {
    const { result } = renderHook(() => useSearchFilter(mockItems));

    act(() => {
      result.current.setSearchQuery("complete guide");
    });

    expect(result.current.filteredItems).toEqual([
      { title: "JavaScript Guide", content: "Complete JS guide" },
    ]);
  });

  it("should clear search query", () => {
    const { result } = renderHook(() => useSearchFilter(mockItems));

    act(() => {
      result.current.setSearchQuery("React");
    });

    expect(result.current.filteredItems).toHaveLength(1);

    act(() => {
      result.current.setSearchQuery("");
    });

    expect(result.current.searchQuery).toBe("");
    expect(result.current.filteredItems).toEqual(mockItems);
  });

  it("should handle items with undefined content", () => {
    const itemsWithUndefinedContent = [
      { title: "React Tutorial", content: undefined },
      { title: "JavaScript Guide", content: "Complete JS guide" },
    ];

    const { result } = renderHook(() =>
      useSearchFilter(itemsWithUndefinedContent)
    );

    act(() => {
      result.current.setSearchQuery("guide");
    });

    expect(result.current.filteredItems).toEqual([
      { title: "JavaScript Guide", content: "Complete JS guide" },
    ]);
  });

  it("should maintain referential stability when items don't change", () => {
    const { result, rerender } = renderHook(() => useSearchFilter(mockItems));

    const firstFilteredItems = result.current.filteredItems;

    // 같은 items로 다시 렌더링
    rerender();

    // 참조가 같아야 함 (불필요한 재계산 방지)
    expect(result.current.filteredItems).toBe(firstFilteredItems);
  });
});

