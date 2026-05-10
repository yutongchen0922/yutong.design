import Link from "next/link";
import { siteConfig } from "@/content/site";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full px-6 py-5 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl tracking-tight hover:opacity-70 transition"
        >
          {siteConfig.name}
        </Link>

        <ul className="flex gap-6 text-sm">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:opacity-70 transition">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
