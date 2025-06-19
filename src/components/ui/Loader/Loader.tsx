import React from "react";
import Image from "next/image";
import styles from "./animation.module.css";
import { AnimatedLoadingText } from "./AnimatedLoadingText";

function Loader() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Image
        src="/images/logo.svg"
        alt="Loading"
        width={70}
        height={70}
        className={`mb-5 ${styles.bouncing}`}
        priority
      />
      <AnimatedLoadingText />
    </div>
  );
}

export default Loader;
