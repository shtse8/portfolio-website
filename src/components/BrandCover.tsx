"use client";

import { coverToneFor, monogram } from "@/lib/project-cover";

/**
 * Real design-system cover (not generative AI art).
 * Soft gradient panel + monogram — works beside game screenshots.
 */
export default function BrandCover({
  name,
  subtitle,
  className = "",
}: {
  name: string;
  subtitle?: string;
  className?: string;
}) {
  const tone = coverToneFor(`${name} ${subtitle ?? ""}`);
  const mono = monogram(name);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(145deg, ${tone.from} 0%, ${tone.to} 100%)`,
      }}
      aria-hidden
    >
      {/* subtle paper grain via CSS only */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "140px 140px",
        }}
      />
      {/* soft corner glow */}
      <div
        className="absolute -right-8 -top-8 h-36 w-36 rounded-full blur-2xl"
        style={{ background: tone.accent, opacity: 0.22 }}
      />
      <div
        className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full blur-2xl"
        style={{ background: tone.accent, opacity: 0.12 }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-semibold tracking-tight shadow-sm sm:h-16 sm:w-16 sm:text-xl"
          style={{
            background: "rgba(255,255,255,0.1)",
            color: tone.ink,
            border: `1px solid ${tone.accent}55`,
          }}
        >
          {mono}
        </div>
        <div
          className="max-w-[90%] truncate text-center font-mono text-[11px] font-medium tracking-wide"
          style={{ color: `${tone.ink}cc` }}
        >
          {name}
        </div>
      </div>
    </div>
  );
}
