"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress — a thin accent-colored progress bar at the very top of the
 * page that fills as the visitor scrolls. Sits above the header (z-50).
 * Uses framer-motion's useScroll + useSpring for smooth tracking.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent via-accent-hover to-accent"
      aria-hidden
    />
  );
}
