import { FadeIn } from "@/components/motion/FadeIn";

export const metadata = {
  title: "Gallery",
  description: "Visual work — illustrations, photography, and other artifacts.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <FadeIn>
        <h1 className="font-display text-5xl md:text-7xl">Gallery</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Visual work, sketches, and things I make outside of work.
        </p>
      </FadeIn>

      {/* TODO — add your masonry / grid of images here using next/image. */}
    </div>
  );
}
