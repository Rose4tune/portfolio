"use client";

import { useEffect, useState } from "react";
import Loader from "./Loader";

export default function ClientLoading({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (showLoader) {
    return <Loader type={"welcome"} />;
  }

  return <>{children}</>;
}
