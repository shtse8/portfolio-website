"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { FaArrowUpRightFromSquare, FaGithub, FaXmark } from "react-icons/fa6";
import { ORGANIZATIONS } from "@/data/organizations";
import { PROJECTS } from "@/data/projects";
import { getRole, getRolesByOrganization } from "@/data/roles";
import type { Organization } from "@/data/types";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

const ORG_ORDER = ["sylphx", "epiow", "cubeage", "minimax", "nakuz"] as const;

/**
 * Companies — clickable org cards with detail modal (logo, story, links, related work).
 */
export default function Companies() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const orgs = ORG_ORDER.map((id) => ORGANIZATIONS[id]).filter(Boolean);
  const selected = selectedId ? ORGANIZATIONS[selectedId] : null;

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("modal-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("modal-open");
    };
  }, [selected]);

  return (
    <div className="container-wide">
      <SectionHeader
        index="01b"
        eyebrow="Companies"
        title="The companies behind the work."
        description="Click a company for the full story, links, and related products."
      />

      <Reveal delay={0.05}>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {orgs.map((org, i) => (
            <motion.button
              key={org.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              onClick={() => setSelectedId(org.id)}
              className="card group flex flex-col items-center gap-3 p-4 text-center transition-shadow hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface-sunken">
                <Image
                  src={org.logo}
                  alt=""
                  width={56}
                  height={56}
                  className="h-full w-full object-contain p-1.5"
                />
              </div>
              <div>
                <div className="font-display text-sm font-semibold text-text-primary">
                  {org.name}
                </div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
                  {org.status === "closed" ? "Past" : "Active"}
                  {org.founded ? ` · ${org.founded.slice(0, 4)}` : ""}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </Reveal>

      <AnimatePresence>
        {selected && (
          <CompanyModal org={selected} onClose={() => setSelectedId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function CompanyModal({
  org,
  onClose,
}: {
  org: Organization;
  onClose: () => void;
}) {
  const titleId = useId();
  const roles = getRolesByOrganization(org.id);
  const related = PROJECTS.filter((p) => {
    if (p.organizationId === org.id) return true;
    if (p.roleId) {
      const role = getRole(p.roleId);
      return role?.organizationId === org.id;
    }
    return false;
  }).slice(0, 12);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-background/75 backdrop-blur-md"
        aria-label="Close company detail"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[1] max-h-[min(90svh,720px)] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-surface p-6 shadow-lg sm:rounded-3xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-secondary hover:text-text-primary"
          aria-label="Close"
        >
          <FaXmark className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4 pr-10">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface-sunken">
            <Image
              src={org.logo}
              alt={`${org.name} logo`}
              width={64}
              height={64}
              className="h-full w-full object-contain p-1.5"
            />
          </div>
          <div>
            <h3
              id={titleId}
              className="font-display text-2xl font-semibold tracking-tight text-text-primary"
            >
              {org.name}
            </h3>
            {org.legalName && (
              <p className="mt-0.5 text-sm text-text-tertiary">{org.legalName}</p>
            )}
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-text-tertiary">
              {org.status}
              {org.founded ? ` · founded ${org.founded.slice(0, 4)}` : ""}
              {org.location ? ` · ${org.location}` : ""}
            </p>
          </div>
        </div>

        <p className="mt-5 text-[15px] leading-relaxed text-text-secondary">
          {org.description}
        </p>

        {roles.length > 0 && (
          <div className="mt-5">
            <div className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
              Roles
            </div>
            <ul className="mt-2 space-y-1.5">
              {roles.map((r) => (
                <li key={r.id} className="text-sm text-text-secondary">
                  <span className="font-medium text-text-primary">{r.title}</span>
                  {r.period?.start && (
                    <span className="text-text-tertiary">
                      {" "}
                      · {r.period.start.slice(0, 4)}
                      {r.period.end ? `–${r.period.end.slice(0, 4)}` : "–now"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-5">
            <div className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
              Related products
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {related.map((p) => (
                <span
                  key={p.id}
                  className="rounded-md border border-border-subtle bg-surface-sunken/60 px-2 py-0.5 text-[11px] text-text-secondary"
                >
                  {p.title}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {org.website && (
            <a
              href={org.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover"
            >
              <FaArrowUpRightFromSquare className="h-3 w-3" /> Website
            </a>
          )}
          {org.github && (
            <a
              href={`https://github.com/${org.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover"
            >
              <FaGithub className="h-3.5 w-3.5" /> github.com/{org.github}
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
