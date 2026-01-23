import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TagButton from "./TagButton";

describe("TagButton", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render tag text", () => {
    render(
      <TagButton tag="React" selectedTag={null} onClick={mockOnClick} />
    );

    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("should render '전체' when tag is null", () => {
    render(
      <TagButton tag={null} selectedTag={null} onClick={mockOnClick} />
    );

    expect(screen.getByText("전체")).toBeInTheDocument();
  });

  it("should apply selected styles when tag is selected", () => {
    render(
      <TagButton tag="React" selectedTag="React" onClick={mockOnClick} />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-purple-100");
    expect(button).toHaveClass("text-purple-500");
  });

  it("should apply unselected styles when tag is not selected", () => {
    render(
      <TagButton tag="React" selectedTag="Vue" onClick={mockOnClick} />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gray-100");
    expect(button).toHaveClass("text-gray-300");
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    render(
      <TagButton tag="React" selectedTag={null} onClick={mockOnClick} />
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should be accessible with button role", () => {
    render(
      <TagButton tag="React" selectedTag={null} onClick={mockOnClick} />
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should handle multiple clicks", async () => {
    const user = userEvent.setup();
    render(
      <TagButton tag="React" selectedTag={null} onClick={mockOnClick} />
    );

    const button = screen.getByRole("button");
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });

  it("should render different tags correctly", () => {
    const { rerender } = render(
      <TagButton tag="React" selectedTag={null} onClick={mockOnClick} />
    );

    expect(screen.getByText("React")).toBeInTheDocument();

    rerender(
      <TagButton tag="Vue" selectedTag={null} onClick={mockOnClick} />
    );

    expect(screen.getByText("Vue")).toBeInTheDocument();
    expect(screen.queryByText("React")).not.toBeInTheDocument();
  });

  it("should update styles when selection changes", () => {
    const { rerender } = render(
      <TagButton tag="React" selectedTag={null} onClick={mockOnClick} />
    );

    let button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gray-100");

    rerender(
      <TagButton tag="React" selectedTag="React" onClick={mockOnClick} />
    );

    button = screen.getByRole("button");
    expect(button).toHaveClass("bg-purple-100");
  });

  it("should handle empty string tag", () => {
    render(
      <TagButton tag="" selectedTag={null} onClick={mockOnClick} />
    );

    // 빈 문자열이면 "전체"가 표시되어야 함
    expect(screen.getByText("전체")).toBeInTheDocument();
  });

  it("should have transition classes for animations", () => {
    render(
      <TagButton tag="React" selectedTag={null} onClick={mockOnClick} />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("transition-all");
    expect(button).toHaveClass("duration-150");
    expect(button).toHaveClass("transform");
  });

  it("should have hover and active states", () => {
    render(
      <TagButton tag="React" selectedTag={null} onClick={mockOnClick} />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:scale-105");
    expect(button).toHaveClass("active:scale-90");
  });
});
