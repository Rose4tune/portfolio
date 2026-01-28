import { describe, it, expect, vi, beforeEach } from "vitest";

import { getRecordMap } from "./getRecordMap";

// notionClient (notion-client) mock
const mockGetPage = vi.fn();

vi.mock("../lib/client", () => ({
  notionClient: {
    getPage: mockGetPage,
  },
}));

// withRetry mock – 전달 받은 함수를 바로 실행하도록 단순화
const mockWithRetry = vi.fn(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (fn: () => Promise<any>) => fn()
);

vi.mock("../lib/withRetry", () => ({
  withRetry: mockWithRetry,
}));

// @notionhq/client wrapper mock (notionHQClient)
const mockBlocksRetrieve = vi.fn();
const mockPagesRetrieve = vi.fn();

vi.mock("@/domain/posts/lib/notionClient", () => ({
  notionHQClient: {
    blocks: {
      retrieve: mockBlocksRetrieve,
    },
    pages: {
      retrieve: mockPagesRetrieve,
    },
  },
}));

describe("getRecordMap (이미지 관련)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("이미지 블록에 대해 S3 URL을 recordMap.signed_urls에 추가해야 한다", async () => {
    const pageId = "test-page-id";
    const imageBlockId = "image-block-1";

    // notion-client 에서 반환하는 기본 recordMap mock
    mockGetPage.mockResolvedValue({
      block: {
        [imageBlockId]: {
          value: {
            type: "image",
          },
        },
      },
      signed_urls: {},
    });

    // @notionhq/client blocks.retrieve 응답 mock (S3 URL 포함)
    mockBlocksRetrieve.mockResolvedValue({
      object: "block",
      id: imageBlockId,
      type: "image",
      image: {
        type: "file",
        file: {
          url: "https://prod-files-secure.s3.us-west-2.amazonaws.com/test-image.jpg",
        },
      },
    });

    // pages.retrieve는 이 테스트에선 사용되지 않으므로 기본 mock
    mockPagesRetrieve.mockResolvedValue({});

    const recordMap = await getRecordMap(pageId);

    // signFileUrls 옵션이 true로 전달되었는지 확인
    expect(mockGetPage).toHaveBeenCalledWith(pageId, {
      signFileUrls: true,
    });

    // enhanceImageUrls 로직에 의해 signed_urls에 S3 URL이 추가되었는지 확인
    expect(recordMap.signed_urls[imageBlockId]).toBe(
      "https://prod-files-secure.s3.us-west-2.amazonaws.com/test-image.jpg"
    );

    // withRetry가 호출되었는지도 함께 보장
    expect(mockWithRetry).toHaveBeenCalled();
  });

  it("페이지 커버 이미지에 대해 S3 URL을 recordMap.signed_urls에 추가해야 한다", async () => {
    const pageId = "test-page-id-cover";

    mockGetPage.mockResolvedValue({
      block: {},
      signed_urls: {},
    });

    // blocks.retrieve는 이 테스트에선 사용되지 않으므로 noop
    mockBlocksRetrieve.mockResolvedValue({});

    // @notionhq/client pages.retrieve 응답 mock (커버 S3 URL 포함)
    mockPagesRetrieve.mockResolvedValue({
      object: "page",
      id: pageId,
      cover: {
        type: "file",
        file: {
          url: "https://prod-files-secure.s3.us-west-2.amazonaws.com/cover-image.jpg",
        },
      },
    });

    const recordMap = await getRecordMap(pageId);

    // 커버 이미지 S3 URL이 페이지 ID를 키로 signed_urls에 저장되어야 함
    expect(recordMap.signed_urls[pageId]).toBe(
      "https://prod-files-secure.s3.us-west-2.amazonaws.com/cover-image.jpg"
    );
  });
}

