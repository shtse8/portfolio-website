"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Subtle scroll invitation at the bottom of the opening frame. */
export default function ScrollCue({ label = "Scroll" }: { label?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex flex-col items-center gap-2 sm:bottom-12"
      aria-hidden
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
        {label}
      </span>
      <span className="relative h-10 w-px overflow-hidden bg-white/20">
        <motion.span
          className="absolute inset-x-0 top-0 h-1/2 bg-[oklch(0.78_0.16_268)]"
          animate={reduce ? undefined : { y: ["-100%", "200%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    </motion.div>
  );
}
