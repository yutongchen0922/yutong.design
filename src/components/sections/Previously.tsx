import Link from "next/link";
import { siteConfig } from "@/content/site";
import { Marquee } from "@/components/ui/Marquee";

export function Previously() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <Marquee speed={24} gap={5} slowOnHover={4}>
        {siteConfig.previously.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            title={item.label}
            className="flex h-10 w-32 shrink-0 items-center justify-center opacity-50 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:h-12 md:w-40"
          >
            <img
              src={item.logo}
              alt={item.label}
              className="object-contain"
              style={{
                maxHeight: `${item.scale * 100}%`,
                maxWidth: `${item.scale * 100}%`,
              }}
            />
          </Link>
        ))}
      </Marquee>
    </section>
  );
}
