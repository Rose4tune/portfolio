import Image from "next/image";
<<<<<<<< HEAD:src/shared/ui/loader/Loader.tsx
import { ReactNode } from "react";
import styles from "@/styles/animation.module.css";
========
import styles from "./animation.module.css";
import { ReactNode } from "react";
>>>>>>>> f2a4627 (Refactor/#10 화면 정리하기 (#11)):src/layout/ui/Loader.tsx

interface LoadingProps {
  children?: ReactNode;
}

function Loader({ children }: LoadingProps) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%]">
      <div className="flex flex-col justify-center items-center">
        <Image
          unoptimized
          src="/images/logo.svg"
          alt="Loading"
          width={70}
          height={70}
          className={`mb-5 w-[15%] max-w-[70px] ${styles.bouncing}`}
          priority
        />
        {children}
      </div>
    </div>
  );
}

export default Loader;
