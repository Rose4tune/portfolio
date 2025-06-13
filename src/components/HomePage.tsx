"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import styles from "./homepage.module.css";

export default function HomePage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // 목표 각도 계산 (X축은 반대 방향으로 회전)
        targetX = -(mouseY - centerY) * 0.06;
        targetY = (mouseX - centerX) * 0.06;
      }
    };

    const animate = () => {
      // 부드러운 보간을 위한 계수
      const ease = 0.1;

      // 현재 값을 목표 값으로 부드럽게 이동
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      // transform 스타일 업데이트
      setTransformStyle(
        `perspective(1000px) 
         rotateX(${currentX}deg) 
         rotateY(${currentY}deg)`
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      animate();
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      targetX = 0;
      targetY = 0;

      // 애니메이션 중단
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // 원래 상태로 즉시 복귀
      setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg)");
    };

    const currentRef = sectionRef.current;

    if (currentRef) {
      currentRef.addEventListener("mousemove", handleMouseMove);
      currentRef.addEventListener("mouseenter", handleMouseEnter);
      currentRef.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("mousemove", handleMouseMove);
        currentRef.removeEventListener("mouseenter", handleMouseEnter);
        currentRef.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={sectionRef}
        className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8"
      >
        <div className="flex-4 space-y-6">
          <h1 className="inline-block text-3xl tracking-tight lg:text-5xl font-normal">
            YeSeo, LEE
          </h1>
          <p className="text-2xl lg:text-3xl font-light text-muted-foreground">
            안녕하세요. <br />
            개발자 이예서입니다.
          </p>
          <ul className="flex items-center gap-4">
            <li>
              <a
                href="mailto:rosefor2ne@gmail.com"
                className="text-purple-400 hover:underline"
              >
                Email
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Rose4tune"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/your-linkedin-username"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
        <div
          className={`flex-3 perspective-1000 ${styles.imageContainer}`}
          style={{
            transform: transformStyle,
            transition: "transform 0.1s ease-out",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="relative h-120 overflow-hidden rounded-full"
            style={{
              boxShadow: isHovered
                ? "0 20px 20px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.1)"
                : "0 10px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)",
            }}
          >
            <Image
              src="/images/profile.jpeg"
              alt="YeSeo Lee"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
          <ul>
            <li>Senior Software Engineer at Tech Company</li>
            <li>Full Stack Developer at Startup</li>
            <li>Freelance Web Developer</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Education</h2>
          <ul>
            <li>Bachelor&apos;s Degree in Computer Science</li>
            <li>Various online certifications and courses</li>
          </ul>
        </div>
      </div>
    </>
  );
}
