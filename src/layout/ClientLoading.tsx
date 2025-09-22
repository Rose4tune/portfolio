"use client";

import { useEffect, useState, ReactNode } from "react";
import Loader from "./ui/Loader";

interface ClientLoadingProps {
  children: ReactNode;
  loadingContent?: ReactNode;
}

export default function ClientLoading({
  children,
  loadingContent,
}: ClientLoadingProps) {
  const [showLoader, setShowLoader] = useState<boolean | null>(null);

  useEffect(() => {
    const isFirstRender = sessionStorage.getItem("isFirstRender");

    if (!isFirstRender) {
      setShowLoader(true);

      const timer = setTimeout(() => {
        setShowLoader(false);
        sessionStorage.setItem("isFirstRender", "true");
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, []);

  if (showLoader === null) return null;

  return showLoader ? <Loader>{loadingContent}</Loader> : <>{children}</>;
}
