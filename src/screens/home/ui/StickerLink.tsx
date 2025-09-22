"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import styles from "./StickerLink.module.css";
import clsx from "clsx";

interface StickerLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function StickerLink({
  href,
  children,
  className,
}: StickerLinkProps) {
  const [isHover, setHover] = useState(false);
  const [isClicked, setClicked] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setClicked(true);

    setTimeout(() => {
      window.location.href = href;
    }, 300);

    timeoutRef.current = setTimeout(() => {
      setClicked(false);
    }, 499);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={clsx(
        styles.sticker,
        className,
        isHover && styles.hover,
        isClicked && styles.clicked
      )}
    >
      {children}
    </Link>
  );
}
