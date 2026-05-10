import Link from "next/link";
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
};

/**
 * Project card — links internally to /work/[slug] OR externally if
 * the project has an `externalUrl`. Visual design is deliberately
 * minimal here; bring your own.
 */
export function ProjectCard({ project }: Props) {
  const href = project.externalUrl ?? `/work/${project.slug}`;
  const isExternal = Boolean(project.externalUrl);

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className="group block rounded-card border border-fg/10 p-6 transition hover:border-fg/30"
    >
      <p className="text-xs uppercase tracking-wider text-muted">
        {project.tags.join(" · ")}
      </p>

      <h3 className="mt-2 font-display text-2xl leading-tight">
        {project.title}
      </h3>

      <p className="mt-4 text-sm text-muted">
        {project.client} · {project.date}
      </p>
    </Link>
  );
}
