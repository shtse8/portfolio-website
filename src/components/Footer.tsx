"use client";

import Link from 'next/link';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: PERSONAL_INFO.social.github,
      icon: FaGithub,
      label: "GitHub"
    },
    {
      href: PERSONAL_INFO.social.linkedin,
      icon: FaLinkedin,
      label: "LinkedIn"
    },
    {
      href: `mailto:${PERSONAL_INFO.email}`,
      icon: FaEnvelope,
      label: "Email"
    },
  ];

  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        {/* Main content - centered */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-medium text-text-primary mb-2">
            {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}
          </h2>
          <p className="text-sm text-text-secondary">
            {PERSONAL_INFO.title} · {PERSONAL_INFO.location.base}
          </p>
        </div>

        {/* Social links - centered, monochrome */}
        <div className="flex justify-center gap-4 mb-8">
          {socialLinks.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target={social.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              className="flex items-center justify-center w-10 h-10 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors duration-150"
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5" />
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-6" />

        {/* Copyright */}
        <p className="text-center text-sm text-text-tertiary">
          © {currentYear} {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName}
        </p>
      </div>
    </footer>
  );
}
