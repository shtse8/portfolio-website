"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Restrained scroll-reveal: short fade + small rise, once.
 * Under prefers-reduced-motion we render children directly — no opacity gating —
 * so content is always visible (accessible, and never stuck invisible if an
 * in-view observer doesn't fire).
 */
export default function Reveal({
  children,
  delay = 0,
  y = 14,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
