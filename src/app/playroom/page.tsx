import { FadeIn } from "@/components/motion/FadeIn";

export const metadata = {
  title: "Playroom",
  description: "Side projects, experiments, and works-in-progress.",
};

export default function PlayroomPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <FadeIn>
        <h1 className="font-display text-5xl md:text-7xl">Playroom</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Side projects, experiments, and things I made for fun.
        </p>
      </FadeIn>

      {/* TODO — add your experiment grid / list here. */}
    </div>
  );
}
