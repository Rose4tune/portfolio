import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Fortune's Cookie",
  description: "Front-developer YeSeo, LEE portfolio and blog",
};

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-4 space-y-6">
          <h1 className="inline-block text-3xl tracking-tight lg:text-5xl font-normal">
            YeSeo, LEE
          </h1>
          <p className="text-2xl lg:text-3xl font-light text-muted-foreground">
            안녕하세요. <br />
            {/* 재밌는걸 좋아하는, <br />
            성장을 추구하는, <br />
            어제보다 하나더 알고싶은, <br /> */}
            개발자 이예서입니다.
          </p>
          <ul className="flex items-center gap-4">
            <li>
              <a
                href="mailto:rosefor2ne@gmail.com"
                className="text-primary hover:underline"
              >
                Email
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Rose4tune"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/your-linkedin-username"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
        <div className="flex-3 relative h-120 overflow-hidden rounded-full">
          <Image
            src="/images/profile.jpeg"
            alt="YeSeo Lee"
            fill
            className="object-cover"
            priority
          />
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
