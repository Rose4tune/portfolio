"use client";

import { usePathname } from "next/navigation";
import AnimatedLayout from "./AnimatedLayout";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (isHomePage) {
    return <AnimatedLayout>{children}</AnimatedLayout>;
  }

  return (
    <div className="container">
      <AnimatedLayout>{children}</AnimatedLayout>
    </div>
  );
}
