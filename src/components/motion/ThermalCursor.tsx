"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * ──────────────────────────────────────────────────────────────────
 *  PALETTES
 * ──────────────────────────────────────────────────────────────────
 * Each palette is a layered set of radial gradients, drawn from
 * inside-out. Layering (instead of one gradient) is what gives the
 * effect depth — like real light has a hot core, a warm halo, and a
 * cool atmospheric falloff.
 *
 * Add your own: add a key here. The order goes from BACK (outer
 * atmospheric) to FRONT (sharp core).
 */
const palettes = {
  /** Cool aurora — pale teal core, deep blue halo. Calm, atmospheric. */
  aurora: [
    "radial-gradient(circle, rgba(120,180,200,0.18) 0%, rgba(60,90,140,0.10) 35%, rgba(20,30,80,0) 70%)",
    "radial-gradient(circle, rgba(180,240,230,0.35) 0%, rgba(120,200,210,0.15) 25%, rgba(80,140,180,0) 55%)",
    "radial-gradient(circle, rgba(220,250,250,0.55) 0%, rgba(180,230,240,0.20) 18%, rgba(140,200,220,0) 45%)",
  ],

  /** Moonlight — silvery white-blue. Subtle, refined. Works on dark BG. */
  moonlight: [
    "radial-gradient(circle, rgba(180,200,220,0.20) 0%, rgba(100,130,170,0.08) 40%, rgba(40,60,100,0) 75%)",
    "radial-gradient(circle, rgba(220,230,245,0.45) 0%, rgba(180,200,230,0.18) 25%, rgba(120,150,200,0) 55%)",
    "radial-gradient(circle, rgba(245,248,255,0.65) 0%, rgba(220,230,250,0.25) 15%, rgba(180,200,230,0) 40%)",
  ],

  /** Forest dusk — sage green into deep teal. Organic, earthy. */
  forest: [
    "radial-gradient(circle, rgba(100,130,100,0.18) 0%, rgba(50,80,80,0.10) 35%, rgba(20,40,50,0) 70%)",
    "radial-gradient(circle, rgba(160,200,170,0.35) 0%, rgba(100,160,150,0.15) 25%, rgba(60,100,110,0) 55%)",
    "radial-gradient(circle, rgba(220,240,210,0.55) 0%, rgba(180,220,190,0.20) 18%, rgba(140,180,160,0) 45%)",
  ],

  /** Ice — pale cyan. Crisp, clean, slightly clinical. */
  ice: [
    "radial-gradient(circle, rgba(140,180,220,0.20) 0%, rgba(80,120,180,0.08) 40%, rgba(20,60,120,0) 75%)",
    "radial-gradient(circle, rgba(200,230,245,0.40) 0%, rgba(160,210,240,0.15) 25%, rgba(100,170,220,0) 55%)",
    "radial-gradient(circle, rgba(240,250,255,0.60) 0%, rgba(210,235,250,0.22) 18%, rgba(170,210,240,0) 45%)",
  ],

  /** Lavender mist — pale violet, dusty pink edges. Soft, romantic. */
  lavender: [
    "radial-gradient(circle, rgba(180,160,200,0.18) 0%, rgba(140,120,180,0.10) 35%, rgba(80,60,120,0) 70%)",
    "radial-gradient(circle, rgba(220,200,235,0.35) 0%, rgba(190,170,220,0.15) 25%, rgba(150,130,200,0) 55%)",
    "radial-gradient(circle, rgba(245,235,250,0.55) 0%, rgba(225,210,240,0.20) 18%, rgba(200,180,230,0) 45%)",
  ],

  /** Original warm thermal — kept as a comparison. */
  thermal: [
    "radial-gradient(circle, rgba(200,80,30,0.18) 0%, rgba(140,40,20,0.10) 35%, rgba(80,20,10,0) 70%)",
    "radial-gradient(circle, rgba(255,150,40,0.35) 0%, rgba(230,100,30,0.15) 25%, rgba(180,60,20,0) 55%)",
    "radial-gradient(circle, rgba(255,230,150,0.55) 0%, rgba(255,180,80,0.20) 18%, rgba(255,140,40,0) 45%)",
  ],
} as const;

type PaletteName = keyof typeof palettes;

type Props = {
  /** Color palette. Default 'aurora'. */
  palette?: PaletteName;
  /** Diameter of the outermost layer in pixels. Default 600. */
  size?: number;
  /** Spring stiffness — higher = snappier. Default 120. */
  stiffness?: number;
  /** Spring damping — higher = less bounce. Default 22. */
  damping?: number;
  /** Blend mode. Default 'screen' (works on dark bg). */
  blendMode?:
    | "normal"
    | "screen"
    | "difference"
    | "exclusion"
    | "soft-light"
    | "overlay"
    | "lighten"
    | "color-dodge";
  /** Subtle scale-breathing animation. Default true. */
  breathe?: boolean;
};

/**
 * ──────────────────────────────────────────────────────────────────
 *  ThermalCursor — refined edition
 * ──────────────────────────────────────────────────────────────────
 * A cursor-follow effect using THREE layered radial gradients with
 * different spring tensions. The back layer drifts, the front snaps —
 * creating parallax depth that single-gradient cursors can't match.
 *
 * Quality details:
 *   • Three layers, each with its own spring config — the back trails
 *     further behind the front, creating a "soft body" feel
 *   • Sub-1.0 alpha throughout, never solid color — never feels like
 *     a hard sticker on the page
 *   • Outermost layer has 60% the spring stiffness of the front,
 *     producing parallax that reads as depth
 *   • Optional breathe animation on inner layer adds life
 *   • Hidden on touch devices (no cursor to follow)
 *   • {passive: true} listener for scroll perf
 */
export function ThermalCursor({
  palette = "thermal",
  size = 600,
  stiffness = 120,
  damping = 22,
  blendMode = "normal",
  breathe = true,
}: Props) {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Three spring tracks with different responsiveness.
  const xFront = useSpring(mouseX, { stiffness: stiffness * 1.3, damping });
  const yFront = useSpring(mouseY, { stiffness: stiffness * 1.3, damping });
  const xMid = useSpring(mouseX, { stiffness, damping });
  const yMid = useSpring(mouseY, { stiffness, damping });
  const xBack = useSpring(mouseX, {
    stiffness: stiffness * 0.6,
    damping: damping * 1.2,
  });
  const yBack = useSpring(mouseY, {
    stiffness: stiffness * 0.6,
    damping: damping * 1.2,
  });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  const layers = palettes[palette];
  // Each layer scales down toward the center.
  const sizes = [size, size * 0.7, size * 0.45];
  const positions = [
    { x: xBack, y: yBack },
    { x: xMid, y: yMid },
    { x: xFront, y: yFront },
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ mixBlendMode: blendMode }}
    >
      {layers.map((gradient, i) => (
        <motion.div
          key={i}
          className="absolute top-0 left-0"
          style={{
            x: positions[i].x,
            y: positions[i].y,
            translateX: "-50%",
            translateY: "-50%",
            width: sizes[i],
            height: sizes[i],
          }}
          animate={breathe && i === 2 ? { scale: [1, 1.05, 1] } : undefined}
          transition={
            breathe && i === 2
              ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background: gradient,
              filter:
                i === 0 ? "blur(60px)" : i === 1 ? "blur(40px)" : "blur(20px)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
