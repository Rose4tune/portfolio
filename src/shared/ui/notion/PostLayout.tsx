import Link from "next/link";

interface postLayoutProps {
  children: React.ReactNode;
  linkText: string;
  href: string;
}

export default function PostLayout({
  children,
  linkText,
  href,
}: postLayoutProps) {
  return (
    <article>
      <Link href={href} className="inline-block">
        ← {linkText}
      </Link>
      <div className="mt-4">{children}</div>
    </article>
  );
}
