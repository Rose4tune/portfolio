"use client";

import { useEffect, useState } from "react";
import Loader from "./Loader";

export default function ClientLoading({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return showLoader ? <Loader type="welcome" /> : <>{children}</>;
}
