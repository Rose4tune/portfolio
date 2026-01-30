import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import type { ExtendedRecordMap } from "notion-types";

import NotionRenderer from "./NotionRenderer";

// react-notion-x mock – 전달된 props를 캡쳐해서 mapImageUrl 동작을 검증하기 위함
const { mockNotionRenderer, mockDefaultMapImageUrl } = vi.hoisted(() => ({
  mockNotionRenderer: vi.fn<
    (props: { mapImageUrl: (url: string, block: unknown) => string }) => void
  >(),
  // 실제 defaultMapImageUrl(url, block) 시그니처와 동일 (2인자)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- mock에서 block 인자는 사용하지 않음
  mockDefaultMapImageUrl: vi.fn((url: string, _block?: unknown) => url),
}));

vi.mock("react-notion-x", () => ({
  NotionRenderer: (props: {
    mapImageUrl: (url: string, block: unknown) => string;
  }) => {
    mockNotionRenderer(props);
    return <div data-testid="notion-renderer-mock" />;
  },
}));

// next/image mock – 단순 img 태그로 대체
vi.mock("next/image", () => ({
  default: (props: React.ComponentPropsWithoutRef<"img">) => {
    const { alt = "", ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...rest} />;
  },
}));

// next/dynamic mock – 동적으로 로드되는 컴포넌트를 간단한 더미 컴포넌트로 대체
vi.mock("next/dynamic", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: () => (props: any) => <div data-testid="dynamic-mock" {...props} />,
}));

vi.mock("notion-utils", () => ({
  defaultMapImageUrl: mockDefaultMapImageUrl,
}));

describe("NotionRenderer (mapImageUrl)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDefaultMapImageUrl.mockReset();
    mockDefaultMapImageUrl.mockImplementation((url: string) => url);
    // mapImageUrl 매칭 실패 시 출력되는 console.warn 억제 (의도된 동작)
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  const baseRecordMap: ExtendedRecordMap = {
    block: {},
    collection: {},
    collection_view: {},
    notion_user: {},
    collection_query: {},
    signed_urls: {},
  };

  it("signed_urls에 S3 URL이 있으면 해당 URL을 사용해야 한다", () => {
    const blockId = "image-block-1";
    const s3Url =
      "https://prod-files-secure.s3.us-west-2.amazonaws.com/test-image.jpg";

    const recordMap: ExtendedRecordMap = {
      ...baseRecordMap,
      signed_urls: {
        [blockId]: s3Url,
      },
    };

    render(<NotionRenderer recordMap={recordMap} />);

    expect(mockNotionRenderer).toHaveBeenCalledTimes(1);
    const [props] = mockNotionRenderer.mock.calls[0]!;

    // defaultMapImageUrl가 id 쿼리 파라미터가 포함된 URL을 반환한다고 가정
    mockDefaultMapImageUrl.mockReturnValueOnce(
      `https://www.notion.so/image/test.png?id=${blockId}`
    );

    const result = props.mapImageUrl("attachment:test", {
      value: { id: blockId },
    });

    expect(result).toBe(s3Url);
  });

  it("S3 URL이 포함된 resolvedUrl이면 그대로 반환해야 한다", () => {
    const s3Url =
      "https://prod-files-secure.s3.us-west-2.amazonaws.com/direct-image.jpg";

    const recordMap: ExtendedRecordMap = {
      ...baseRecordMap,
      signed_urls: {},
    };

    render(<NotionRenderer recordMap={recordMap} />);

    expect(mockNotionRenderer).toHaveBeenCalledTimes(1);
    const [props] = mockNotionRenderer.mock.calls[0]!;

    mockDefaultMapImageUrl.mockReturnValueOnce(s3Url);

    const result = props.mapImageUrl("attachment:direct", {
      value: { id: "some-id" },
    });

    expect(result).toBe(s3Url);
  });

  it("block.id로 signed_urls에 매칭되면 해당 S3 URL을 반환해야 한다", () => {
    const blockId = "block-with-id";
    const s3Url =
      "https://prod-files-secure.s3.us-west-2.amazonaws.com/block-id-image.jpg";

    const recordMap: ExtendedRecordMap = {
      ...baseRecordMap,
      signed_urls: { [blockId]: s3Url },
    };

    render(<NotionRenderer recordMap={recordMap} />);

    expect(mockNotionRenderer).toHaveBeenCalledTimes(1);
    const [props] = mockNotionRenderer.mock.calls[0]!;

    // resolvedUrl에 id 쿼리 없음 → URL 파싱으로 blockId 추출 불가, block.id로 매칭
    mockDefaultMapImageUrl.mockReturnValueOnce(
      "https://www.notion.so/image/another.png"
    );

    const result = props.mapImageUrl("attachment:by-block-id", {
      id: blockId,
      value: {},
    });

    expect(result).toBe(s3Url);
  });

  it("S3 URL도 없고 signed_urls에도 없으면 defaultMapImageUrl 결과를 반환해야 한다", () => {
    const mappedUrl = "https://www.notion.so/image/normal-image.png";

    const recordMap: ExtendedRecordMap = {
      ...baseRecordMap,
      signed_urls: {},
    };

    render(<NotionRenderer recordMap={recordMap} />);

    expect(mockNotionRenderer).toHaveBeenCalledTimes(1);
    const [props] = mockNotionRenderer.mock.calls[0]!;

    mockDefaultMapImageUrl.mockReturnValueOnce(mappedUrl);

    const result = props.mapImageUrl("attachment:normal", {
      value: { id: "some-id" },
    });

    expect(result).toBe(mappedUrl);
  });
});

