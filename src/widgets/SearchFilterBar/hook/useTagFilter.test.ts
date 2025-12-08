import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useTagFilter from "./useTagFilter";

// Next.js navigation hooks를 mock
const mockRouter = {
  replace: vi.fn(),
  push: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

const mockSearchParams = {
  get: vi.fn(),
  toString: vi.fn(() => ""),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/test",
  useSearchParams: () => mockSearchParams,
}));

describe("useTagFilter", () => {
  const uniqueTags = ["React", "JavaScript", "TypeScript", "Vue"];

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.get.mockReturnValue(null);
    mockSearchParams.toString.mockReturnValue("");
  });

  it("should initialize with no selected tag when no tag param", () => {
    mockSearchParams.get.mockReturnValue(null);

    const { result } = renderHook(() => useTagFilter(uniqueTags));

    expect(result.current.selectedTag).toBe(null);
  });

  it("should set selected tag from URL params", () => {
    mockSearchParams.get.mockReturnValue("React");

    const { result } = renderHook(() => useTagFilter(uniqueTags));

    expect(result.current.selectedTag).toBe("React");
  });

  it("should not set invalid tag from URL params", () => {
    mockSearchParams.get.mockReturnValue("InvalidTag");

    const { result } = renderHook(() => useTagFilter(uniqueTags));

    expect(result.current.selectedTag).toBe(null);
  });

  it("should handle tag selection", () => {
    const { result } = renderHook(() => useTagFilter(uniqueTags));

    act(() => {
      result.current.handleTagSelect("React");
    });

    expect(result.current.selectedTag).toBe("React");
    expect(mockRouter.replace).toHaveBeenCalledWith("/test?tag=React");
  });

  it("should handle tag deselection", () => {
    const { result } = renderHook(() => useTagFilter(uniqueTags));

    act(() => {
      result.current.handleTagSelect(null);
    });

    expect(result.current.selectedTag).toBe(null);
    expect(mockRouter.replace).toHaveBeenCalledWith("/test?");
  });

  it("should not select invalid tag", () => {
    const { result } = renderHook(() => useTagFilter(uniqueTags));

    act(() => {
      result.current.handleTagSelect("InvalidTag");
    });

    expect(result.current.selectedTag).toBe(null);
    expect(mockRouter.replace).toHaveBeenCalledWith("/test?");
  });

  it("should update URL when selecting valid tag", () => {
    mockSearchParams.toString.mockReturnValue("existing=param");

    const { result } = renderHook(() => useTagFilter(uniqueTags));

    act(() => {
      result.current.handleTagSelect("JavaScript");
    });

    expect(mockRouter.replace).toHaveBeenCalledWith(
      "/test?existing=param&tag=JavaScript"
    );
  });

  it("should preserve existing URL params when deselecting tag", () => {
    mockSearchParams.toString.mockReturnValue("existing=param&other=value");

    const { result } = renderHook(() => useTagFilter(uniqueTags));

    act(() => {
      result.current.handleTagSelect(null);
    });

    expect(mockRouter.replace).toHaveBeenCalledWith(
      "/test?existing=param&other=value"
    );
  });

  it("should handle case sensitive tag matching", () => {
    const { result } = renderHook(() => useTagFilter(uniqueTags));

    act(() => {
      result.current.handleTagSelect("react"); // 소문자
    });

    expect(result.current.selectedTag).toBe(null);
    expect(mockRouter.replace).toHaveBeenCalledWith("/test?");
  });

  it("should handle empty uniqueTags array", () => {
    const { result } = renderHook(() => useTagFilter([]));

    act(() => {
      result.current.handleTagSelect("AnyTag");
    });

    expect(result.current.selectedTag).toBe(null);
    expect(mockRouter.replace).toHaveBeenCalledWith("/test?");
  });

  it("should handle URL params change", () => {
    const { result, rerender } = renderHook(() => useTagFilter(uniqueTags));

    // 처음에는 tag가 없음
    expect(result.current.selectedTag).toBe(null);

    // URL에 tag 파라미터가 추가됨
    mockSearchParams.get.mockReturnValue("TypeScript");
    rerender();

    expect(result.current.selectedTag).toBe("TypeScript");
  });

  it("should handle invalid URL params gracefully", () => {
    mockSearchParams.get.mockImplementation(() => {
      throw new Error("URL parsing error");
    });

    const { result } = renderHook(() => useTagFilter(uniqueTags));

    expect(result.current.selectedTag).toBe(null);
  });

  it("should handle router errors gracefully", () => {
    mockRouter.replace.mockImplementation(() => {
      throw new Error("Router error");
    });

    const { result } = renderHook(() => useTagFilter(uniqueTags));

    act(() => {
      result.current.handleTagSelect("React");
    });

    // 에러가 발생해도 selectedTag는 null로 설정되어야 함
    expect(result.current.selectedTag).toBe(null);
  });

  it("should handle search params errors gracefully", () => {
    mockSearchParams.get.mockImplementation(() => {
      throw new Error("Search params error");
    });

    const { result } = renderHook(() => useTagFilter(uniqueTags));

    expect(result.current.selectedTag).toBe(null);
  });

  it("should update when uniqueTags change", () => {
    const { result, rerender } = renderHook(({ tags }) => useTagFilter(tags), {
      initialProps: { tags: uniqueTags },
    });

    // 새로운 태그 목록으로 변경
    const newTags = ["Python", "Django", "Flask"];
    rerender({ tags: newTags });

    // 기존에 선택된 태그가 새로운 목록에 없으면 null이 되어야 함
    act(() => {
      result.current.handleTagSelect("Python");
    });

    expect(result.current.selectedTag).toBe("Python");
  });

  it("should handle setSelectedTag directly", () => {
    const { result } = renderHook(() => useTagFilter(uniqueTags));

    act(() => {
      result.current.setSelectedTag("Vue");
    });

    expect(result.current.selectedTag).toBe("Vue");
  });

  it("should handle multiple tag selections", () => {
    const { result } = renderHook(() => useTagFilter(uniqueTags));

    act(() => {
      result.current.handleTagSelect("React");
    });

    expect(result.current.selectedTag).toBe("React");

    act(() => {
      result.current.handleTagSelect("JavaScript");
    });

    expect(result.current.selectedTag).toBe("JavaScript");
  });

  it("should maintain referential stability for callbacks", () => {
    const { result, rerender } = renderHook(() => useTagFilter(uniqueTags));

    const firstHandleTagSelect = result.current.handleTagSelect;

    rerender();

    // handleTagSelect는 useCallback으로 메모이제이션되어야 함
    expect(result.current.handleTagSelect).toBe(firstHandleTagSelect);
  });
});

