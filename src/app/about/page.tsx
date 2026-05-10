import { FadeIn } from "@/components/motion/FadeIn";

export const metadata = {
  title: "About",
  description: "About me — background, interests, and how I work.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <FadeIn>
        <h1 className="font-display text-5xl md:text-7xl">About</h1>
      </FadeIn>

      <FadeIn className="mt-12 space-y-6 text-lg leading-relaxed">
        <p>
          TODO — write your about page. A few paragraphs on background,
          how you work, what you&rsquo;re curious about.
        </p>
      </FadeIn>
    </div>
  );
}
