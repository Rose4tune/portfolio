import Image from "next/image";
import styles from "@/styles/animation.module.css";
import AnimatedLoadingText from "./ui/AnimatedLoadingText";
import AnimatedWelcomeText from "./ui/AnimatedWelcomeText";

interface LoadingProps {
  type?: "default" | "welcome";
}

function Loader({ type = "default" }: LoadingProps) {
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
        {type === "default" ? <AnimatedLoadingText /> : <AnimatedWelcomeText />}
      </div>
    </div>
  );
}

export default Loader;
