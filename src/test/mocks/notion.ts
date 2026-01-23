import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

/**
 * Notion API Mock 데이터
 * 실제 Notion API 응답을 시뮬레이션합니다
 */

export const mockBlogPost: PageObjectResponse = {
  object: "page",
  id: "test-blog-id-123",
  created_time: "2024-01-01T00:00:00.000Z",
  last_edited_time: "2024-01-02T00:00:00.000Z",
  created_by: { object: "user", id: "user-1" },
  last_edited_by: { object: "user", id: "user-1" },
  cover: null,
  icon: null,
  parent: {
    type: "database_id",
    database_id: "test-db-id",
  },
  archived: false,
  in_trash: false,
  properties: {
    제목: {
      id: "title",
      type: "title",
      title: [
        {
          type: "text",
          text: { content: "테스트 블로그 포스트", link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
          plain_text: "테스트 블로그 포스트",
          href: null,
        },
      ],
    },
    날짜: {
      id: "date",
      type: "date",
      date: {
        start: "2024-01-01",
        end: null,
        time_zone: null,
      },
    },
    키워드: {
      id: "tags",
      type: "multi_select",
      multi_select: [
        { id: "1", name: "React", color: "blue" },
        { id: "2", name: "Testing", color: "green" },
      ],
    },
    설명: {
      id: "description",
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: { content: "테스트용 블로그 포스트 설명입니다.", link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
          plain_text: "테스트용 블로그 포스트 설명입니다.",
          href: null,
        },
      ],
    },
    숨김: {
      id: "hidden",
      type: "checkbox",
      checkbox: false,
    },
  },
  url: "https://notion.so/test",
  public_url: null,
};

export const mockProjectPost: PageObjectResponse = {
  object: "page",
  id: "test-project-id-456",
  created_time: "2024-01-01T00:00:00.000Z",
  last_edited_time: "2024-01-02T00:00:00.000Z",
  created_by: { object: "user", id: "user-1" },
  last_edited_by: { object: "user", id: "user-1" },
  cover: {
    type: "external",
    external: {
      url: "https://example.com/project-cover.jpg",
    },
  },
  icon: null,
  parent: {
    type: "database_id",
    database_id: "test-db-id",
  },
  archived: false,
  in_trash: false,
  properties: {
    제목: {
      id: "title",
      type: "title",
      title: [
        {
          type: "text",
          text: { content: "테스트 프로젝트", link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
          plain_text: "테스트 프로젝트",
          href: null,
        },
      ],
    },
    날짜: {
      id: "date",
      type: "date",
      date: {
        start: "2024-01-01",
        end: "2024-06-01",
        time_zone: null,
      },
    },
    키워드: {
      id: "tags",
      type: "multi_select",
      multi_select: [
        { id: "1", name: "Next.js", color: "blue" },
        { id: "2", name: "TypeScript", color: "purple" },
      ],
    },
    설명: {
      id: "description",
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: { content: "테스트용 프로젝트 설명입니다.", link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
          plain_text: "테스트용 프로젝트 설명입니다.",
          href: null,
        },
      ],
    },
    숨김: {
      id: "hidden",
      type: "checkbox",
      checkbox: false,
    },
    "진행 상태": {
      id: "status",
      type: "select",
      select: {
        id: "1",
        name: "완료",
        color: "green",
      },
    },
    "기술 스택": {
      id: "tech",
      type: "multi_select",
      multi_select: [
        { id: "1", name: "React", color: "blue" },
        { id: "2", name: "Node.js", color: "green" },
      ],
    },
  },
  url: "https://notion.so/test-project",
  public_url: null,
};

export const mockHiddenPost: PageObjectResponse = {
  ...mockBlogPost,
  id: "test-hidden-id-789",
  properties: {
    ...mockBlogPost.properties,
    제목: {
      id: "title",
      type: "title",
      title: [
        {
          type: "text",
          text: { content: "숨겨진 포스트", link: null },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
          plain_text: "숨겨진 포스트",
          href: null,
        },
      ],
    },
    숨김: {
      id: "hidden",
      type: "checkbox",
      checkbox: true,
    },
  },
};

/**
 * Mock Notion Client
 */
export const createMockNotionClient = () => {
  return {
    databases: {
      query: vi.fn(),
      retrieve: vi.fn(),
    },
    pages: {
      retrieve: vi.fn(),
    },
    blocks: {
      children: {
        list: vi.fn(),
      },
    },
  };
};

/**
 * Mock 응답 생성 헬퍼
 */
export const createMockQueryResponse = (results: PageObjectResponse[]) => ({
  object: "list" as const,
  results,
  next_cursor: null,
  has_more: false,
  type: "page_or_database" as const,
  page_or_database: {},
});
