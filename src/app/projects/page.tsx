import { getAllProjects } from "@/lib/mdx";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  );
}
