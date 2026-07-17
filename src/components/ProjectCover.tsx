"use client";

import { useState } from "react";
import { markBannerUrl } from "@/lib/project-art";

/**
 * OSS product banner for portfolio cards.
 *
 * SSOT: https://mark.sylphx.com/api/v1/banner (Sylphx Mark live SVG)
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
  const src = markBannerUrl(name, { description: subtitle });
  const [failed, setFailed] = useState(false);

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
        // eslint-disable-next-line @next/next/no-img-element -- Mark live SVG banners
        <img
          src={src}
          alt={`${name} banner via Sylphx Mark`}
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
