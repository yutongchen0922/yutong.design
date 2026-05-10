import Link from "next/link";
import { siteConfig } from "@/content/site";
import { Clock } from "./Clock";
import { Weather } from "./Weather";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full px-6 py-5 backdrop-blur-sm">
      <nav className="mx-auto grid max-w-6xl grid-cols-3 items-center">
        <Link
          href="/"
          className="justify-self-start font-display text-xl tracking-tight hover:opacity-70 transition"
        >
          {siteConfig.name}
        </Link>

        <div className="flex items-center justify-self-center gap-3">
          <Clock />
          <Weather />
        </div>

        <ul className="flex justify-self-end gap-6 text-sm">
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
