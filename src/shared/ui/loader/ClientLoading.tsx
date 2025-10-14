"use client";

import { useEffect, useState, ReactNode } from "react";
<<<<<<< HEAD
=======
<<<<<<<< HEAD:src/layout/ClientLoading.tsx
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))
<<<<<<<< HEAD:src/shared/ui/loader/ClientLoading.tsx
import Loader from "./Loader";
========
import Loader from "./ui/Loader";
<<<<<<< HEAD
=======
========
import Loader from "./Loader";
>>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16)):src/shared/ui/loader/ClientLoading.tsx
>>>>>>> 057a29a (Feat/#9 프로젝트 노션 연동 (#16))

interface ClientLoadingProps {
  children: ReactNode;
  loadingContent?: ReactNode;
}
>>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11)):src/layout/ClientLoading.tsx

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
