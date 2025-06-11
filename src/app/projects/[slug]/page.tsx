import { getProjectBySlug } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
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
        <time className="text-sm text-gray-600 dark:text-gray-400 mb-8 block">
          {new Date(project.date).toLocaleDateString()}
        </time>
      )}
      <article className="prose dark:prose-invert max-w-none">
        <MDXRemote source={project.content} />
      </article>
    </div>
  );
}
