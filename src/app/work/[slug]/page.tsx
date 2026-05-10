import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/content/projects";
import { FadeIn } from "@/components/motion/FadeIn";

type Props = {
  params: Promise<{ slug: string }>;
};

// Pre-render every case study at build time
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// Per-page metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <FadeIn>
        <p className="text-xs uppercase tracking-wider text-muted">
          {project.tags.join(" · ")}
        </p>

        <h1 className="mt-4 font-display text-4xl md:text-6xl leading-tight">
          {project.title}
        </h1>

        <p className="mt-6 text-muted">
          {project.client} · {project.date}
        </p>
      </FadeIn>

      {/* CASE STUDY CONTENT ------------------------------------------- */}
      {/* Replace this section with the actual case study writeup.
          Sections you might want: Context, Problem, Process, Solution,
          Outcome, Reflections. Use real images via next/image. */}
      <FadeIn className="mt-16 prose prose-neutral">
        <p>{project.summary}</p>

        <h2>Context</h2>
        <p>TODO — what was the situation?</p>

        <h2>Problem</h2>
        <p>TODO — what were you trying to solve?</p>

        <h2>Process</h2>
        <p>TODO — research, exploration, decisions.</p>

        <h2>Outcome</h2>
        <p>TODO — what shipped, what you learned.</p>
      </FadeIn>
    </article>
  );
}
