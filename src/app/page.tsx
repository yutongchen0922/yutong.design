import Link from "next/link";
import { siteConfig } from "@/content/site";
import { featuredProjects } from "@/content/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { FadeIn } from "@/components/motion/FadeIn";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      {/* HERO ---------------------------------------------------------- */}
      <section className="max-w-3xl">
        <p className="text-lg text-muted">hey,</p>

        <h1 className="mt-2 font-display text-5xl leading-tight md:text-7xl">
          I&rsquo;m {siteConfig.name}
        </h1>

        <div className="mt-8 space-y-2 text-base">
          <p>
            Currently{" "}
            <Link
              href={siteConfig.currently.href}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-accent"
            >
              @{siteConfig.currently.label}
            </Link>
          </p>

          <p className="text-muted">
            Previously{" "}
            {siteConfig.previously.map((p, i) => (
              <span key={p.href}>
                <Link
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 hover:text-fg"
                >
                  @{p.label}
                </Link>
                {i < siteConfig.previously.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>

        <p className="mt-8">
          <Link
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block border border-fg/30 px-4 py-2 text-sm hover:bg-fg hover:text-bg transition"
          >
            Resume ↗
          </Link>
        </p>
      </section>

      {/* BIO ----------------------------------------------------------- */}
      <FadeIn className="mt-24 max-w-2xl">
        <p className="text-xl leading-relaxed">
          A product designer and researcher passionate about crafting
          innovative experiences. Replace this paragraph with your own
          bio — keep it short, two or three sentences max.
        </p>
      </FadeIn>

      {/* FEATURED PROJECTS -------------------------------------------- */}
      <section className="mt-24">
        <FadeIn>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-3xl md:text-4xl">
              Featured Projects
            </h2>
            <Link
              href="/work"
              className="text-sm text-muted hover:text-fg transition"
            >
              View all →
            </Link>
          </div>
        </FadeIn>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project, i) => (
            <FadeIn key={project.slug} delay={i * 0.05}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
