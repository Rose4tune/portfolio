import clsx from "clsx";
import Link from "next/link";

interface postLayoutProps {
  children: React.ReactNode;
  linkText: string;
  href: string;
  className?: string;
}

export default function PostLayout({
  children,
  className,
  linkText,
  href,
}: postLayoutProps) {
  return (
    <article>
      <Link href={href} className="inline-block">
        ← {linkText}
      </Link>
      <div className={clsx("mt-4", className)}>{children}</div>
    </article>
  );
}
