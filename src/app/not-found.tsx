"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center px-5">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[20%] top-[10%] h-[50vh] w-[50vh] rounded-full bg-accent/10 blur-[120px]" />
      </div>
      <div className="text-center">
        <div className="font-mono text-7xl font-bold tracking-tighter text-accent sm:text-8xl">
          404
        </div>
        <h1 className="mt-4 text-h2 text-text-primary">This page drifted off.</h1>
        <p className="mx-auto mt-3 max-w-sm text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist — but the rest of the site is very much alive.
        </p>
        <Link href="/" className="btn-primary btn-lg mt-8">
          <FaArrowLeft className="h-3.5 w-3.5" /> Back home
        </Link>
      </div>
    </div>
  );
}
