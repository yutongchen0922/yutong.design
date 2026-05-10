"use client";

import { useEffect, useRef } from "react";

/**
 * ──────────────────────────────────────────────────────────────────
 *  SkyBackground
 * ──────────────────────────────────────────────────────────────────
 * A soft "sky" backdrop for the homepage hero — pale denim gradient
 * that fades into your normal background, with a faint static
 * starfield and occasional light-blue shooting stars streaking
 * diagonally across.
 *
 * USAGE:
 *   Place at the top of your hero section as the very first child:
 *
 *     <section className="relative min-h-screen">
 *       <SkyBackground />
 *       <div className="relative z-10">
 *         ...your hero content...
 *       </div>
 *     </section>
 *
 *   The component is absolute-positioned — its parent must be
 *   `position: relative` (Tailwind `relative`) for it to fill that
 *   parent. Hero content must have `relative z-10` (or any z-index
 *   above 0) so it sits ON TOP of the sky.
 */

type Props = {
  /** Top color of the sky gradient. Default pale denim. */
  skyColor?: string;
  /** Color the sky fades into at the bottom. Match your page bg. Default off-white. */
  fadeToColor?: string;
  /** Color of stars (both static + shooting). Default light blue. */
  starColor?: string;
  /** Number of static (non-moving) stars in the sky. Default 50. */
  staticStarCount?: number;
  /** Average seconds between shooting stars. Default 5.5 (range ±2). */
  shootingStarInterval?: number;
  /** How long each shooting star lives, in seconds. Default 1.5. */
  shootingStarDuration?: number;
  /** Diagonal angle in degrees from horizontal. Default 25 (down-and-left). */
  shootingStarAngle?: number;
};

type StaticStar = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
};

type ShootingStar = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number; // 0 to 1 (life progress)
  length: number;
};

export function SkyBackground({
  skyColor = "#cdd9e6",
  fadeToColor = "#fafaf7",
  starColor = "168, 200, 224", // RGB tuple, used in rgba() — light blue
  staticStarCount = 50,
  shootingStarInterval = 5.5,
  shootingStarDuration = 1.5,
  shootingStarAngle = 25,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) return;

    let dpr = window.devicePixelRatio || 1;
    let staticStars: StaticStar[] = [];
    let shootingStars: ShootingStar[] = [];
    let nextShootingStarTime = 0;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      staticStars = Array.from({ length: staticStarCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.4 + Math.random() * 1.2,
        opacity: 0.2 + Math.random() * 0.5,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const spawnShootingStar = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const angleRad = (shootingStarAngle * Math.PI) / 180;
      const travel = Math.max(width, height) * 0.8;
      const speed = travel / shootingStarDuration;

      shootingStars.push({
        x: width * 0.4 + Math.random() * width * 0.6,
        y: Math.random() * height * 0.5,
        vx: -Math.cos(angleRad) * speed,
        vy: Math.sin(angleRad) * speed,
        age: 0,
        length: 60 + Math.random() * 40,
      });
    };

    let lastFrameTime = performance.now();

    const loop = (now: number) => {
      const dtSec = (now - lastFrameTime) / 1000;
      lastFrameTime = now;

      const { width, height } = canvas.getBoundingClientRect();

      ctx.clearRect(0, 0, width, height);

      for (const star of staticStars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${starColor}, ${star.opacity})`;
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        if (now > nextShootingStarTime) {
          spawnShootingStar();
          nextShootingStarTime =
            now + (shootingStarInterval + (Math.random() * 4 - 2)) * 1000;
        }

        shootingStars = shootingStars.filter((s) => {
          s.x += s.vx * dtSec;
          s.y += s.vy * dtSec;
          s.age += dtSec / shootingStarDuration;

          if (s.age >= 1) return false;

          const angle = Math.atan2(s.vy, s.vx);
          const tailX = s.x - Math.cos(angle) * s.length;
          const tailY = s.y - Math.sin(angle) * s.length;

          const lifeOpacity =
            s.age < 0.2
              ? s.age / 0.2
              : s.age > 0.7
              ? 1 - (s.age - 0.7) / 0.3
              : 1;

          const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
          gradient.addColorStop(0, `rgba(${starColor}, ${0.35 * lifeOpacity})`);
          gradient.addColorStop(0.3, `rgba(${starColor}, ${0.2 * lifeOpacity})`);
          gradient.addColorStop(1, `rgba(${starColor}, 0)`);

          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.2;
          ctx.lineCap = "round";
          ctx.stroke();

          // Draw a small 4-pointed star at the head.
          const r = 4;
          const rInner = 1.5;
          ctx.beginPath();
          for (let p = 0; p < 4; p++) {
            const outerAngle = (p * Math.PI) / 2 - Math.PI / 2;
            const innerAngle = outerAngle + Math.PI / 4;
            const ox = s.x + Math.cos(outerAngle) * r;
            const oy = s.y + Math.sin(outerAngle) * r;
            const ix = s.x + Math.cos(innerAngle) * rInner;
            const iy = s.y + Math.sin(innerAngle) * rInner;
            if (p === 0) ctx.moveTo(ox, oy);
            else ctx.lineTo(ox, oy);
            ctx.lineTo(ix, iy);
          }
          ctx.closePath();
          ctx.fillStyle = `rgba(${starColor}, ${0.7 * lifeOpacity})`;
          ctx.fill();

          return true;
        });
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [
    starColor,
    staticStarCount,
    shootingStarInterval,
    shootingStarDuration,
    shootingStarAngle,
  ]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
