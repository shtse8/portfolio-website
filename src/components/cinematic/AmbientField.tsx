"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * AmbientField — volumetric light plates for cinematic depth.
 * Slow drift when motion is allowed; static when reduced-motion is preferred.
 */
export default function AmbientField({
  variant = "hero",
}: {
  variant?: "hero" | "story" | "work";
}) {
  const reduce = useReducedMotion();

  const plates =
    variant === "hero"
      ? [
          {
            className: "left-[-10%] top-[-20%] h-[70vh] w-[70vh] bg-accent/14",
            duration: 22,
            dx: 40,
            dy: -28,
          },
          {
            className: "right-[-8%] top-[15%] h-[55vh] w-[55vh] bg-accent/10",
            duration: 28,
            dx: -32,
            dy: 22,
          },
          {
            className: "bottom-[-15%] left-[25%] h-[40vh] w-[50vh] bg-accent/8",
            duration: 24,
            dx: 18,
            dy: -14,
          },
        ]
      : variant === "story"
        ? [
            {
              className: "left-[5%] top-[10%] h-[50vh] w-[50vh] bg-accent/8",
              duration: 26,
              dx: 20,
              dy: -16,
            },
            {
              className: "right-[0%] bottom-[5%] h-[45vh] w-[45vh] bg-accent/6",
              duration: 30,
              dx: -18,
              dy: 12,
            },
          ]
        : [
            {
              className: "right-[-5%] top-[20%] h-[40vh] w-[40vh] bg-accent/7",
              duration: 24,
              dx: -14,
              dy: 10,
            },
          ];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-20 dark:opacity-25" />
      {plates.map((p) => (
        <motion.div
          key={p.className}
          className={`absolute rounded-full blur-[100px] sm:blur-[130px] ${p.className}`}
          animate={
            reduce
              ? undefined
              : {
                  x: [0, p.dx, 0],
                  y: [0, p.dy, 0],
                  scale: [1, 1.06, 1],
                }
          }
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Horizon line — subtle film frame cue */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border/80 to-transparent" />
    </div>
  );
}
