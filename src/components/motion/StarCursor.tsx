"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const STAR_PATH =
  "M12 2.75L14.35 9.65L21.25 12L14.35 14.35L12 21.25L9.65 14.35L2.75 12L9.65 9.65L12 2.75Z";

const GHOSTS = [
  { stiffnessMul: 0.55, dampingMul: 1.6, opacity: 0.18, scale: 0.92 },
  { stiffnessMul: 0.35, dampingMul: 1.8, opacity: 0.12, scale: 0.82 },
  { stiffnessMul: 0.2, dampingMul: 2.0, opacity: 0.07, scale: 0.7 },
];

type Props = {
  size?: number;
  color?: string;
  stroke?: string;
  stiffness?: number;
  damping?: number;
  hideNativeCursor?: boolean;
};

export function StarCursor({
  size = 22,
  color = "#ff5722",
  stroke = "rgba(0,0,0,0.12)",
  stiffness = 500,
  damping = 35,
  hideNativeCursor = true,
}: Props) {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const x = useSpring(mouseX, { stiffness, damping });
  const y = useSpring(mouseY, { stiffness, damping });

  const g0x = useSpring(mouseX, { stiffness: stiffness * GHOSTS[0].stiffnessMul, damping: damping * GHOSTS[0].dampingMul });
  const g0y = useSpring(mouseY, { stiffness: stiffness * GHOSTS[0].stiffnessMul, damping: damping * GHOSTS[0].dampingMul });
  const g1x = useSpring(mouseX, { stiffness: stiffness * GHOSTS[1].stiffnessMul, damping: damping * GHOSTS[1].dampingMul });
  const g1y = useSpring(mouseY, { stiffness: stiffness * GHOSTS[1].stiffnessMul, damping: damping * GHOSTS[1].dampingMul });
  const g2x = useSpring(mouseX, { stiffness: stiffness * GHOSTS[2].stiffnessMul, damping: damping * GHOSTS[2].dampingMul });
  const g2y = useSpring(mouseY, { stiffness: stiffness * GHOSTS[2].stiffnessMul, damping: damping * GHOSTS[2].dampingMul });

  const ghostPositions = [
    { x: g0x, y: g0y },
    { x: g1x, y: g1y },
    { x: g2x, y: g2y },
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    const updateEnabled = () => setEnabled(mediaQuery.matches);

    updateEnabled();
    mediaQuery.addEventListener("change", updateEnabled);

    return () => mediaQuery.removeEventListener("change", updateEnabled);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (event: PointerEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      setVisible(true);
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, [enabled, mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <>
      {hideNativeCursor && (
        <style>{`
          @media (pointer: fine) {
            body,
            body * {
              cursor: none !important;
            }
          }
        `}</style>
      )}

      {GHOSTS.map((ghost, i) => (
        <motion.div
          key={i}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-100"
          style={{
            x: ghostPositions[i].x,
            y: ghostPositions[i].y,
            width: size * ghost.scale,
            height: size * ghost.scale,
            opacity: visible ? ghost.opacity : 0,
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-full w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={STAR_PATH} fill={color} />
          </svg>
        </motion.div>
      ))}

      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-100"
        style={{
          x,
          y,
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ scale: visible ? [1, 1.08, 1] : 0.8 }}
        transition={{ scale: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } }}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-full w-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={STAR_PATH}
            fill={color}
            stroke={stroke}
            strokeLinejoin="round"
            strokeWidth="1.25"
          />
        </svg>
      </motion.div>
    </>
  );
}
