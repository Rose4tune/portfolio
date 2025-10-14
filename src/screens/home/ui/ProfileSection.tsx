"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import styles from "./ProfileSection.module.css";
import { ReactNode } from "react";

interface ProfileSectionProps {
  children?: ReactNode;
}

export default function ProfileSection({ children }: ProfileSectionProps) {
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

        targetX = -(mouseY - centerY) * 0.06;
        targetY = (mouseX - centerX) * 0.06;
      }
    };

    const animate = () => {
      const ease = 0.1;

      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

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

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

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
    <section
      ref={sectionRef}
      className="max-w-4xl mx-auto px-8 flex flex-col items-start gap-8 text-center sm:flex-row sm:justify-between sm:relative sm:text-left"
    >
      <div className="flex-4 space-y-6 w-full sm:mt-10">
        <h1 className="inline-block text-4xl font-normal">Ye Seo, LEE</h1>
        <p className="text-xl font-light text-muted-foreground leading-[1.4]">
          안녕하세요.
          <br />
          프론트엔드 개발자 이예서입니다.
        </p>
      </div>
      <div
        className={`flex-3 perspective-1000 w-9/10 max-w-xs mx-auto my-5 sm:my-0 ${styles.imageContainer}`}
        style={{
          transform: transformStyle,
          transition: "transform 0.1s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="relative h-80 overflow-hidden rounded-full sm:h-120"
          style={{
            boxShadow: isHovered
              ? "0 20px 20px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.1)"
              : "0 10px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)",
          }}
        >
          <Image
            src="/images/profile.jpeg"
            alt="프로필 이미지"
            sizes="(max-width: 400px) 100%, (min-width: 200px) 50%"
            fill
            className="object-cover object-top rounded-full"
            priority
          />
        </div>
      </div>
      <div className="w-full xs:max-w-5/6 mx-auto sm:absolute sm:top-45 sm:max-w-1/2">
        <div className="h-12 sm:h-auto text-lg md:text-base">
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
            className="font-light text-muted-foreground block"
          />
        </div>
        <ul className="flex items-center justify-center gap-4 my-6 text-base md:text-sm text-purple-400 sm:justify-start">
          <li className="hover:underline">
            <Link href="mailto:rosefor2ne@gmail.com">Email</Link>
          </li>
          <li className="hover:underline">
            <Link href="https://github.com/Rose4tune" target="_blank">
              GitHub
            </Link>
          </li>
          <li className="hover:underline">
            <Link
              href="https://www.linkedin.com/in/ye-seo-lee-59a68b232/"
              target="_blank"
            >
              LinkedIn
            </Link>
          </li>
          {/* <li className="hover:underline">
            <Link href="/resume" rel="noopener noreferrer">
              Resume
            </Link>
          </li> */}
        </ul>
        <div className="min-h-30 relative">{children}</div>
      </div>
    </section>
  );
}
