import Link from "next/link";
import { siteConfig } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-32 border-t border-fg/10 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl">Let&rsquo;s connect</p>
          <ul className="mt-4 flex flex-col gap-1 text-sm">
            <li>
              <Link
                href={`mailto:${siteConfig.socials.email}`}
                className="hover:opacity-70 transition"
              >
                → Email
              </Link>
            </li>
            <li>
              <Link
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-70 transition"
              >
                → LinkedIn
              </Link>
            </li>
            <li>
              <Link
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-70 transition"
              >
                → Instagram
              </Link>
            </li>
          </ul>
        </div>

        <p className="text-sm text-muted">
          © {siteConfig.name} {year}
        </p>
      </div>
    </footer>
  );
}
