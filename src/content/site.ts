/**
 * Site-wide configuration.
 * Edit this file to change your name, tagline, social links, and nav.
 */

export const siteConfig = {
  name: "Your Name",
  shortName: "you",
  tagline: "Product designer & researcher",
  description:
    "Personal portfolio of [Your Name], a product designer and researcher.",
  url: "https://your-domain.com",

  // Hero "currently / previously"
  currently: {
    label: "Company Name",
    href: "https://example.com",
  },
  previously: [
    { label: "Previous Org 1", href: "https://example.com" },
    { label: "Previous Org 2", href: "https://example.com" },
    { label: "Previous Org 3", href: "https://example.com" },
  ],

  // External resume link (Google Drive, PDF, etc.)
  resumeUrl: "https://example.com/resume.pdf",

  // Footer / contact
  socials: {
    email: "you@example.com",
    linkedin: "https://www.linkedin.com/in/your-handle",
    instagram: "https://www.instagram.com/your-handle",
  },

  // Top nav items
  nav: [
    { label: "work", href: "/work" },
    { label: "about", href: "/about" },
    { label: "playroom", href: "/playroom" },
    { label: "gallery", href: "/gallery" },
  ],
} as const;
