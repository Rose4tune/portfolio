"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./StickerLink.module.css";
interface StickerLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function StickerLink({ href, children, className }: StickerLinkProps) {
  const [isHover, setHover] = useState(false);
  const [isClicked, setClicked] = useState(false);

  return (
    <Link
      href={href}
      className={`${styles.sticker} ${className || ""} ${
        isHover ? styles.hover : ""
      } ${isClicked ? styles.clicked : ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => {
        e.preventDefault();
        setClicked(true);
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }}
    >
      {children}
    </Link>
  );
}
