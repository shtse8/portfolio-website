"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaBriefcase } from 'react-icons/fa';
import { ROLES } from '@/data/roles';
import { ORGANIZATIONS } from '@/data/organizations';
import { cn } from '@/lib/utils';

function formatPeriodSimple(period: { start: string; end?: string }): string {
  const startYear = period.start.substring(0, 4);
  const endYear = period.end ? period.end.substring(0, 4) : 'Present';
  return `${startYear} — ${endYear}`;
}

function calculateDuration(period: { start: string; end?: string }): string {
  const start = new Date(period.start);
  const end = period.end ? new Date(period.end) : new Date();
  const years = Math.floor((end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  if (years < 1) return '< 1 year';
  if (years === 1) return '1 year';
  return `${years}+ years`;
}

// Fallback logo component
function LogoFallback({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const initial = name.charAt(0).toUpperCase();
  const sizeClasses = size === 'sm' ? 'w-10 h-10 text-sm' : 'w-14 h-14 text-lg';

  return (
    <div className={cn(
      sizeClasses,
      "rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20",
      "flex items-center justify-center font-medium text-accent"
    )}>
      {initial}
    </div>
  );
}

export default function ExperiencesTimeline() {
  // Split into current and past roles
  const { currentRoles, pastRoles } = useMemo(() => {
    const current = ROLES.filter(r => !r.period.end)
      .sort((a, b) => new Date(b.period.start).getTime() - new Date(a.period.start).getTime());
    const past = ROLES.filter(r => r.period.end)
      .sort((a, b) => new Date(b.period.start).getTime() - new Date(a.period.start).getTime());
    return { currentRoles: current, pastRoles: past };
  }, []);

  return (
    <section id="experience" className="py-24 px-6" aria-labelledby="experience-heading">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 id="experience-heading" className="text-3xl md:text-4xl font-medium tracking-tight text-text-primary mb-4">
            Experience
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Building products and leading teams across gaming, AI, and open source.
          </p>
        </motion.div>

        {/* Timeline with year markers */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[23px] md:left-[31px] top-0 bottom-0 w-px bg-border" />

          {/* Current Ventures */}
          {currentRoles.length > 0 && (
            <div className="mb-12">
              <motion.div
                className="flex items-center gap-3 mb-6 relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-12 md:w-16 flex justify-center relative z-10">
                  <div className="w-3 h-3 rounded-full bg-green-500 ring-4 ring-background animate-pulse" />
                </div>
                <h3 className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">
                  Active
                </h3>
              </motion.div>

              <div className="space-y-4">
                {currentRoles.map((role, index) => (
                  <RoleCard key={role.id} role={role} index={index} isCurrent />
                ))}
              </div>
            </div>
          )}

          {/* Past Experience with year groups */}
          {pastRoles.length > 0 && (
            <div>
              <motion.div
                className="flex items-center gap-3 mb-6 relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-12 md:w-16 flex justify-center relative z-10">
                  <div className="w-3 h-3 rounded-full bg-text-tertiary ring-4 ring-background" />
                </div>
                <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider">
                  Past
                </h3>
              </motion.div>

              <div className="space-y-3">
                {pastRoles.map((role, index) => (
                  <RoleCard key={role.id} role={role} index={index} isCurrent={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function RoleCard({
  role,
  index,
  isCurrent
}: {
  role: typeof ROLES[number];
  index: number;
  isCurrent: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const organization = role.organizationId ? ORGANIZATIONS[role.organizationId] : null;
  const duration = calculateDuration(role.period);
  const startYear = role.period.start.substring(0, 4);
  const displayName = organization?.name || role.title;

  // Current roles get card layout with year indicator
  if (isCurrent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="flex gap-3 md:gap-4"
      >
        {/* Year column */}
        <div className="w-12 md:w-16 shrink-0 flex flex-col items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 ring-4 ring-background relative z-10" />
          <span className="mt-2 text-xs md:text-sm font-medium text-text-secondary">
            {startYear}
          </span>
        </div>

        {/* Card */}
        <div className={cn(
          "group flex-1 p-4 md:p-5 rounded-xl border bg-surface",
          "border-green-200 dark:border-green-900/50 hover:border-green-300 dark:hover:border-green-800",
          "hover:shadow-lg transition-all duration-300"
        )}>
          <div className="flex gap-4">
            {/* Logo with fallback */}
            <div className="shrink-0">
              {role.logo && !imgError ? (
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-elevated border border-border">
                  <Image
                    src={role.logo}
                    alt={displayName}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                </div>
              ) : (
                <LogoFallback name={displayName} size="md" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h4 className="text-base md:text-lg font-medium text-text-primary group-hover:text-accent transition-colors">
                    {role.title}
                  </h4>
                  {organization && (
                    <p className="text-sm text-text-secondary">
                      {organization.name}
                    </p>
                  )}
                </div>
                {role.liveUrl && (
                  <Link
                    href={role.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-2 text-text-tertiary hover:text-accent transition-colors"
                    aria-label={`Visit ${displayName}`}
                  >
                    <FaExternalLinkAlt className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {/* Duration badge */}
              <span className="inline-block px-2 py-0.5 mb-2 bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                {duration}
              </span>

              {/* Description */}
              <p className="text-sm text-text-secondary line-clamp-2">
                {role.description}
              </p>

              {/* Key metrics */}
              {role.keyAchievements && role.keyAchievements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {role.keyAchievements.slice(0, 2).map((achievement, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-surface-elevated border border-border rounded-md text-text-tertiary"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Past roles - compact with year indicator
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex gap-3 md:gap-4"
    >
      {/* Year column */}
      <div className="w-12 md:w-16 shrink-0 flex flex-col items-center">
        <div className="w-2 h-2 rounded-full bg-text-tertiary ring-4 ring-background relative z-10" />
        <span className="mt-2 text-xs md:text-sm text-text-tertiary">
          {startYear}
        </span>
      </div>

      {/* Content row */}
      <div className={cn(
        "group flex-1 flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg",
        "hover:bg-surface-elevated transition-colors duration-200"
      )}>
        {/* Logo with fallback */}
        <div className="shrink-0">
          {role.logo && !imgError ? (
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface border border-border">
              <Image
                src={role.logo}
                alt={displayName}
                width={40}
                height={40}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <LogoFallback name={displayName} size="sm" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h4 className="font-medium text-text-primary group-hover:text-accent transition-colors">
              {role.title}
            </h4>
            {organization && (
              <span className="text-sm text-text-tertiary">
                at {organization.name}
              </span>
            )}
          </div>
          <p className="text-sm text-text-tertiary line-clamp-1">
            {role.description}
          </p>
        </div>

        {/* Duration */}
        <div className="shrink-0 text-right hidden sm:block">
          <span className="text-xs text-text-tertiary px-2 py-0.5 bg-surface-elevated rounded">
            {duration}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
