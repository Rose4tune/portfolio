"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const projects = [
  {
    title: "ToTasty",
    desc: "시음회를 기반으로 한 소셜 모임 플랫폼. FSD 구조 기반으로 설계했습니다.",
    tech: ["Next.js", "TanStack Query", "Supabase"],
  },
  {
    title: "Travel Pins",
    desc: "핀보드를 활용한 여행지 공유 앱입니다.",
    tech: ["React", "Redux Toolkit"],
  },
  {
    title: "Geek Blog",
    desc: "기술 정보와 최신 뉴스를 다루는 블로그입니다.",
    tech: ["Astro", "Tailwind CSS", "Contentful"],
  },
];

export default function ProjectSection() {
  return (
    <section className="relative px-8 mx-auto xs:max-w-5/6 sm:max-w-4xl">
      <motion.div
        initial={{ borderBottomColor: "#bebeff" }}
        whileInView={{ borderBottomColor: "#fff" }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
          delay: 1.5,
        }}
        viewport={{ once: true }}
        className="border-b-8 pb-5 sm:pb-2"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 1 }}
          viewport={{ once: true }}
        >
          <Link href="/projects" className="group">
            <h2 className="w-fit mx-auto sm:mx-0 text-3xl font-normal bg-linear-[40deg,#8888ff_30%,#c27aff_50%] bg-clip-text text-transparent opacity-80 flex items-center gap-3">
              Featured Projects
              <span className="opacity-0 text-sm mt-1 sm:group-hover:opacity-100 bg-clip-text text-transparent transition-opacity duration-300">
                View All -&gt;
              </span>
            </h2>
          </Link>
        </motion.div>
      </motion.div>

      <div className="flex flex-col items-center xs:items-start xs:justify-center gap-6 sm:gap-y-0 xs:flex-row xs:flex-wrap overflow-hidden">
        {projects.map((p, i) => (
          <motion.div
            key={`${p.title}-${i}`}
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.3 }}
            viewport={{ once: true }}
            className="group relative w-full h-50 rounded-xl sm:group-hover:rounded-[40px] cursor-pointer overflow-hidden sm:h-100 sm:overflow-visible sm:w-[calc(33%-1rem)]"
          >
            <Link href={`/projects/${p.title}`}>
              <div className="h-50 rounded-xl sm:group-hover:rounded-[40px] overflow-hidden relative transition-[border-radius] duration-700 ease-in-out">
                <Image
                  priority
                  src={"/images/test.jpeg"}
                  alt={p.title}
                  fill
                  className="object-cover transition-all duration-700 ease-in-out group-hover:scale-120"
                />
              </div>

              <div className="absolute inset-0 h-50 bg-linear-[40deg,#8888ffdd_30%,#c27affdd_70%] sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-700 ease-in-out rounded-xl sm:group-hover:rounded-[40px]"></div>

              <div className="absolute inset-0 py-4 px-5 h-50 transform sm:translate-y-50 sm:group-hover:translate-y-0 transition-all duration-500 ease-out space-y-2 text-sm text-white font-light sm:text-gray-600 sm:group-hover:text-gray-200">
                <h3 className="text-xl font-normal sm:group-hover:text-white transition-all duration-500">
                  {p.title}
                </h3>
                <p className="transition-all duration-500">{p.desc}</p>
                <div className="flex flex-wrap gap-2 transition-all duration-500">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="bg-white/20 rounded-md px-1.5 sm:bg-transparent sm:text-transparent sm:group-hover:text-gray-200 sm:group-hover:bg-white/20 transition-all duration-500"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
