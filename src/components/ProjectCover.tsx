"use client";

/**
 * OSS product cover — always shows a real image file.
 *
 * Uses native <img> (not next/image fill) so static-export cards never
 * collapse to monogram placeholders. Path SSOT: /art/projects/{repoName}.jpg
 */
export default function ProjectCover({
  name,
  className = "",
}: {
  name: string;
  subtitle?: string;
  className?: string;
}) {
  const src = `/art/projects/${name}.jpg`;

  return (
    <div
      className={`relative overflow-hidden bg-surface-sunken ${className}`}
      style={{
        // Guarantee paint even before img loads / if img fails
        backgroundImage: `url(${src}), linear-gradient(145deg, #1a2332, #2d4a6f)`,
        backgroundSize: "cover, cover",
        backgroundPosition: "center, center",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static-export reliability */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="lazy"
        decoding="async"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
    </div>
  );
}
