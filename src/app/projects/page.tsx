import { allProjects } from "contentlayer/generated";
import Link from "next/link";

export default function ProjectsPage() {
  const projects = allProjects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const workProjects = projects.filter(
    (project) => project.projectType === "team"
  );
  const funProjects = projects.filter(
    (project) => project.projectType === "personal"
  );

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group"
            >
              <article className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-blue-600 dark:hover:border-blue-400 transition-colors">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <time className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(project.date).toLocaleDateString()}
                  </time>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Fun</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group"
            >
              <article className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-blue-600 dark:hover:border-blue-400 transition-colors">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <time className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(project.date).toLocaleDateString()}
                  </time>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
