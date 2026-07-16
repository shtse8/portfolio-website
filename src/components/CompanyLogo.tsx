"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Company mark tile — full-bleed square with modest rounded corners.
 * Avoid circular frames + padded square marks (nested shape look).
 */
export default function CompanyLogo({
  src,
  alt,
  size = 56,
  className,
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl border border-border bg-surface shadow-sm",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
