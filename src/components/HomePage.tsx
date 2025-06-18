import { getUniqueTags } from "@/lib/notion";
import ProfileSection from "./ProfileSection";

export default async function HomePage() {
  const uniqueTags = await getUniqueTags();

  return (
    <div className="space-y-8">
      <ProfileSection uniqueTags={uniqueTags} />
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
