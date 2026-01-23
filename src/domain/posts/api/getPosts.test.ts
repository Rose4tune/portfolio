import { describe, it, expect, vi, beforeEach } from "vitest";
import { PageObjectResponse } from "@notionhq/client";
import { getPosts } from "./getPosts";
import { PostType } from "../types";
import {
  mockBlogPost,
  mockProjectPost,
  mockHiddenPost,
  createMockQueryResponse,
} from "@/test/mocks/notion";

// notionClient mock - vi.hoisted()를 사용하여 hoisting 문제 해결
const { mockDatabasesQuery, mockBlocksList } = vi.hoisted(() => ({
  mockDatabasesQuery: vi.fn(),
  mockBlocksList: vi.fn(),
}));

vi.mock("../lib/notionClient", () => ({
  notionHQClient: {
    databases: {
      query: mockDatabasesQuery,
    },
    blocks: {
      children: {
        list: mockBlocksList,
      },
    },
  },
  NOTION_DB: {
    blog: "blog-db-id",
    project: "project-db-id",
    book: "book-db-id",
  },
}));

// generateSlug 및 formatDate mock
vi.mock("@/shared/lib/utils", async () => {
  const actual = await vi.importActual<typeof import("@/shared/lib/utils")>(
    "@/shared/lib/utils"
  );
  return {
    ...actual,
    generateSlug: vi.fn((text: string) =>
      text
        .toLowerCase()
        .replace(/[^\p{Script=Hangul}a-z0-9]+/gu, "-")
        .replace(/(^-|-$)/g, "")
    ),
    formatDate: vi.fn((date: string) => date), // formatDate도 mock
  };
});

// helpers mock
vi.mock("../lib/helpers", async () => {
  const actual = await vi.importActual("../lib/helpers");
  return {
    ...actual,
    getPageFirstContent: vi.fn(() => Promise.resolve("Mock content")),
  };
});

describe("getPosts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBlocksList.mockResolvedValue({ results: [] });
  });

  it("should return blog posts", async () => {
    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([mockBlogPost])
    );

    const posts = await getPosts(PostType.blog);

    expect(posts).toHaveLength(1);
    expect(posts[0]).toHaveProperty("id", "test-blog-id-123");
    expect(posts[0]).toHaveProperty("title", "테스트 블로그 포스트");
    expect(posts[0]).toHaveProperty("slug");
    expect(mockDatabasesQuery).toHaveBeenCalledWith({
      database_id: "blog-db-id",
      filter: {
        property: "숨김",
        checkbox: { equals: false },
      },
      sorts: [
        {
          property: "날짜",
          direction: "descending",
        },
      ],
    });
  });

  it("should return project posts with additional fields", async () => {
    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([mockProjectPost])
    );

    const posts = await getPosts(PostType.project);

    expect(posts).toHaveLength(1);
    expect(posts[0]).toHaveProperty("status");
    expect(posts[0]).toHaveProperty("techStack");
    expect(posts[0]).toHaveProperty("coverImage");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((posts[0] as any).coverImage).toBe(
      "https://example.com/project-cover.jpg"
    );
  });

  it("should filter out hidden posts", async () => {
    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([mockBlogPost, mockHiddenPost])
    );

    await getPosts(PostType.blog);

    // mockDatabasesQuery가 숨김 필터를 적용하므로, 실제로는 mockBlogPost만 반환되어야 함
    // 하지만 mock에서는 이미 필터링된 결과를 반환하므로, 여기서는 API 호출 확인만 함
    expect(mockDatabasesQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: {
          property: "숨김",
          checkbox: { equals: false },
        },
      })
    );
  });

  it("should handle empty results", async () => {
    mockDatabasesQuery.mockResolvedValue(createMockQueryResponse([]));

    const posts = await getPosts(PostType.blog);

    expect(posts).toEqual([]);
  });

  it("should handle multiple posts", async () => {
    const post1 = { ...mockBlogPost, id: "post-1" };
    const post2 = { ...mockBlogPost, id: "post-2" };
    const post3 = { ...mockBlogPost, id: "post-3" };

    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([post1, post2, post3])
    );

    const posts = await getPosts(PostType.blog);

    expect(posts).toHaveLength(3);
  });

  it("should sort posts by date descending", async () => {
    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([mockBlogPost])
    );

    await getPosts(PostType.blog);

    expect(mockDatabasesQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        sorts: [
          {
            property: "날짜",
            direction: "descending",
          },
        ],
      })
    );
  });

  it("should handle API errors gracefully", async () => {
    mockDatabasesQuery.mockRejectedValue(new Error("API Error"));

    const posts = await getPosts(PostType.blog);

    expect(posts).toEqual([]);
  });

  it("should generate slug from title", async () => {
    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([mockBlogPost])
    );

    const posts = await getPosts(PostType.blog);

    expect(posts[0].slug).toBeDefined();
    expect(typeof posts[0].slug).toBe("string");
  });

  it("should include all base post fields", async () => {
    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([mockBlogPost])
    );

    const posts = await getPosts(PostType.blog);
    const post = posts[0];

    expect(post).toHaveProperty("id");
    expect(post).toHaveProperty("title");
    expect(post).toHaveProperty("slug");
    expect(post).toHaveProperty("date");
    expect(post).toHaveProperty("tags");
    expect(post).toHaveProperty("excerpt");
    expect(post).toHaveProperty("content");
  });

  it("should handle project posts without cover image", async () => {
    const postWithoutCover = {
      ...mockProjectPost,
      cover: null,
    };

    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([postWithoutCover])
    );

    const posts = await getPosts(PostType.project);
    const projectPost = posts[0] as { coverImage?: string };

    expect(projectPost.coverImage).toBeUndefined();
  });

  it("should handle project posts with file cover", async () => {
    const postWithFileCover = {
      ...mockProjectPost,
      cover: {
        type: "file" as const,
        file: {
          url: "https://example.com/file.jpg",
        },
      },
    };

    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([postWithFileCover as PageObjectResponse])
    );

    const posts = await getPosts(PostType.project);
    const projectPost = posts[0] as { coverImage?: string };

    expect(projectPost.coverImage).toBe("https://example.com/file.jpg");
  });

    it("should handle book posts", async () => {
      const bookPost: PageObjectResponse = {
        ...mockBlogPost,
        properties: {
          ...mockBlogPost.properties,
          저자: {
            id: "author",
            type: "rich_text",
            rich_text: [
              {
                type: "text",
                text: { content: "Test Author", link: null },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: "default",
                },
                plain_text: "Test Author",
                href: null,
              },
            ],
          },
          평점: {
            id: "rating",
            type: "number",
            number: 4.5,
          },
        },
      };

      mockDatabasesQuery.mockResolvedValue(
        createMockQueryResponse([bookPost])
      );

      const posts = await getPosts(PostType.book);

      expect(posts).toHaveLength(1);
      const bookPostResult = posts[0] as { author?: string; rating?: number };
      expect(bookPostResult.author).toBeDefined();
      expect(bookPostResult.rating).toBeDefined();
    });

  it("should call getPageFirstContent for each post", async () => {
    const { getPageFirstContent } = await import("../lib/helpers");
    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([mockBlogPost, mockProjectPost])
    );

    await getPosts(PostType.blog);

    expect(getPageFirstContent).toHaveBeenCalledTimes(2);
  });

  it("should handle posts with missing properties", async () => {
    const postWithMissingProps = {
      ...mockBlogPost,
      properties: {
        제목: mockBlogPost.properties.제목,
        // 다른 속성들이 없음
      },
    };

    mockDatabasesQuery.mockResolvedValue(
      createMockQueryResponse([postWithMissingProps])
    );

    const posts = await getPosts(PostType.blog);

    // 에러 없이 처리되어야 함
    expect(posts).toHaveLength(1);
  });
});
