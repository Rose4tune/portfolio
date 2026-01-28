import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogScreen from "./BlogScreen";
import { BlogPost } from "@/domain/posts";

// Next.js navigation mock
const mockUsePathname = vi.fn(() => "/blog");
const mockRouter = {
  replace: vi.fn(),
  push: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
};

const mockSearchParams = {
  get: vi.fn(),
  toString: vi.fn(() => ""),
};

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams,
}));

// Next.js Link mock
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.ComponentPropsWithoutRef<"a"> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// getPreviewText mock
vi.mock("@/shared/lib/utils", () => ({
  getPreviewText: vi.fn((text: string, maxLength?: number) => {
    if (!text) return "";
    return text.length > (maxLength || 60)
      ? `${text.slice(0, maxLength || 60)}...`
      : text;
  }),
}));

describe("BlogScreen", () => {
  const mockPosts: BlogPost[] = [
    {
      id: "post-1",
      title: "React Testing Guide",
      slug: "react-testing-guide",
      date: "2024.01.15.",
      tags: ["React", "Testing"],
      excerpt: "Learn how to test React components",
      content: "Full content here",
    },
    {
      id: "post-2",
      title: "TypeScript Tips",
      slug: "typescript-tips",
      date: "2024.01.10.",
      tags: ["TypeScript", "JavaScript"],
      excerpt: "Advanced TypeScript patterns",
      content: "Full content here",
    },
    {
      id: "post-3",
      title: "Next.js 15 Features",
      slug: "nextjs-15-features",
      date: "2024.01.05.",
      tags: ["Next.js", "React"],
      excerpt: "What's new in Next.js 15",
      content: "Full content here",
    },
  ];

  const uniqueTags = ["React", "Testing", "TypeScript", "JavaScript", "Next.js"];

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.get.mockReturnValue(null);
    mockSearchParams.toString.mockReturnValue("");
    mockRouter.replace.mockImplementation(() => {});
  });

  it("should render all blog posts", () => {
    render(<BlogScreen posts={mockPosts} uniqueTags={uniqueTags} />);

    expect(screen.getByText("React Testing Guide")).toBeInTheDocument();
    expect(screen.getByText("TypeScript Tips")).toBeInTheDocument();
    expect(screen.getByText("Next.js 15 Features")).toBeInTheDocument();
  });

  it("should render SearchFilterBar", () => {
    render(<BlogScreen posts={mockPosts} uniqueTags={uniqueTags} />);

    // SearchFilterBar가 렌더링되었는지 확인 (TagFilter가 있으면 됨)
    const searchInput = screen.getByRole("textbox");
    expect(searchInput).toBeInTheDocument();
  });

  it("should filter posts by search query", async () => {
    const user = userEvent.setup();
    render(<BlogScreen posts={mockPosts} uniqueTags={uniqueTags} />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "React");

    // "React"가 제목이나 내용에 포함된 포스트만 표시되어야 함
    expect(screen.getByText("React Testing Guide")).toBeInTheDocument();
    // "Next.js 15 Features"는 제목에 "React"가 없으므로 표시되지 않아야 함
    expect(screen.queryByText("Next.js 15 Features")).not.toBeInTheDocument();
    expect(screen.queryByText("TypeScript Tips")).not.toBeInTheDocument();
  });

  it("should filter posts by selected tag", async () => {
    const user = userEvent.setup();
    render(<BlogScreen posts={mockPosts} uniqueTags={uniqueTags} />);

    // "React" 태그 버튼 클릭 (SearchFilterBar의 태그 버튼)
    const reactTagButtons = screen.getAllByRole("button", { name: "React" });
    const filterBarTagButton = reactTagButtons.find((btn) =>
      btn.className.includes("rounded-full")
    );
    expect(filterBarTagButton).toBeDefined();
    if (filterBarTagButton) {
      await user.click(filterBarTagButton);
    }

    // "React" 태그가 있는 포스트만 표시되어야 함
    expect(screen.getByText("React Testing Guide")).toBeInTheDocument();
    expect(screen.getByText("Next.js 15 Features")).toBeInTheDocument();
    expect(screen.queryByText("TypeScript Tips")).not.toBeInTheDocument();
  });

  it("should filter posts by both search and tag", async () => {
    const user = userEvent.setup();
    render(<BlogScreen posts={mockPosts} uniqueTags={uniqueTags} />);

    // "React" 태그 선택 (SearchFilterBar의 태그 버튼)
    const reactTagButtons = screen.getAllByRole("button", { name: "React" });
    const filterBarTagButton = reactTagButtons.find((btn) =>
      btn.className.includes("rounded-full")
    );
    expect(filterBarTagButton).toBeDefined();
    if (filterBarTagButton) {
      await user.click(filterBarTagButton);
    }

    // 검색어 입력
    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "Testing");

    // "React" 태그와 "Testing" 검색어가 모두 포함된 포스트만 표시
    expect(screen.getByText("React Testing Guide")).toBeInTheDocument();
    expect(screen.queryByText("Next.js 15 Features")).not.toBeInTheDocument();
    expect(screen.queryByText("TypeScript Tips")).not.toBeInTheDocument();
  });

  it("should render post links with correct href", () => {
    render(<BlogScreen posts={mockPosts} uniqueTags={uniqueTags} />);

    const firstPostLink = screen.getByText("React Testing Guide").closest("a");
    expect(firstPostLink).toHaveAttribute("href", "/blog/react-testing-guide");
  });

  it("should display post excerpt when available", () => {
    render(<BlogScreen posts={mockPosts} uniqueTags={uniqueTags} />);

    expect(screen.getByText("Learn how to test React components")).toBeInTheDocument();
  });

  it("should display post tags", () => {
    render(<BlogScreen posts={mockPosts} uniqueTags={uniqueTags} />);

    // 태그가 여러 곳에 표시되므로 getAllByText 사용
    expect(screen.getAllByText("React").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Testing").length).toBeGreaterThan(0);
  });

  it("should allow clicking tags to filter", async () => {
    const user = userEvent.setup();
    render(<BlogScreen posts={mockPosts} uniqueTags={uniqueTags} />);

    // 포스트 내의 태그 버튼 클릭
    const postTags = screen.getAllByText("React");
    // 첫 번째는 SearchFilterBar의 태그, 두 번째는 포스트 내의 태그
    const postTagButton = postTags[1];
    await user.click(postTagButton);

    // "React" 태그로 필터링되어야 함
    expect(screen.getByText("React Testing Guide")).toBeInTheDocument();
  });

  it("should display formatted date", () => {
    render(<BlogScreen posts={mockPosts} uniqueTags={uniqueTags} />);

    // 날짜가 표시되어야 함 (포맷팅된 형태)
    const dateElements = screen.getAllByText(/2024/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it("should handle empty posts array", () => {
    render(<BlogScreen posts={[]} uniqueTags={uniqueTags} />);

    // 포스트가 없어도 SearchFilterBar는 표시되어야 함
    const searchInput = screen.getByRole("textbox");
    expect(searchInput).toBeInTheDocument();
  });

  it("should handle posts without excerpt", () => {
    const postsWithoutExcerpt: BlogPost[] = [
      {
        id: "post-1",
        title: "Test Post",
        slug: "test-post",
        date: "2024.01.15.",
        tags: ["Test"],
        content: "This is the content",
      },
    ];

    render(<BlogScreen posts={postsWithoutExcerpt} uniqueTags={["Test"]} />);

    // excerpt가 없으면 content의 preview가 표시되어야 함
    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });

  it("should handle posts without content or excerpt", () => {
    const postsWithoutContent: BlogPost[] = [
      {
        id: "post-1",
        title: "Test Post",
        slug: "test-post",
        date: "2024.01.15.",
        tags: ["Test"],
      },
    ];

    render(<BlogScreen posts={postsWithoutContent} uniqueTags={["Test"]} />);

    expect(screen.getByText("내용을 확인하려면 클릭하세요.")).toBeInTheDocument();
  });

  it("should filter tags based on search query", async () => {
    const user = userEvent.setup();
    render(<BlogScreen posts={mockPosts} uniqueTags={uniqueTags} />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "React");

    // "React"가 포함된 태그만 표시되어야 함 (SearchFilterBar의 태그 버튼)
    const reactTagButtons = screen.getAllByRole("button", { name: "React" });
    const filterBarTagButton = reactTagButtons.find((btn) =>
      btn.className.includes("rounded-full")
    );
    expect(filterBarTagButton).toBeInTheDocument();
  });
});
