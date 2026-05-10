"use client";

import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  /** Hover slows the animation by this factor (e.g. 4 = 4× slower). */
  slowOnHover?: number;
  gap?: number;
};

// Number of times `children` repeats inside each "half" of the track. The
// animation translates by -50% (one half-width), so the second half lands
// exactly where the first started — seamless loop. We render 2 copies per
// half so each half is wide enough to fill any reasonable viewport; without
// this, when one copy is narrower than the viewport, you'd see an empty gap
// on the right edge between the end of one loop and the start of the next.
const COPIES_PER_HALF = 2;

export function Marquee({
  children,
  speed = 35,
  direction = "right",
  slowOnHover,
  gap = 3,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationDirection = direction === "right" ? "reverse" : "normal";
  const groupStyle = { gap: `${gap}rem`, paddingRight: `${gap}rem` };

  // Adjust the running CSS animation's playbackRate via the Web Animations
  // API. Unlike changing animation-duration, playbackRate updates take effect
  // smoothly mid-flight — no visual jump.
  const handleEnter = () => {
    if (!slowOnHover) return;
    const el = trackRef.current;
    if (!el) return;
    for (const a of el.getAnimations()) {
      a.playbackRate = 1 / slowOnHover;
    }
  };

  const handleLeave = () => {
    if (!slowOnHover) return;
    const el = trackRef.current;
    if (!el) return;
    for (const a of el.getAnimations()) {
      a.playbackRate = 1;
    }
  };

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        ref={trackRef}
        className="flex w-max"
        style={{
          animation: `marquee-scroll ${speed}s linear infinite ${animationDirection}`,
        }}
      >
        {Array.from({ length: COPIES_PER_HALF * 2 }).map((_, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center"
            style={groupStyle}
            aria-hidden={i > 0}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
