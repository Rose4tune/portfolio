import { describe, it, expect, vi, beforeEach } from "vitest";

import { getRecordMap } from "./getRecordMap";

const { mockGetPage, mockWithRetry } = vi.hoisted(() => ({
  mockGetPage: vi.fn(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockWithRetry: vi.fn((fn: () => Promise<any>) => fn()),
}));

vi.mock("../lib/client", () => ({
  notionClient: {
    getPage: mockGetPage,
  },
}));

vi.mock("../lib/withRetry", () => ({
  withRetry: mockWithRetry,
}));

describe("getRecordMap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Notion API recordMap을 그대로 반환해야 한다", async () => {
    const pageId = "test-page-id";
    const mockRecordMap = {
      block: {
        "block-1": { value: { type: "paragraph" } },
      },
      collection: {},
      collection_view: {},
      notion_user: {},
      collection_query: {},
      signed_urls: {},
    };

    mockGetPage.mockResolvedValue(mockRecordMap);

    const recordMap = await getRecordMap(pageId);

    expect(mockGetPage).toHaveBeenCalledWith(pageId, {
      signFileUrls: true,
    });
    expect(mockWithRetry).toHaveBeenCalled();
    expect(recordMap).toEqual(mockRecordMap);
  });
});
