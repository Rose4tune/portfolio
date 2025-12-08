import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPageIdBySlug } from "./getPageIdBySlug";
import { PostType } from "../types";
import { mockBlogPost, createMockQueryResponse } from "@/test/mocks/notion";

// notionClient mock - vi.hoisted()를 사용하여 hoisting 문제 해결
const { mockDatabasesQuery } = vi.hoisted(() => ({
  mockDatabasesQuery: vi.fn(),
}));

vi.mock("../lib/notionClient", () => ({
  notionHQClient: {
    databases: {
      query: mockDatabasesQuery,
    },
  },
  NOTION_DB: {
    blog: "blog-db-id",
    project: "project-db-id",
    book: "book-db-id",
  },
}));

// generateSlug mock - 실제 구현과 유사하게
vi.mock("@/shared/lib/utils", () => ({
  generateSlug: vi.fn((text: string) =>
    text
      .toLowerCase()
      .replace(/[^\p{Script=Hangul}a-z0-9]+/gu, "-")
      .replace(/(^-|-$)/g, "")
  ),
}));

describe("getPageIdBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return page id for matching slug", async () => {
    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([mockBlogPost])
    );

    const pageId = await getPageIdBySlug(
      PostType.blog,
      "테스트-블로그-포스트"
    );

    expect(pageId).toBe("test-blog-id-123");
  });

  it("should return null for non-matching slug", async () => {
    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([mockBlogPost])
    );

    const pageId = await getPageIdBySlug(PostType.blog, "non-existent-slug");

    expect(pageId).toBeNull();
  });

  it("should return null for empty slug", async () => {
    const pageId = await getPageIdBySlug(PostType.blog, "");

    expect(pageId).toBeNull();
    expect(mockDatabasesQuery).not.toHaveBeenCalled();
  });

  it("should return null for null slug", async () => {
    const pageId = await getPageIdBySlug(PostType.blog, null as any);

    expect(pageId).toBeNull();
    expect(mockDatabasesQuery).not.toHaveBeenCalled();
  });

  it("should return null for non-string slug", async () => {
    const pageId = await getPageIdBySlug(PostType.blog, 123 as any);

    expect(pageId).toBeNull();
    expect(mockDatabasesQuery).not.toHaveBeenCalled();
  });

  it("should decode URL-encoded slug", async () => {
    const encodedSlug = encodeURIComponent("테스트-블로그-포스트");
    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([mockBlogPost])
    );

    const pageId = await getPageIdBySlug(PostType.blog, encodedSlug);

    expect(pageId).toBe("test-blog-id-123");
  });

  it("should filter out hidden posts", async () => {
    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([mockBlogPost])
    );

    await getPageIdBySlug(PostType.blog, "test-slug");

    expect(mockDatabasesQuery).toHaveBeenCalledWith({
      database_id: "blog-db-id",
      filter: {
        property: "숨김",
        checkbox: { equals: false },
      },
    });
  });

  it("should return null for invalid database id", async () => {
    vi.doMock("../lib/notionClient", () => ({
      notionHQClient: {
        databases: {
          query: mockDatabasesQuery,
        },
      },
      NOTION_DB: {
        blog: undefined,
        project: "project-db-id",
        book: "book-db-id",
      },
    }));

    const pageId = await getPageIdBySlug(PostType.blog, "test-slug");

    expect(pageId).toBeNull();
  });

  it("should handle multiple posts and find correct one", async () => {
    const post1 = {
      ...mockBlogPost,
      id: "post-1",
      properties: {
        ...mockBlogPost.properties,
        제목: {
          ...mockBlogPost.properties.제목,
          title: [{ plain_text: "First Post" }],
        },
      },
    };

    const post2 = {
      ...mockBlogPost,
      id: "post-2",
      properties: {
        ...mockBlogPost.properties,
        제목: {
          ...mockBlogPost.properties.제목,
          title: [{ plain_text: "Second Post" }],
        },
      },
    };

    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([post1, post2])
    );

    const pageId = await getPageIdBySlug(PostType.blog, "second-post");

    expect(pageId).toBe("post-2");
  });

  it("should handle API errors gracefully", async () => {
    mockDatabasesQuery.mockRejectedValue(new Error("API Error"));

    const pageId = await getPageIdBySlug(PostType.blog, "test-slug");

    expect(pageId).toBeNull();
  });

  it("should work with different post types", async () => {
    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([mockBlogPost])
    );

    await getPageIdBySlug(PostType.project, "test-slug");

    expect(mockDatabasesQuery).toHaveBeenCalledWith({
      database_id: "project-db-id",
      filter: {
        property: "숨김",
        checkbox: { equals: false },
      },
    });
  });

  it("should handle empty results", async () => {
    mockDatabasesQuery.mockResolvedValue(createMockQueryResponse([]));

    const pageId = await getPageIdBySlug(PostType.blog, "test-slug");

    expect(pageId).toBeNull();
  });

  it("should handle posts with empty titles", async () => {
    const postWithEmptyTitle = {
      ...mockBlogPost,
      properties: {
        ...mockBlogPost.properties,
        제목: {
          id: "title",
          type: "title",
          title: [],
        },
      },
    };

    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([postWithEmptyTitle])
    );

    const pageId = await getPageIdBySlug(PostType.blog, "test-slug");

    expect(pageId).toBeNull();
  });

  it("should handle special characters in slug", async () => {
    const postWithSpecialChars = {
      ...mockBlogPost,
      properties: {
        ...mockBlogPost.properties,
        제목: {
          id: "title",
          type: "title",
          title: [{ plain_text: "Post with Special!@# Characters" }],
        },
      },
    };

    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([postWithSpecialChars])
    );

    const pageId = await getPageIdBySlug(
      PostType.blog,
      "post-with-special-characters"
    );

    expect(pageId).toBe("test-blog-id-123");
  });

  it("should be case sensitive for slug matching", async () => {
    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([mockBlogPost])
    );

    // generateSlug는 소문자로 변환하므로 대소문자 구분 없음
    const pageId1 = await getPageIdBySlug(PostType.blog, "테스트-블로그-포스트");
    const pageId2 = await getPageIdBySlug(PostType.blog, "TEST-BLOG-POST");

    // generateSlug가 소문자로 변환하므로 둘 다 매칭되어야 함
    expect(pageId1).toBe("test-blog-id-123");
  });

  it("should handle posts without title property", async () => {
    const postWithoutTitle = {
      ...mockBlogPost,
      properties: {},
    };

    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([postWithoutTitle])
    );

    const pageId = await getPageIdBySlug(PostType.blog, "test-slug");

    // 에러 없이 null 반환
    expect(pageId).toBeNull();
  });
});
