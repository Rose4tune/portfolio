import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HomeScreen from "./HomeScreen";
import { ProjectPost } from "@/domain/posts";

// Next.js navigation mock
const mockUsePathname = vi.fn(() => "/");

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

// Next.js Link mock
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Next.js Image mock
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Framer Motion mock
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// TypeAnimation mock
vi.mock("react-type-animation", () => ({
  default: ({ sequence, className }: any) => (
    <span className={className} data-testid="type-animation">
      {typeof sequence[0] === "string" ? sequence[0] : ""}
    </span>
  ),
}));

// lucide-react mock
vi.mock("lucide-react", () => ({
  RefreshCw: () => <svg data-testid="refresh-icon" />,
}));

describe("HomeScreen", () => {
  const mockProjects: ProjectPost[] = [
    {
      id: "project-1",
      title: "Portfolio Website",
      slug: "portfolio-website",
      date: "2024.01.15.",
      tags: ["Next.js", "React"],
      excerpt: "My personal portfolio",
      content: "Full content",
      status: "완료",
      techStack: ["Next.js", "TypeScript"],
      coverImage: "https://example.com/cover.jpg",
    },
    {
      id: "project-2",
      title: "E-commerce App",
      slug: "ecommerce-app",
      date: "2024.01.10.",
      tags: ["React", "Node.js"],
      excerpt: "Online shopping platform",
      content: "Full content",
      status: "진행중",
      techStack: ["React", "Express"],
    },
  ];

  const initialTags = ["React", "Next.js", "TypeScript", "Node.js"];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue("/");
  });

  it("should render ProfileSection", () => {
    render(<HomeScreen initialTags={initialTags} initialProjects={mockProjects} />);

    expect(screen.getByText("Ye Seo, LEE")).toBeInTheDocument();
    expect(screen.getByText(/안녕하세요/)).toBeInTheDocument();
    expect(screen.getByText(/프론트엔드 개발자 이예서입니다/)).toBeInTheDocument();
  });

  it("should render ProjectSection", () => {
    render(<HomeScreen initialTags={initialTags} initialProjects={mockProjects} />);

    expect(screen.getByText("Featured Projects")).toBeInTheDocument();
    expect(screen.getByText("Portfolio Website")).toBeInTheDocument();
    expect(screen.getByText("E-commerce App")).toBeInTheDocument();
  });

  it("should render RandomKeywordCloud with keywords", () => {
    render(<HomeScreen initialTags={initialTags} initialProjects={mockProjects} />);

    // RandomKeywordCloud가 렌더링되었는지 확인
    // 키워드들이 링크로 렌더링되어야 함
    const keywordLinks = screen.getAllByRole("link");
    const blogLinks = keywordLinks.filter((link) =>
      link.getAttribute("href")?.includes("/blog?tag=")
    );
    expect(blogLinks.length).toBeGreaterThan(0);
  });

  it("should render project links with correct href", () => {
    render(<HomeScreen initialTags={initialTags} initialProjects={mockProjects} />);

    const projectLink = screen.getByText("Portfolio Website").closest("a");
    expect(projectLink).toHaveAttribute("href", "/projects/portfolio-website");
  });

  it("should render project excerpts", () => {
    render(<HomeScreen initialTags={initialTags} initialProjects={mockProjects} />);

    expect(screen.getByText("My personal portfolio")).toBeInTheDocument();
    expect(screen.getByText("Online shopping platform")).toBeInTheDocument();
  });

  it("should render project tags", () => {
    render(<HomeScreen initialTags={initialTags} initialProjects={mockProjects} />);

    expect(screen.getByText("#Next.js")).toBeInTheDocument();
    expect(screen.getByText("#React")).toBeInTheDocument();
  });

  it("should handle empty projects array", () => {
    render(<HomeScreen initialTags={initialTags} initialProjects={[]} />);

    expect(screen.getByText("Featured Projects")).toBeInTheDocument();
    // 프로젝트가 없어도 섹션은 표시되어야 함
  });

  it("should handle empty tags array", () => {
    render(<HomeScreen initialTags={[]} initialProjects={mockProjects} />);

    expect(screen.getByText("Ye Seo, LEE")).toBeInTheDocument();
    expect(screen.getByText("Featured Projects")).toBeInTheDocument();
  });

  it("should render profile links", () => {
    render(<HomeScreen initialTags={initialTags} initialProjects={mockProjects} />);

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
  });

  it("should render projects with cover images", () => {
    render(<HomeScreen initialTags={initialTags} initialProjects={mockProjects} />);

    const images = screen.getAllByRole("img");
    const projectImages = images.filter((img) =>
      ["Portfolio Website", "E-commerce App"].includes(img.getAttribute("alt") || "")
    );
    expect(projectImages.length).toBeGreaterThan(0);
  });

  it("should handle projects without cover images", () => {
    const projectsWithoutCover: ProjectPost[] = [
      {
        id: "project-1",
        title: "Test Project",
        slug: "test-project",
        date: "2024.01.15.",
        tags: ["Test"],
        excerpt: "Test excerpt",
        content: "Test content",
      },
    ];

    render(
      <HomeScreen initialTags={initialTags} initialProjects={projectsWithoutCover} />
    );

    // coverImage가 없어도 기본 이미지가 표시되어야 함
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
  });

  it("should update when pathname changes", () => {
    const { rerender } = render(
      <HomeScreen initialTags={initialTags} initialProjects={mockProjects} />
    );

    mockUsePathname.mockReturnValue("/blog");
    rerender(<HomeScreen initialTags={initialTags} initialProjects={mockProjects} />);

    // pathname이 변경되어도 컴포넌트는 정상적으로 렌더링되어야 함
    expect(screen.getByText("Ye Seo, LEE")).toBeInTheDocument();
  });
});
