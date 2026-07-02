"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaStackOverflow } from "react-icons/fa6";
import { PERSONAL_INFO } from "@/data/personal";
import { NAV_SECTIONS } from "@/config/sections";
import DeepLink from "./DeepLink";

const SOCIALS = [
  { href: PERSONAL_INFO.social.github, label: "GitHub", Icon: FaGithub },
  { href: PERSONAL_INFO.social.linkedin, label: "LinkedIn", Icon: FaLinkedin },
  { href: PERSONAL_INFO.social.stackoverflow, label: "Stack Overflow", Icon: FaStackOverflow },
];

export default function Footer() {
  const year = 2026;
  return (
    <footer className="relative border-t border-border bg-surface-sunken">
      {/* gradient accent at top of footer */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="container-content py-14">
        {/* Closing CTA */}
        <div className="mb-14 text-center">
          <h2 className="text-h2 text-text-primary">Let&apos;s build something.</h2>
          <p className="mx-auto mt-3 max-w-md text-text-secondary">
            Whether it&apos;s MCP integrations, AI infrastructure, or scaling a platform to millions — I&apos;m open to it.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href={`mailto:${PERSONAL_INFO.email}`} className="btn-primary btn-lg">
              {PERSONAL_INFO.email}
            </a>
            <a href={PERSONAL_INFO.social.github} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-lg">
              <FaGithub className="h-[18px] w-[18px]" /> GitHub
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-10 border-t border-border pt-10 md:flex-row">
          {/* Identity */}
          <div className="max-w-sm">
            <DeepLink to="hero" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-mono text-sm font-semibold text-accent-contrast">
                KT
              </span>
              <span className="font-medium tracking-tight text-text-primary">
                {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}
              </span>
            </DeepLink>
            <p className="mt-4 text-sm text-text-secondary">
              Technical founder & builder. {PERSONAL_INFO.location.base} · {PERSONAL_INFO.location.remote}.
            </p>
            <a href={`mailto:${PERSONAL_INFO.email}`} className="link mt-3 inline-block font-mono text-sm">
              {PERSONAL_INFO.email}
            </a>
          </div>

          {/* Nav */}
          <nav className="grid grid-cols-2 gap-x-12 gap-y-2.5" aria-label="Footer">
            {NAV_SECTIONS.map((s) => (
              <DeepLink
                key={s.id}
                to={s.id}
                className="text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                {s.label}
              </DeepLink>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-6 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-text-tertiary">
            © {year} {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}. Built with Next.js · Powered by{" "}
            <a href="https://sylphx.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Sylphx</a>.
          </p>
          <div className="flex items-center gap-2">
            {SOCIALS.map(({ href, label, Icon }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-accent hover:text-accent"
              >
                <Icon className="h-[18px] w-[18px]" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
