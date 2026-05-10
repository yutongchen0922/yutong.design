"use client";

import { useEffect, useState } from "react";

type Props = {
  /** Lines to type out sequentially. */
  lines: readonly string[];
  /** Milliseconds per character. Default 40. */
  speed?: number;
  /** Pause between lines in ms. Default 400. */
  linePause?: number;
  /** Render function — receives the array of currently visible text per line. */
  children: (visibleLines: string[]) => React.ReactNode;
};

export function Typewriter({
  lines,
  speed = 40,
  linePause = 400,
  children,
}: Props) {
  const [visibleLines, setVisibleLines] = useState<string[]>(
    () => lines.map(() => "")
  );

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setVisibleLines([...lines]);
      return;
    }

    let cancelled = false;
    let lineIdx = 0;
    let charIdx = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;

      if (lineIdx >= lines.length) return;

      const currentLine = lines[lineIdx];

      if (charIdx <= currentLine.length) {
        setVisibleLines((prev) => {
          const next = [...prev];
          next[lineIdx] = currentLine.slice(0, charIdx);
          return next;
        });
        charIdx++;
        timeout = setTimeout(tick, speed);
      } else {
        lineIdx++;
        charIdx = 0;
        if (lineIdx < lines.length) {
          timeout = setTimeout(tick, linePause);
        }
      }
    };

    timeout = setTimeout(tick, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [lines, speed, linePause]);

  return <>{children(visibleLines)}</>;
}
