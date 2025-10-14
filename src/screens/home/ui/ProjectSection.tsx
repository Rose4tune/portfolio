"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ProjectPost } from "@/shared/types/notion";

export default function ProjectSection({
  projects,
}: {
  projects: ProjectPost[];
}) {
  return (
    <section className="relative px-8 mx-auto xs:max-w-5/6 sm:max-w-4xl">
      <motion.div
        initial={{
          width: 0,
          borderBottomColor: "#bebeff",
        }}
        whileInView={{
          width: "100%",
          borderBottomColor: "#fff",
        }}
        transition={{
          width: {
            duration: 0.5,
            ease: "easeInOut",
            delay: 1.5,
          },
          borderBottomColor: {
            duration: 0.4,
            ease: "easeInOut",
            delay: 4,
          },
        }}
        viewport={{ once: true }}
        className="border-b-8 pb-5 sm:pb-2"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 2.2 }}
          viewport={{ once: true }}
        >
          <Link href="/projects" className="group">
            <h2 className="w-fit mx-auto sm:mx-0 text-3xl font-normal bg-linear-[40deg,#8888ff_30%,#c27aff_50%] bg-clip-text text-transparent flex items-center gap-3">
              Featured Projects
              <span className="hidden text-sm mt-1 sm:group-hover:block bg-clip-text text-transparent transition-opacity duration-300">
                View All -&gt;
              </span>
            </h2>
          </Link>
        </motion.div>
      </motion.div>

      <div className="flex flex-col items-center xs:items-start xs:justify-center gap-6 sm:gap-y-0 xs:flex-row xs:flex-wrap">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              opacity: { duration: 0.6, ease: "easeIn", delay: i * 0.3 + 2.8 },
              y: { duration: 0.3, ease: "easeIn", delay: i * 0.3 + 2.8 },
            }}
            viewport={{ once: true }}
            className="group relative w-full h-50 rounded-xl sm:group-hover:rounded-[40px] cursor-pointer overflow-hidden sm:h-100 sm:overflow-visible sm:w-[calc(33%-1rem)]"
          >
            <Link href={`/projects/${project.slug}`}>
              <div className="h-50 rounded-xl sm:group-hover:rounded-[40px] overflow-hidden relative transition-[border-radius] duration-700 ease-in-out border border-primary-50 shadow-lg shadow-primary-100">
                <Image
                  priority
                  unoptimized
                  src={project.coverImage || "/images/test.jpeg"}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 704px"
                  className="object-cover transition-all duration-700 ease-in-out group-hover:scale-120"
                />
              </div>

              <div className="absolute inset-0 h-50 bg-linear-[40deg,#8888ffee_30%,#c27affcc_70%] sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-700 ease-in-out rounded-xl sm:group-hover:rounded-[40px]"></div>

              <div className="absolute inset-0 py-4 px-5 h-50 transform sm:translate-y-50 sm:group-hover:translate-y-0 transition-all duration-500 ease-out space-y-2 text-sm text-white font-light sm:text-gray-600 sm:group-hover:text-gray-100">
                <h3 className="text-xl font-normal sm:group-hover:text-white transition-all duration-500">
                  {project.title}
                </h3>
                <p className="transition-all duration-500">{project.excerpt}</p>
                <div className="flex flex-wrap gap-2 transition-all duration-500">
                  {project.tags?.map((tech) => (
                    <span
                      key={tech}
                      className="bg-white/20 rounded-md px-1.5 sm:bg-transparent sm:text-transparent sm:group-hover:text-gray-100 sm:group-hover:bg-white/20 transition-all duration-500"
                    >
                      #{tech}
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
