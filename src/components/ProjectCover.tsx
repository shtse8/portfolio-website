"use client";

/**
 * OSS product banner for portfolio cards.
 *
 * SSOT files (also used as GitHub README banners):
 *   /art/projects/{repoName}.jpg
 *   /art/projects/readme/{repoName}.png
 *
 * Layout is intentionally simple: one block with explicit aspect ratio and a
 * normal flow image (no nested absolute/fill traps).
 */
export default function ProjectCover({
  name,
  className = "",
}: {
  name: string;
  subtitle?: string;
  className?: string;
}) {
  // Bump when regenerating banners so CF immutable cache cannot serve stale art.
  const src = `/art/projects/${name}.jpg?v=banner3`;

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#0f172a] ${className}`}
      style={{ aspectRatio: "16 / 10" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static export + cache-busted local art */}
      <img
        src={src}
        alt={`${name} banner`}
        width={1376}
        height={768}
        className="block h-full w-full object-cover object-center"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
