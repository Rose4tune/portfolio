import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import type { ExtendedRecordMap } from "notion-types";

import NotionRenderer from "./NotionRenderer";

const { mockNotionRenderer, mockDefaultMapImageUrl } = vi.hoisted(() => ({
  mockNotionRenderer: vi.fn<
    (props: { mapImageUrl: (url: string, block: unknown) => string }) => void
  >(),
  mockDefaultMapImageUrl: vi.fn((url: string) => url),
}));

vi.mock("react-notion-x", () => ({
  NotionRenderer: (props: {
    mapImageUrl: (url: string, block: unknown) => string;
  }) => {
    mockNotionRenderer(props);
    return <div data-testid="notion-renderer-mock" />;
  },
}));

vi.mock("next/image", () => ({
  default: (props: React.ComponentPropsWithoutRef<"img">) => {
    const { alt = "", ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...rest} />;
  },
}));

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
  });

  const baseRecordMap: ExtendedRecordMap = {
    block: {},
    collection: {},
    collection_view: {},
    notion_user: {},
    collection_query: {},
    signed_urls: {},
  };

  it("url이 있으면 defaultMapImageUrl(url, block) 결과를 반환해야 한다", () => {
    const mappedUrl = "https://www.notion.so/image/normal-image.png";

    render(<NotionRenderer recordMap={baseRecordMap} />);

    expect(mockNotionRenderer).toHaveBeenCalledTimes(1);
    const [props] = mockNotionRenderer.mock.calls[0]!;

    mockDefaultMapImageUrl.mockReturnValueOnce(mappedUrl);

    const result = props.mapImageUrl("attachment:normal", {
      value: { id: "some-id" },
    });

    expect(mockDefaultMapImageUrl).toHaveBeenCalledWith(
      "attachment:normal",
      expect.objectContaining({ value: { id: "some-id" } })
    );
    expect(result).toBe(mappedUrl);
  });

  it("defaultMapImageUrl이 falsy를 반환하면 원본 url을 반환해야 한다", () => {
    render(<NotionRenderer recordMap={baseRecordMap} />);

    const [props] = mockNotionRenderer.mock.calls[0]!;
    mockDefaultMapImageUrl.mockReturnValueOnce("");

    const result = props.mapImageUrl("attachment:fallback", {
      value: {},
    });

    expect(result).toBe("attachment:fallback");
  });

  it("url이 없으면 빈 문자열을 반환해야 한다", () => {
    render(<NotionRenderer recordMap={baseRecordMap} />);

    const [props] = mockNotionRenderer.mock.calls[0]!;

    const result = props.mapImageUrl("", { value: {} });

    expect(mockDefaultMapImageUrl).not.toHaveBeenCalled();
    expect(result).toBe("");
  });
});
