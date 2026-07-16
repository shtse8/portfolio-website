"use client";

import Image from "next/image";
import { useState } from "react";
import { projectArtPath } from "@/lib/project-art";
import BrandCover from "./BrandCover";

/**
 * OSS product cover: real social-card image when present, BrandCover fallback.
 * Images live at public/art/projects/{name}.jpg (README-ready twins under readme/).
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
  const art = projectArtPath(name);
  const [failed, setFailed] = useState(false);

  if (!art || failed) {
    return (
      <BrandCover name={name} subtitle={subtitle} className={className} />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={art}
        alt=""
        fill
        className="object-cover object-center"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onError={() => setFailed(true)}
      />
      {/* soft legibility wash for overlaid title chips */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
    </div>
  );
}
