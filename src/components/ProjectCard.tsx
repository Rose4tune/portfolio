import Link from "next/link";
import { Project } from "@/lib/mdx";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link href={`/projects/${project.slug}`}>
      <article className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-blue-600 dark:hover:border-blue-400 transition-colors p-6">
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        {project.description && (
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {project.description}
          </p>
        )}
        {project.tags && project.tags.length > 0 && (
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
        )}
        {project.date && (
          <time className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(project.date).toLocaleDateString()}
          </time>
        )}
      </article>
    </Link>
  );
};

export default ProjectCard;
