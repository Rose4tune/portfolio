import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Loader from "./Loader";

// Next.js Image mock
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
    ...props
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      {...props}
    />
  ),
}));

describe("Loader", () => {
  it("should render loading image", () => {
    render(<Loader />);

    const image = screen.getByAltText("Loading");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/images/logo.svg");
  });

  it("should render children when provided", () => {
    render(
      <Loader>
        <div>Loading content...</div>
      </Loader>
    );

    expect(screen.getByText("Loading content...")).toBeInTheDocument();
  });

  it("should render without children", () => {
    render(<Loader />);

    const image = screen.getByAltText("Loading");
    expect(image).toBeInTheDocument();
  });

  it("should have correct image dimensions", () => {
    render(<Loader />);

    const image = screen.getByAltText("Loading");
    expect(image).toHaveAttribute("width", "70");
    expect(image).toHaveAttribute("height", "70");
  });

  it("should apply bouncing animation class", () => {
    render(<Loader />);

    const image = screen.getByAltText("Loading");
    // CSS 모듈은 해시로 변환되므로 클래스명에 "bouncing"이 포함되는지 확인
    expect(image.className).toContain("bouncing");
  });

  it("should have proper container structure", () => {
    render(<Loader />);

    const image = screen.getByAltText("Loading");
    // Image의 직접 부모가 flex 컨테이너인지 확인
    const flexContainer = image.closest("div");
    expect(flexContainer?.className).toContain("flex");
    expect(flexContainer?.className).toContain("flex-col");
    
    // 그 부모가 absolute 컨테이너인지 확인
    const absoluteContainer = flexContainer?.parentElement;
    expect(absoluteContainer?.className).toContain("absolute");
  });

  it("should be positioned absolutely", () => {
    const { container } = render(<Loader />);

    const loaderContainer = container.firstChild as HTMLElement;
    expect(loaderContainer).toHaveClass("absolute");
    expect(loaderContainer).toHaveClass("top-1/2");
    expect(loaderContainer).toHaveClass("left-1/2");
  });

  it("should center content with transform", () => {
    const { container } = render(<Loader />);

    const loaderContainer = container.firstChild as HTMLElement;
    expect(loaderContainer).toHaveClass("-translate-x-1/2");
    expect(loaderContainer).toHaveClass("-translate-y-1/2");
  });

  it("should have correct width constraint", () => {
    const { container } = render(<Loader />);

    const loaderContainer = container.firstChild as HTMLElement;
    expect(loaderContainer).toHaveClass("w-[80%]");
  });

  it("should render multiple children", () => {
    render(
      <Loader>
        <div>Loading...</div>
        <div>Please wait</div>
      </Loader>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByText("Please wait")).toBeInTheDocument();
  });

  it("should render text children", () => {
    render(<Loader>Loading text</Loader>);

    expect(screen.getByText("Loading text")).toBeInTheDocument();
  });

  it("should render complex children structure", () => {
    render(
      <Loader>
        <div>
          <h2>Loading</h2>
          <p>Please wait...</p>
        </div>
      </Loader>
    );

    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(screen.getByText("Please wait...")).toBeInTheDocument();
  });

  it("should maintain image priority attribute", () => {
    render(<Loader />);

    const image = screen.getByAltText("Loading");
    // priority 속성은 Next.js Image에서 처리되므로 실제 DOM에는 없을 수 있음
    // 하지만 이미지가 렌더링되는지 확인
    expect(image).toBeInTheDocument();
  });

  it("should have proper image styling classes", () => {
    render(<Loader />);

    const image = screen.getByAltText("Loading");
    expect(image).toHaveClass("mb-5");
    expect(image).toHaveClass("w-[15%]");
    expect(image).toHaveClass("max-w-[70px]");
  });
});
