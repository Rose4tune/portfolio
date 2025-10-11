import Image from "next/image";
import { ReactNode } from "react";
import styles from "@/styles/animation.module.css";

interface LoadingProps {
  children?: ReactNode;
}

function Loader({ children }: LoadingProps) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%]">
      <div className="flex flex-col justify-center items-center">
        <Image
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
