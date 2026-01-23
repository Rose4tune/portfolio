import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  PropsWithChildren,
} from "react";
import { vi } from "vitest";

/**
 * Framer Motion Mock
 * 테스트에서는 애니메이션을 실행하지 않고 즉시 렌더링합니다
 */

export const mockMotion = {
  div: ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>{children}</div>
  ),
  span: ({ children, ...props }: HTMLAttributes<HTMLSpanElement>) => (
    <span {...props}>{children}</span>
  ),
  section: ({ children, ...props }: HTMLAttributes<HTMLElement>) => (
    <section {...props}>{children}</section>
  ),
  nav: ({ children, ...props }: HTMLAttributes<HTMLElement>) => (
    <nav {...props}>{children}</nav>
  ),
  button: ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
  a: ({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
};

export const mockAnimatePresence = ({ children }: PropsWithChildren) => (
  <>{children}</>
);

export const mockUseAnimation = vi.fn(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  set: vi.fn(),
}));

export const mockUseInView = vi.fn(() => [null, false]);
