import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";

// Next.js navigation mock
const mockUsePathname = vi.fn(() => "/");
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
};

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => mockRouter,
}));

// Next.js Link mock
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Lucide icons mock
vi.mock("lucide-react", () => ({
  Menu: () => <svg data-testid="menu-icon" />,
  X: () => <svg data-testid="close-icon" />,
}));

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue("/");
  });

  it("should render navigation items", () => {
    render(<Navbar />);

    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("should not show logo on home page", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Navbar />);

    expect(screen.queryByText("YeSeo LEE")).not.toBeInTheDocument();
  });

  it("should show logo on non-home pages", () => {
    mockUsePathname.mockReturnValue("/blog");
    render(<Navbar />);

    expect(screen.getByText("YeSeo LEE")).toBeInTheDocument();
  });

  it("should highlight active blog page", () => {
    mockUsePathname.mockReturnValue("/blog");
    render(<Navbar />);

    const blogLink = screen.getByText("Blog").closest("a");
    expect(blogLink).toHaveClass("text-purple-400");
  });

  it("should highlight active blog post page", () => {
    mockUsePathname.mockReturnValue("/blog/my-post");
    render(<Navbar />);

    const blogLink = screen.getByText("Blog").closest("a");
    expect(blogLink).toHaveClass("text-purple-400");
  });

  it("should highlight active projects page", () => {
    mockUsePathname.mockReturnValue("/projects");
    render(<Navbar />);

    const projectsLink = screen.getByText("Projects").closest("a");
    expect(projectsLink).toHaveClass("text-purple-400");
  });

  it("should highlight active project detail page", () => {
    mockUsePathname.mockReturnValue("/projects/my-project");
    render(<Navbar />);

    const projectsLink = screen.getByText("Projects").closest("a");
    expect(projectsLink).toHaveClass("text-purple-400");
  });

  it("should not highlight inactive pages", () => {
    mockUsePathname.mockReturnValue("/blog");
    render(<Navbar />);

    const projectsLink = screen.getByText("Projects").closest("a");
    expect(projectsLink).not.toHaveClass("text-purple-400");
  });

  it("should show menu icon when mobile menu is closed", () => {
    render(<Navbar />);

    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("close-icon")).not.toBeInTheDocument();
  });

  it("should toggle mobile menu when button is clicked", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const menuButton = screen.getByRole("button", { name: /open main menu/i });
    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();

    await user.click(menuButton);

    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("menu-icon")).not.toBeInTheDocument();
  });

  it("should show mobile menu when opened", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const menuButton = screen.getByRole("button", { name: /open main menu/i });
    await user.click(menuButton);

    // 모바일 메뉴가 표시되어야 함
    const mobileMenu = screen.getByText("Blog").closest("div");
    expect(mobileMenu?.parentElement).toHaveClass("block");
  });

  it("should hide mobile menu when closed", () => {
    render(<Navbar />);

    // 초기 상태에서는 숨겨져 있어야 함
    const mobileMenuContainer = document.querySelector(
      ".md\\:hidden.fixed"
    );
    expect(mobileMenuContainer).toHaveClass("hidden");
  });

  it("should close mobile menu when link is clicked", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    // 메뉴 열기
    const menuButton = screen.getByRole("button", { name: /open main menu/i });
    await user.click(menuButton);

    expect(screen.getByTestId("close-icon")).toBeInTheDocument();

    // 모바일 메뉴의 링크 클릭
    const blogLink = screen.getAllByText("Blog")[1]; // 모바일 메뉴의 링크
    await user.click(blogLink);

    // 메뉴가 닫혀야 함
    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
  });

  it("should have correct href attributes for navigation links", () => {
    render(<Navbar />);

    const blogLink = screen.getByText("Blog").closest("a");
    const projectsLink = screen.getByText("Projects").closest("a");
    const aboutLink = screen.getByText("About").closest("a");

    expect(blogLink).toHaveAttribute("href", "/blog");
    expect(projectsLink).toHaveAttribute("href", "/projects");
    expect(aboutLink).toHaveAttribute("href", "/");
  });

  it("should have desktop menu hidden on mobile", () => {
    render(<Navbar />);

    const desktopMenu = screen
      .getByText("Blog")
      .closest(".hidden.md\\:flex");
    expect(desktopMenu).toBeInTheDocument();
  });

  it("should have mobile menu button visible on mobile", () => {
    render(<Navbar />);

    const mobileButton = screen.getByRole("button", {
      name: /open main menu/i,
    });
    expect(mobileButton.closest(".flex.md\\:hidden")).toBeInTheDocument();
  });

  it("should handle multiple menu toggles", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const menuButton = screen.getByRole("button", { name: /open main menu/i });

    // 열기
    await user.click(menuButton);
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();

    // 닫기
    await user.click(menuButton);
    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();

    // 다시 열기
    await user.click(menuButton);
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
  });

  it("should have proper ARIA attributes", () => {
    render(<Navbar />);

    const menuButton = screen.getByRole("button", { name: /open main menu/i });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("should have screen reader text for menu button", () => {
    render(<Navbar />);

    expect(screen.getByText("Open main menu")).toBeInTheDocument();
  });

  it("should apply correct styles for active mobile menu items", async () => {
    const user = userEvent.setup();
    mockUsePathname.mockReturnValue("/blog");
    render(<Navbar />);

    const menuButton = screen.getByRole("button", { name: /open main menu/i });
    await user.click(menuButton);

    const mobileBlogLink = screen.getAllByText("Blog")[1];
    expect(mobileBlogLink.closest("a")).toHaveClass("text-purple-400");
  });
});
