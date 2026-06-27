"use client";

import { useState, ReactNode } from 'react';
import Image from 'next/image';
import { FaGithub, FaExternalLinkAlt, FaCalendarAlt, FaBuilding, FaChevronLeft, FaChevronRight,
  FaGooglePlay, FaApple, FaWikipediaW, FaLink, FaFileAlt, FaVideo, FaNewspaper, FaBook } from 'react-icons/fa';
import type { Project, Role } from '@/data/types';
import { ORGANIZATIONS } from '@/data/organizations';
import { ROLES } from '@/data/roles';
import { formatPeriod, formatProjectPeriod } from '@/data';
import { getSkillNames } from '@/utils/skillHelpers';
import ProjectImage from '@/components/shared/ProjectImage';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type ProjectModalProps = {
  project: Project;
  openExperienceModal: (experienceIndex: number) => void;
  openCompanyModal: (companyId: string) => void;
  parseMarkdownLinks: (text: string) => ReactNode;
  closeModal?: () => void;
  nextProject?: () => void;
  prevProject?: () => void;
};

/** Initials for the no-image monogram (handles latin + CJK titles). */
function getMonogram(title: string): string {
  const words = title.split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map((w) => w.charAt(0)).join('');
  return (initials || title.charAt(0)).toUpperCase();
}

export default function ProjectModal({
  project,
  openExperienceModal,
  openCompanyModal,
  parseMarkdownLinks,
  closeModal
}: ProjectModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const router = useRouter();

  const projectImages = project.images || [];
  const period = formatProjectPeriod(project);
  const role = getRoleForProject();

  function handleSkillClick(skillId: string) {
    if (closeModal) closeModal();
    router.push(`/projects?skill=${skillId}`);
  }

  function getMediaTypeIcon(type?: string) {
    switch (type) {
      case 'review': return <FaNewspaper className="text-text-tertiary" />;
      case 'article': return <FaNewspaper className="text-text-tertiary" />;
      case 'video': return <FaVideo className="text-text-tertiary" />;
      case 'social': return <FaLink className="text-text-tertiary" />;
      case 'award': return <FaFileAlt className="text-text-tertiary" />;
      case 'resource': return <FaBook className="text-text-tertiary" />;
      case 'tool': return <FaLink className="text-text-tertiary" />;
      default: return <FaLink className="text-text-tertiary" />;
    }
  }

  function getRoleForProject(): Role | null {
    const relatedRole = ROLES.find((r) => r.projectIds?.includes(project.id));
    if (!relatedRole && project.roleId) {
      return ROLES.find((r) => r.id === project.roleId) || null;
    }
    if (!relatedRole && project.organizationId) {
      const orgRoles = ROLES.filter((r) => r.organizationId === project.organizationId);
      return orgRoles.length > 0 ? orgRoles[0] : null;
    }
    return relatedRole || null;
  }

  const nextImage = () => {
    if (projectImages.length > 0) setActiveImageIndex((activeImageIndex + 1) % projectImages.length);
  };
  const prevImage = () => {
    if (projectImages.length > 0)
      setActiveImageIndex((activeImageIndex - 1 + projectImages.length) % projectImages.length);
  };

  const renderImageGallery = () => (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-surface-sunken">
      <div className="relative h-full w-full">
        <ProjectImage
          src={projectImages}
          index={activeImageIndex}
          alt={`${project.title} - Image ${activeImageIndex + 1}`}
          fill
          style={{ objectFit: 'cover' }}
          className="h-full w-full"
        />
      </div>

      {projectImages.length > 1 && (
        <>
          <button
            onClick={prevImage}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/85 text-text-secondary backdrop-blur-sm transition-colors hover:text-accent"
          >
            <FaChevronLeft size={14} />
          </button>
          <button
            onClick={nextImage}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/85 text-text-secondary backdrop-blur-sm transition-colors hover:text-accent"
          >
            <FaChevronRight size={14} />
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {projectImages.map((_, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                aria-label={`Go to image ${idx + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  idx === activeImageIndex ? 'w-4 bg-accent' : 'w-1.5 bg-surface/70 hover:bg-surface'
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
      {/* Header */}
      <div className="border-b border-border bg-surface-sunken p-6 sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border sm:h-28 sm:w-28">
            {projectImages.length > 0 ? (
              <ProjectImage src={project.images} alt={project.title} fill className="object-cover" index={0} />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-subtle via-surface-sunken to-surface">
                <span className="font-mono text-3xl font-semibold text-accent/60">{getMonogram(project.title)}</span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge">{project.category}</span>
              {period && (
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-text-tertiary">
                  <FaCalendarAlt className="h-3 w-3" /> {period}
                </span>
              )}
              {project.organizationId && ORGANIZATIONS[project.organizationId] && (
                <button
                  onClick={() => openCompanyModal(project.organizationId as string)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-text-tertiary transition-colors hover:text-accent"
                >
                  <FaBuilding className="h-3 w-3" />
                  <span className="underline-offset-4 hover:underline">
                    {ORGANIZATIONS[project.organizationId].name}
                  </span>
                </button>
              )}
            </div>

            <h2 className="mt-3 text-h2 text-text-primary">{project.title}</h2>

            {project.skills && project.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.skills.map((skillId) => (
                  <button
                    key={skillId}
                    onClick={() => handleSkillClick(skillId)}
                    className="chip transition-colors hover:border-accent hover:text-accent"
                  >
                    {getSkillNames([skillId])[0]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-8 p-6 sm:p-10 lg:grid-cols-5 lg:gap-10">
          {/* Main */}
          <div className="order-2 lg:order-1 lg:col-span-3">
            <h3 className="eyebrow mb-3">Overview</h3>
            <div className="leading-relaxed text-text-secondary">
              {parseMarkdownLinks(project.description)}
            </div>

            {project.details && (
              <>
                <h3 className="eyebrow mb-4 mt-10">Key Features</h3>
                <ul className="space-y-3">
                  {Array.isArray(project.details) ? (
                    project.details.map((detail: string, index: number) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                        <span>{parseMarkdownLinks(detail)}</span>
                      </li>
                    ))
                  ) : (
                    <li className="leading-relaxed text-text-secondary">
                      {parseMarkdownLinks(project.details as string)}
                    </li>
                  )}
                </ul>
              </>
            )}

            {project.challenges && project.challenges.length > 0 && (
              <>
                <h3 className="eyebrow mb-4 mt-10">Challenges &amp; Solutions</h3>
                <div className="space-y-4">
                  {project.challenges.map((challenge, index) => (
                    <div key={index} className="rounded-xl border border-border bg-surface-sunken p-5">
                      <h4 className="mb-2 font-semibold text-text-primary">{challenge.title}</h4>
                      <div className="text-sm leading-relaxed text-text-secondary">
                        {parseMarkdownLinks(challenge.description)}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {role && (
              <>
                <h3 className="eyebrow mb-4 mt-10">Related Role</h3>
                <button
                  className="card card-hover w-full p-5 text-left"
                  onClick={() => {
                    const roleIndex = ROLES.findIndex((r) => r.id === role.id);
                    if (roleIndex !== -1) openExperienceModal(roleIndex);
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border">
                      {role.logo && <Image src={role.logo} alt={role.title} fill className="object-cover" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{role.title}</h4>
                      <p className="mb-2 font-mono text-xs text-text-tertiary">
                        {role.organizationId && ORGANIZATIONS[role.organizationId]?.name} ·{' '}
                        {role.period ? formatPeriod(role.period) : ''}
                      </p>
                      <p className="text-sm text-text-secondary">{role.description}</p>
                    </div>
                  </div>
                </button>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="order-1 lg:order-2 lg:col-span-2">
            {projectImages.length > 0 && <div className="mb-8">{renderImageGallery()}</div>}

            {/* Project Links */}
            <div className="mb-8">
              <h3 className="eyebrow mb-3">Project Links</h3>
              <div className="flex flex-col gap-2">
                {project.urls?.website && (
                  <a href={project.urls.website} target="_blank" rel="noopener noreferrer" className="btn-primary btn-md w-full">
                    <FaExternalLinkAlt /> View Website
                  </a>
                )}
                {project.urls?.demo && (
                  <a href={project.urls.demo} target="_blank" rel="noopener noreferrer" className="btn-primary btn-md w-full">
                    <FaExternalLinkAlt /> View Demo
                  </a>
                )}
                {project.urls?.repository && (
                  <a href={project.urls.repository} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-md w-full">
                    <FaGithub /> View Repository
                  </a>
                )}
                {project.urls?.googlePlay && (
                  <a href={project.urls.googlePlay} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-md w-full">
                    <FaGooglePlay /> Google Play
                  </a>
                )}
                {project.urls?.appStore && (
                  <a href={project.urls.appStore} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-md w-full">
                    <FaApple /> App Store
                  </a>
                )}
                {project.urls?.documentation && (
                  <a href={project.urls.documentation} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-md w-full">
                    <FaFileAlt /> Documentation
                  </a>
                )}
                {project.urls?.wikipedia && (
                  <a href={project.urls.wikipedia} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-md w-full">
                    <FaWikipediaW /> Wikipedia
                  </a>
                )}
                {project.urls?.timemachine && (
                  <a href={project.urls.timemachine} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-md w-full">
                    <FaLink /> Wayback Machine
                  </a>
                )}

                {/* Legacy fallbacks */}
                {!project.urls?.website && project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary btn-md w-full">
                    <FaExternalLinkAlt /> View Live Project
                  </a>
                )}
                {!project.urls?.repository && project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-md w-full">
                    <FaGithub /> View on GitHub
                  </a>
                )}
              </div>
            </div>

            {/* References & Media */}
            {project.urls?.other && project.urls.other.length > 0 && (
              <div className="mb-8">
                <h3 className="eyebrow mb-3">References &amp; Media</h3>
                <div className="space-y-2">
                  {project.urls.other.map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card card-hover flex items-start gap-3 p-4"
                    >
                      <div className="mt-0.5 shrink-0">{getMediaTypeIcon(item.type)}</div>
                      <div>
                        <h4 className="text-sm font-medium text-text-primary">{item.name}</h4>
                        {item.description && (
                          <p className="mt-0.5 text-xs text-text-tertiary">{item.description}</p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            {project.skills && project.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="eyebrow mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.skills.map((skillId) => (
                    <button
                      key={skillId}
                      onClick={() => handleSkillClick(skillId)}
                      className="chip transition-colors hover:border-accent hover:text-accent"
                    >
                      {getSkillNames([skillId])[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Project Details */}
            {(project.teamSize || project.duration || project.role) && (
              <div className="mb-8">
                <h3 className="eyebrow mb-3">Project Details</h3>
                <dl className="divide-y divide-border-subtle overflow-hidden rounded-xl border border-border bg-surface-sunken">
                  {project.role && (
                    <div className="flex items-center justify-between gap-4 px-4 py-3">
                      <dt className="text-sm text-text-tertiary">My Role</dt>
                      <dd className="text-sm font-medium text-text-primary">{project.role}</dd>
                    </div>
                  )}
                  {project.teamSize && (
                    <div className="flex items-center justify-between gap-4 px-4 py-3">
                      <dt className="text-sm text-text-tertiary">Team Size</dt>
                      <dd className="font-mono text-sm font-medium text-text-primary">{project.teamSize}</dd>
                    </div>
                  )}
                  {project.duration && (
                    <div className="flex items-center justify-between gap-4 px-4 py-3">
                      <dt className="text-sm text-text-tertiary">Duration</dt>
                      <dd className="text-sm font-medium text-text-primary">{project.duration}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
