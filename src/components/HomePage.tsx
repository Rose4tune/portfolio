"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import styles from "./homepage.module.css";
import { RandomKeywordCloud } from "@/components/ui/RandomKeywordCloud";
import { usePathname } from "next/navigation";

export default function HomePage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);
  const pathname = usePathname();

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
    <div className="space-y-8">
      <section
        ref={sectionRef}
        className="flex flex-col items-start gap-8 sm:flex-row sm:justify-between sm:relative"
      >
        <div className="flex-4 space-y-3">
          <h1 className="inline-block text-3xl tracking-tight lg:text-5xl font-normal">
            YeSeo, LEE
          </h1>
          <p className="text-2xl lg:text-3xl font-light text-muted-foreground leading-[1.4]">
            안녕하세요. <br />
            개발자 이예서입니다.
          </p>
        </div>
        <div
          className={`flex-3 perspective-1000 w-9/10 max-w-xs mx-auto my-0 sm:my-4 ${styles.imageContainer}`}
          style={{
            transform: transformStyle,
            transition: "transform 0.1s ease-out",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="relative h-100 overflow-hidden rounded-full sm:h-120"
            style={{
              boxShadow: isHovered
                ? "0 20px 20px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.1)"
                : "0 10px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)",
            }}
          >
            <Image
              src="/images/profile.jpeg"
              alt="YeSeo Lee"
              sizes="(max-width: 400px) 100%, (min-width: 200px) 50%"
              fill
              className="object-cover object-top rounded-full"
              priority
            />
          </div>
        </div>
        <div className="w-full sm:absolute sm:top-33 lg:top-43 sm:max-w-1/2">
          <div className="h-15">
            <TypeAnimation
              sequence={[
                "글로 풀어내며 스스로 더 깊이 이해하려고 합니다.",
                1000,
                "기술을 탐구하고 공유하는 것을 좋아합니다.",
                1000,
                "코드로 생각을 실현하는 과정이 가장 재미있습니다.",
                1000,
                "대화와 협업을 통해 더 좋은 결과를 만들고자 합니다.",
                1000,
                "사용자와 동료를 모두 고려하는 개발자가 되고 싶습니다.",
                1000,
                "머리로만 아는 것보다 직접 만들어보는 걸 선호합니다.",
                1000,
                "동작 원리를 이해하고 응용하는 데 즐거움을 느낍니다.",
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-lg lg:text-xl font-light text-muted-foreground block"
            />
          </div>
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
                href="https://www.linkedin.com/in/ye-seo-lee-59a68b232/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline"
              >
                LinkedIn
              </a>
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1">
            <RandomKeywordCloud key={pathname} />
          </div>
        </div>
      </section>
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
  );
}
