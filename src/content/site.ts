/**
 * Site-wide configuration.
 * Edit this file to change your name, tagline, social links, and nav.
 */

export const siteConfig = {
  name: "Yutong Chen",
  shortName: "yutong",
  tagline: "Roaming curiosity keeps pulling me toward new questions.",
  hero: [
    "Roaming curiosity keeps pulling me toward new questions.",
    "I stay with them until I find the shape of the answer.",
    "Then, I design, build, and ship.",
  ],
  description:
    "Roaming curiosity keeps pulling me toward new questions. I stay with them until I find the shape of the answer. Then I design, build, and ship.",
  url: "https://yutong.design",

  // Hero "currently"
  currently: {
    label: "WindBorne Systems",
    href: "https://windbornesystems.com/",
    tagline: "Building products that reduce weather uncertainty for humanity.",
  },

  // "Previously" carousel — under the hero.
  // `scale` is a per-logo size multiplier (1 = fill the bounding box; <1 shrinks
  // a logo that has tight crop; >1 grows one that has whitespace baked in).
  previously: [
    {
      label: "CMU HCII",
      href: "https://cmu-eheart-lab.github.io/",
      logo: "/logos/cmu-hcii.png",
      scale: 1,
    },
    {
      label: "UCSD Design Lab",
      href: "https://designlab.ucsd.edu/",
      logo: "/logos/ucsd-design-lab.png",
      scale: 1,
    },
    {
      label: "WIFIRE Lab",
      href: "https://scil.ucsd.edu/wifire",
      logo: "/logos/wifire-lab.png",
      scale: 2,
    },
    {
      label: "Kuaishou",
      href: "https://www.kuaishou.com/en",
      logo: "/logos/kuaishou.png",
      scale: 0.55,
    },
  ],

  // External resume link (Google Drive, PDF, etc.)
  resumeUrl:
    "https://drive.google.com/file/d/1u62RSDXl8fAmKwbpotiwnHpkh1nCYpY2/view?usp=sharing",

  // Footer / contact
  socials: {
    email: "yutongchendesign@gmail.com",
    linkedin: "https://www.linkedin.com/in/-yutong-chen-",
    instagram: "https://www.instagram.com/yutongtaro_c/",
  },

  // Top nav items
  nav: [
    { label: "work", href: "/work" },
    { label: "about", href: "/about" },
    { label: "playroom", href: "/playroom" },
    { label: "gallery", href: "/gallery" },
  ],
} as const;
