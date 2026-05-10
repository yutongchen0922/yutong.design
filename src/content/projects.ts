/**
 * Project data model.
 *
 * Edit this file to add/update case studies. Every entry that has
 * `featured: true` shows up on the home page grid. Every entry shows up
 * on /work. Each project is rendered by /work/[slug]/page.tsx using
 * its slug as the URL.
 *
 * For richer case study content (multiple sections, embedded media),
 * upgrade later to MDX — keep this file as the index/metadata.
 */

export type Project = {
  /** URL slug — used for /work/[slug] */
  slug: string;
  /** Project title shown on cards and case study page */
  title: string;
  /** Client / company / context */
  client: string;
  /** Display date, e.g. "Oct 2025" */
  date: string;
  /** Skill / type tags shown on the card */
  tags: string[];
  /** Cover image path under /public/images/projects/{slug}/ */
  cover?: string;
  /** One-line summary used on the work index and meta description */
  summary?: string;
  /** If set, card links here instead of /work/[slug] (e.g. live product) */
  externalUrl?: string;
  /** Show on the home page featured grid */
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "loonicon",
    title: "Loonicon — Balloon Personality Generator",
    client: "WindBorne Systems",
    date: "Oct 2025",
    tags: ["0 to 1", "Vibecoding", "Responsive Design"],
    summary: "TODO — write your one-liner",
    externalUrl: "https://loonicon.windbornesystems.com/",
    featured: true,
  },
  {
    slug: "mari",
    title: "Empowering employee workplace upskilling",
    client: "MARi",
    date: "Aug 2024",
    tags: ["B2B SaaS", "Business Strategy", "AI Startup"],
    summary: "TODO",
    featured: true,
  },
  {
    slug: "swiftpark",
    title: "Enhancing short-term parking efficiency",
    client: "Automotus × City of Pittsburgh",
    date: "Dec 2023",
    tags: ["UX Research", "Multi-modal Design"],
    summary: "TODO",
    featured: true,
  },
  {
    slug: "burn-boss",
    title: "Increase public acceptance of prescribed burns",
    client: "San Diego Supercomputer Center",
    date: "Oct 2022",
    tags: ["Experience Design", "Interaction Design", "Exhibition"],
    summary: "TODO",
    featured: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
