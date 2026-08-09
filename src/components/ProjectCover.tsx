"use client";

import { useState } from "react";
import { localProjectArtPath } from "@/lib/project-art";

/**
 * OSS product cover for portfolio cards.
 *
 * SSOT: local Product Plate art (public/art/projects/{name}.jpg).
 * Mark live banners remain for README embeds via markBannerUrl — not card tiles.
 * Layout: explicit aspect-ratio + normal <img> (no absolute/fill traps).
 */
export default function ProjectCover({
  name,
  subtitle,
  className = "",
}: {
  name: string;
  subtitle?: string;
  className?: string;
}) {
  const src = localProjectArtPath(name);
  const [failed, setFailed] = useState(false);
  const label = subtitle?.trim() ? `${name} — ${subtitle}` : name;

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        aspectRatio: "16 / 10",
        background: failed
          ? "linear-gradient(145deg, #0f172a 0%, #1e3a5f 100%)"
          : "#0b1220",
      }}
    >
      {!failed ? (
        // biome-ignore lint/performance/noImgElement: static portfolio art with explicit dimensions (no next/image optimization in static export)
        <img
          src={src}
          alt={label}
          width={1376}
          height={768}
          className="block h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
          <div className="font-mono text-lg font-semibold tracking-tight text-white/90">
            {name}
          </div>
          <div className="font-mono text-[11px] text-white/50">open source</div>
        </div>
      )}
    </div>
  );
}
