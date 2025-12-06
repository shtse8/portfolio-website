"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaCalendarAlt } from 'react-icons/fa';
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

        {/* Current Ventures */}
        {currentRoles.length > 0 && (
          <div className="mb-16">
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider">
                Current Ventures
              </h3>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {currentRoles.map((role, index) => (
                <RoleCard key={role.id} role={role} index={index} isCurrent />
              ))}
            </div>
          </div>
        )}

        {/* Past Experience */}
        {pastRoles.length > 0 && (
          <div>
            <motion.h3
              className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              Past Experience
            </motion.h3>

            <div className="space-y-4">
              {pastRoles.map((role, index) => (
                <RoleCard key={role.id} role={role} index={index} isCurrent={false} />
              ))}
            </div>
          </div>
        )}
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
  const organization = role.organizationId ? ORGANIZATIONS[role.organizationId] : null;
  const duration = calculateDuration(role.period);

  // Current roles get card layout, past roles get compact list
  if (isCurrent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className={cn(
          "group relative p-6 rounded-xl border bg-surface",
          "border-border hover:border-accent/30 hover:shadow-lg",
          "transition-all duration-300"
        )}
      >
        {/* Logo + Content */}
        <div className="flex gap-4">
          {/* Logo */}
          {role.logo && (
            <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-surface-elevated border border-border">
              <Image
                src={role.logo}
                alt={organization?.name || role.title}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="text-lg font-medium text-text-primary group-hover:text-accent transition-colors">
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
                  aria-label={`Visit ${organization?.name || role.title}`}
                >
                  <FaExternalLinkAlt className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {/* Period + Duration */}
            <div className="flex items-center gap-3 text-xs text-text-tertiary mb-3">
              <span className="flex items-center gap-1">
                <FaCalendarAlt className="w-3 h-3" />
                {formatPeriodSimple(role.period)}
              </span>
              <span className="px-2 py-0.5 bg-accent-subtle text-accent rounded-full text-xs">
                {duration}
              </span>
            </div>

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
      </motion.div>
    );
  }

  // Past roles - more compact
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "group flex items-center gap-4 p-4 rounded-lg",
        "hover:bg-surface-elevated transition-colors duration-200"
      )}
    >
      {/* Logo */}
      {role.logo && (
        <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-surface border border-border">
          <Image
            src={role.logo}
            alt={organization?.name || role.title}
            width={40}
            height={40}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
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

      {/* Period */}
      <div className="shrink-0 text-right">
        <span className="text-sm text-text-secondary">
          {formatPeriodSimple(role.period)}
        </span>
        <div className="text-xs text-text-tertiary">{duration}</div>
      </div>
    </motion.div>
  );
}
