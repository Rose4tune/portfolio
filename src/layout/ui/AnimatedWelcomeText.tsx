"use client";

import styles from "./animation.module.css";

interface LoaderProps {
  color?: string;
}

const AnimatedWelcomeText = ({ color = "#C27AFF" }: LoaderProps) => {
  return (
    <svg
      width="100%"
      height="100%"
      fill="none"
      viewBox="0 0 480 124"
      xmlns="http://www.w3.org/2000/svg"
      className="max-w-[480px]"
    >
      <path
        stroke={color}
        className={styles.drawing}
        d="M466 112.5c-2.7 0-5-.5-7-1.5a11.8 11.8 0 0 1-6.6-11.2c0-2.3.6-4.5 1.7-6.4a12 12 0 0 1 4.6-4.6 14 14 0 0 1 7-1.8h.8c2.7 0 4.8.6 6.6 1.7 1.7 1 3 2.4 4 4.1.8 1.6 1.3 3.3 1.3 5 0 .7-.2 1.2-.7 1.6-.4.4-1 .6-1.5.6h-12.3c-.2 0-.3-.1-.3-.3 0-.2 0-.3.3-.3h12.3c.4 0 .8-.1 1.1-.4.3-.3.5-.7.5-1.2a10.1 10.1 0 0 0-5-8.6c-1.7-1-3.7-1.5-6.3-1.5h-.7c-2.6 0-4.8.5-6.8 1.6a12 12 0 0 0-4.4 4.4c-1 1.8-1.6 3.9-1.6 6.1 0 2.5.6 4.6 1.7 6.5 1.1 1.8 2.6 3.2 4.6 4.2 2 1 4.2 1.4 6.6 1.4 2.9 0 5.3-.5 7.4-1.5 2-1 3.5-2.6 4.2-4.8l.3-.2.3.1v.3c-.8 2.3-2.3 4-4.5 5.1-2.1 1-4.7 1.6-7.7 1.6Z"
      />
      {/* 나머지 path들은 원본과 동일하므로 생략 */}
    </svg>
  );
};

export default AnimatedWelcomeText;
