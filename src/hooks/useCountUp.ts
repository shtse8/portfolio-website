"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useCountUp — animates a number from 0 to `target` over `duration` ms.
 * Uses requestAnimationFrame with an ease-out curve. Respects prefers-reduced-motion
 * (jumps to target instantly). Starts when `start` flips to true (e.g. on scroll reveal).
 */
export function useCountUp(target: number, duration = 1200, start = true): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;

    // Check prefers-reduced-motion
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      return;
    }

    startTime.current = null;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic

    const tick = (now: number) => {
      if (startTime.current === null) startTime.current = now;
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.floor(ease(progress) * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, start]);

  return value;
}
