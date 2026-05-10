import { projects } from "@/content/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { FadeIn } from "@/components/motion/FadeIn";

export const metadata = {
  title: "Work",
  description: "Selected projects, case studies, and explorations.",
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <FadeIn>
        <h1 className="font-display text-5xl md:text-7xl">Work</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          A selection of projects from the past few years.
        </p>
      </FadeIn>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <FadeIn key={project.slug} delay={i * 0.05}>
            <ProjectCard project={project} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
