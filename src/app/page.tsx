import Link from "next/link";
import { siteConfig } from "@/content/site";
import { featuredProjects } from "@/content/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { SkyBackground } from "@/components/motion/SkyBackground";
import { HeroText } from "@/components/motion/HeroText";
import { Previously } from "@/components/sections/Previously";

export default function HomePage() {
  return (
    <>
      {/* HERO with sky background */}
      <section className="relative min-h-screen overflow-hidden">
        <SkyBackground
          skyColor="#f4f6f9"
          fadeToColor="#f4f6f9"
          starColor="100, 160, 220"
          shootingStarInterval={6}
          shootingStarDuration={3}
          staticStarCount={0}
        />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <HeroText lines={siteConfig.hero} />

            <p className="mt-10">
              <Link
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block border border-fg/30 px-4 py-2 text-sm hover:bg-fg hover:text-bg transition"
              >
                Resume ↗
              </Link>
            </p>
          </div>

          <p className="mt-auto mb-24 text-base md:mb-32">
            Currently{" "}
            <Link
              href={siteConfig.currently.href}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-accent"
            >
              @{siteConfig.currently.label}
            </Link>
            <span className="text-muted">
              {" — "}
              {siteConfig.currently.tagline}
            </span>
          </p>
        </div>
      </section>

      {/* PREVIOUSLY — rolling logos of past affiliations */}
      <Previously />

      {/* FEATURED PROJECTS — outside the sky, on normal background */}
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <section>
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
    </>
  );
}
