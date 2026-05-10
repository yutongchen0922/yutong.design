"use client";

import { Typewriter } from "@/components/motion/Typewriter";

const styledWords: Record<string, string> = {
  design: "font-display italic",
  build: "font-pixel uppercase",
};

function formatHeroLine(text: string) {
  const pattern = new RegExp(`(${Object.keys(styledWords).join("|")})`, "g");
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    styledWords[part] ? (
      <span key={i} className={styledWords[part]}>{part}</span>
    ) : (
      part
    )
  );
}

type Props = {
  lines: readonly string[];
};

export function HeroText({ lines }: Props) {
  return (
    <Typewriter lines={lines}>
      {(visible) => (
        <div className="font-display">
          <p className="font-mono text-lg leading-relaxed md:text-2xl md:leading-relaxed text-muted whitespace-nowrap">
            {visible[0]}
            {visible[0] !== undefined && visible[0].length < lines[0].length && (
              <span className="inline-block w-[2px] h-[1em] bg-muted align-text-bottom ml-0.5 animate-pulse" />
            )}
          </p>
          <p className="font-mono text-lg leading-relaxed md:text-2xl md:leading-relaxed text-muted whitespace-nowrap">
            {visible[1]}
            {visible[1] !== undefined && visible[1].length > 0 && visible[1].length < lines[1].length && (
              <span className="inline-block w-[2px] h-[1em] bg-muted align-text-bottom ml-0.5 animate-pulse" />
            )}
          </p>
          <h1 className="mt-3 text-3xl leading-snug md:text-5xl md:leading-snug">
            {visible[2] !== undefined && formatHeroLine(visible[2])}
            {visible[2] !== undefined && visible[2].length > 0 && visible[2].length < lines[2].length && (
              <span className="inline-block w-[2px] h-[1.1em] bg-fg align-text-bottom ml-0.5 animate-pulse" />
            )}
          </h1>
        </div>
      )}
    </Typewriter>
  );
}
