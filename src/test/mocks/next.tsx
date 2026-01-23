import { AnchorHTMLAttributes, ImgHTMLAttributes } from "react";
import { vi } from "vitest";

/**
 * Next.js Router Mock
 */
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  pathname: "/",
  route: "/",
  query: {},
  asPath: "/",
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
};

/**
 * Next.js Navigation Mock (App Router)
 */
export const mockUsePathname = vi.fn(() => "/");
export const mockUseRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
}));
export const mockUseSearchParams = vi.fn(() => new URLSearchParams());

/**
 * Next.js Link Mock
 */
interface MockLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

export const MockLink = ({ children, href, ...props }: MockLinkProps) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

/**
 * Next.js Image Mock
 */
export const MockImage = ({
  src,
  alt,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} {...props} />;
};
