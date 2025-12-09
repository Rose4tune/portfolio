import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectScreen from "./ProjectScreen";
import { ProjectPost } from "@/domain/posts";

// Next.js navigation mock
const mockUsePathname = vi.fn(() => "/projects");
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
  default: ({ children, href, ...props }: any) => (
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

describe("ProjectScreen", () => {
  const mockProjects: ProjectPost[] = [
    {
      id: "project-1",
      title: "Portfolio Website",
      slug: "portfolio-website",
      date: "2024.01.15.",
      tags: ["Next.js", "React"],
      excerpt: "My personal portfolio website",
      content: "Full content here",
      status: "완료",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      id: "project-2",
      title: "E-commerce Platform",
      slug: "ecommerce-platform",
      date: "2024.01.10.",
      tags: ["React", "Node.js"],
      excerpt: "Online shopping platform",
      content: "Full content here",
      status: "진행중",
      techStack: ["React", "Express", "MongoDB"],
    },
    {
      id: "project-3",
      title: "Task Management App",
      slug: "task-management-app",
      date: "2024.01.05.",
      tags: ["Next.js", "TypeScript"],
      excerpt: "Team collaboration tool",
      content: "Full content here",
      status: "계획중",
      techStack: ["Next.js", "Prisma"],
    },
  ];

  const uniqueTags = ["Next.js", "React", "TypeScript", "Node.js"];

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.get.mockReturnValue(null);
    mockSearchParams.toString.mockReturnValue("");
    mockRouter.replace.mockImplementation(() => {});
  });

  it("should render all projects", () => {
    render(<ProjectScreen posts={mockProjects} uniqueTags={uniqueTags} />);

    expect(screen.getByText("Portfolio Website")).toBeInTheDocument();
    expect(screen.getByText("E-commerce Platform")).toBeInTheDocument();
    expect(screen.getByText("Task Management App")).toBeInTheDocument();
  });

  it("should render SearchFilterBar", () => {
    render(<ProjectScreen posts={mockProjects} uniqueTags={uniqueTags} />);

    const searchInput = screen.getByRole("textbox");
    expect(searchInput).toBeInTheDocument();
  });

  it("should filter projects by search query", async () => {
    const user = userEvent.setup();
    render(<ProjectScreen posts={mockProjects} uniqueTags={uniqueTags} />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "Portfolio");

    expect(screen.getByText("Portfolio Website")).toBeInTheDocument();
    expect(screen.queryByText("E-commerce Platform")).not.toBeInTheDocument();
    expect(screen.queryByText("Task Management App")).not.toBeInTheDocument();
  });

  it("should filter projects by selected tag", async () => {
    const user = userEvent.setup();
    render(<ProjectScreen posts={mockProjects} uniqueTags={uniqueTags} />);

    // "React" 태그 버튼 클릭 (SearchFilterBar의 태그 버튼)
    const reactTagButtons = screen.getAllByRole("button", { name: "React" });
    const filterBarTagButton = reactTagButtons.find((btn) =>
      btn.className.includes("rounded-full")
    );
    expect(filterBarTagButton).toBeDefined();
    if (filterBarTagButton) {
      await user.click(filterBarTagButton);
    }

    expect(screen.getByText("E-commerce Platform")).toBeInTheDocument();
    expect(screen.queryByText("Portfolio Website")).not.toBeInTheDocument();
    expect(screen.queryByText("Task Management App")).not.toBeInTheDocument();
  });

  it("should filter projects by both search and tag", async () => {
    const user = userEvent.setup();
    render(<ProjectScreen posts={mockProjects} uniqueTags={uniqueTags} />);

    // "Next.js" 태그 선택 (SearchFilterBar의 태그 버튼)
    const nextjsTagButtons = screen.getAllByRole("button", { name: "Next.js" });
    const filterBarTagButton = nextjsTagButtons.find((btn) =>
      btn.className.includes("rounded-full")
    );
    expect(filterBarTagButton).toBeDefined();
    if (filterBarTagButton) {
      await user.click(filterBarTagButton);
    }

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "Portfolio");

    expect(screen.getByText("Portfolio Website")).toBeInTheDocument();
    expect(screen.queryByText("Task Management App")).not.toBeInTheDocument();
  });

  it("should render project links with correct href", () => {
    render(<ProjectScreen posts={mockProjects} uniqueTags={uniqueTags} />);

    const firstProjectLink = screen
      .getByText("Portfolio Website")
      .closest("a");
    expect(firstProjectLink).toHaveAttribute(
      "href",
      "/projects/portfolio-website"
    );
  });

  it("should display project status when available", () => {
    render(<ProjectScreen posts={mockProjects} uniqueTags={uniqueTags} />);

    expect(screen.getByText("완료")).toBeInTheDocument();
    expect(screen.getByText("진행중")).toBeInTheDocument();
    expect(screen.getByText("계획중")).toBeInTheDocument();
  });

  it("should display project tech stack", () => {
    render(<ProjectScreen posts={mockProjects} uniqueTags={uniqueTags} />);

    expect(screen.getByText("#Next.js")).toBeInTheDocument();
    expect(screen.getByText("#TypeScript")).toBeInTheDocument();
    expect(screen.getByText("#Tailwind CSS")).toBeInTheDocument();
  });

  it("should display project tags", () => {
    render(<ProjectScreen posts={mockProjects} uniqueTags={uniqueTags} />);

    expect(screen.getAllByText("Next.js").length).toBeGreaterThan(0);
    expect(screen.getAllByText("React").length).toBeGreaterThan(0);
  });

  it("should allow clicking tags to filter", async () => {
    const user = userEvent.setup();
    render(<ProjectScreen posts={mockProjects} uniqueTags={uniqueTags} />);

    // 프로젝트 내의 태그 버튼 클릭
    const tagButtons = screen.getAllByText("Next.js");
    // SearchFilterBar의 태그가 아닌 프로젝트 내의 태그 버튼 클릭
    const projectTagButton = tagButtons.find(
      (btn) => btn.tagName === "BUTTON"
    );
    if (projectTagButton) {
      await user.click(projectTagButton);
    }

    // "Next.js" 태그로 필터링되어야 함
    expect(screen.getByText("Portfolio Website")).toBeInTheDocument();
  });

  it("should handle empty projects array", () => {
    render(<ProjectScreen posts={[]} uniqueTags={uniqueTags} />);

    const searchInput = screen.getByRole("textbox");
    expect(searchInput).toBeInTheDocument();
  });

  it("should handle projects without excerpt", () => {
    const projectsWithoutExcerpt: ProjectPost[] = [
      {
        id: "project-1",
        title: "Test Project",
        slug: "test-project",
        date: "2024.01.15.",
        tags: ["Test"],
        content: "This is the content",
      },
    ];

    render(
      <ProjectScreen posts={projectsWithoutExcerpt} uniqueTags={["Test"]} />
    );

    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("should handle projects without content or excerpt", () => {
    const projectsWithoutContent: ProjectPost[] = [
      {
        id: "project-1",
        title: "Test Project",
        slug: "test-project",
        date: "2024.01.15.",
        tags: ["Test"],
      },
    ];

    render(
      <ProjectScreen posts={projectsWithoutContent} uniqueTags={["Test"]} />
    );

    expect(screen.getByText("내용을 확인하려면 클릭하세요.")).toBeInTheDocument();
  });

  it("should handle projects without status", () => {
    const projectsWithoutStatus: ProjectPost[] = [
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
      <ProjectScreen posts={projectsWithoutStatus} uniqueTags={["Test"]} />
    );

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    // status가 없으면 status 표시 영역이 없어야 함
  });

  it("should handle projects without tech stack", () => {
    const projectsWithoutTechStack: ProjectPost[] = [
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
      <ProjectScreen posts={projectsWithoutTechStack} uniqueTags={["Test"]} />
    );

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    // techStack이 없으면 tech stack 표시 영역이 없어야 함
  });

  it("should filter tags based on search query", async () => {
    const user = userEvent.setup();
    render(<ProjectScreen posts={mockProjects} uniqueTags={uniqueTags} />);

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "Next");

    // "Next"가 포함된 태그만 표시되어야 함 (SearchFilterBar의 태그 버튼)
    const nextjsTagButtons = screen.getAllByRole("button", { name: "Next.js" });
    const filterBarTagButton = nextjsTagButtons.find((btn) =>
      btn.className.includes("rounded-full")
    );
    expect(filterBarTagButton).toBeInTheDocument();
  });
});
