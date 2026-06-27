"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { IconType } from "react-icons";
import {
  FaArrowRight,
  FaBriefcase,
  FaCodeBranch,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaRegComments,
  FaRocket,
  FaStackOverflow,
} from "react-icons/fa";
import { PERSONAL_INFO } from "@/data/personal";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

const { email, social, location, contactFormSubjects } = PERSONAL_INFO;

/** Build an honest mailto: URL — this is a static export, nothing posts to a server. */
const mailto = (subject: string, body?: string) =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}` +
  (body ? `&body=${encodeURIComponent(body)}` : "");

type Action = {
  label: string;
  href: string;
  primary?: boolean;
  external?: boolean;
  icon?: IconType;
};

type Audience = {
  icon: IconType;
  title: string;
  description: string;
  actions: Action[];
};

/** On-ramps for each audience: recruiters, clients, OSS peers, and everyone else. */
const AUDIENCES: Audience[] = [
  {
    icon: FaBriefcase,
    title: "Hiring or opportunities",
    description: "Teams and recruiters looking for a hands-on technical founder.",
    actions: [{ label: "Email about a role", href: mailto("Job Opportunity"), primary: true }],
  },
  {
    icon: FaRocket,
    title: "Work with Epiow",
    description: "Product and consultancy projects through my studio, Epiow.",
    actions: [
      { label: "Start a project", href: mailto("Project Inquiry"), primary: true },
      { label: "epiow.com", href: "https://epiow.com", external: true },
    ],
  },
  {
    icon: FaCodeBranch,
    title: "Open-source collaboration",
    description: "Contributing to or building on my MCP and OSS tooling.",
    actions: [
      { label: "GitHub", href: social.github, external: true, icon: FaGithub },
      { label: "Collaborate", href: mailto("Open Source Collaboration"), primary: true },
    ],
  },
  {
    icon: FaRegComments,
    title: "Just say hi",
    description: "Questions, ideas, or a friendly hello from a fellow builder.",
    actions: [{ label: "Say hello", href: mailto("Other"), primary: true }],
  },
];

const SOCIALS: { label: string; href: string; icon: IconType }[] = [
  { label: "GitHub", href: social.github, icon: FaGithub },
  { label: "LinkedIn", href: social.linkedin, icon: FaLinkedin },
  { label: "Stack Overflow", href: social.stackoverflow, icon: FaStackOverflow },
];

type FormState = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<"name" | "email" | "message", string>>;

/** Caps keep the generated mailto: URL inside browser / OS email-handler length limits. */
const MAX = { name: 80, email: 120, message: 1500 } as const;

const labelBase = "block font-mono text-xs uppercase tracking-wider text-text-secondary";
const labelCls = `mb-1.5 ${labelBase}`;
const errorCls = "mt-1.5 font-mono text-xs text-red-600 dark:text-red-400";
const invalidCls = "aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/30";
const inputCls = `input ${invalidCls}`;
const textareaCls = `textarea ${invalidCls}`;

function AudienceCard({ audience, delay }: { audience: Audience; delay: number }) {
  const Icon = audience.icon;
  return (
    <Reveal delay={delay} className="h-full">
      <article className="card card-hover flex h-full flex-col p-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-subtle text-accent">
          <Icon className="h-4 w-4" />
        </span>
        <h4 className="mt-3.5 text-[0.95rem] font-semibold text-text-primary">{audience.title}</h4>
        <p className="mt-1 text-sm text-text-secondary">{audience.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          {audience.actions.map((action) => {
            const ActionIcon = action.icon;
            const external = action.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {};
            return action.primary ? (
              <a
                key={action.label}
                href={action.href}
                {...external}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
              >
                {action.label}
                <FaArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </a>
            ) : (
              <a
                key={action.label}
                href={action.href}
                {...external}
                className="inline-flex items-center gap-1.5 text-sm text-text-tertiary transition-colors hover:text-text-primary"
              >
                {ActionIcon && <ActionIcon className="h-3.5 w-3.5" />}
                {action.label}
              </a>
            );
          })}
        </div>
      </article>
    </Reveal>
  );
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: contactFormSubjects[0],
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const update = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please add your name.";
    if (!form.email.trim()) next.email = "Please add your email.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "That email looks off — mind checking it?";
    if (!form.message.trim()) next.message = "Add a short note so I have some context.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const body = `Hi Kyle,\n\n${form.message.trim()}\n\n— ${form.name.trim()}\n${form.email.trim()}`;
    // Static export: open the visitor's email client. No network request is made.
    window.location.href = mailto(form.subject, body);
  };

  return (
    <div className="container-content">
      <SectionHeader
        index="07"
        eyebrow="Contact"
        title="Let's work together"
        description="Hiring, a project for Epiow, an open-source idea, or just a hello — pick the lane that fits and I'll get back to you within a day or two."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* LEFT — pitch, audience matrix, socials */}
        <div className="space-y-8">
          <Reveal className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-positive/30 bg-positive-subtle px-3 py-1 text-xs font-medium text-positive">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-positive animate-ping-soft" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
              </span>
              Open to new ventures
            </span>

            <p className="text-text-secondary">
              I read everything that lands in my inbox. The fastest way to reach me is the lane
              below — each opens an email with the right context already filled in.
            </p>

            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 font-mono text-sm text-text-secondary transition-colors hover:text-accent"
            >
              <FaEnvelope className="h-3.5 w-3.5 text-accent" />
              {email}
            </a>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                {SOCIALS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-accent hover:text-accent"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  );
                })}
              </div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-text-tertiary">
                <FaMapMarkerAlt className="h-3 w-3" />
                {location.base} · {location.remote}
              </span>
            </div>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2">
            {AUDIENCES.map((audience, i) => (
              <AudienceCard key={audience.title} audience={audience} delay={i * 0.06} />
            ))}
          </div>
        </div>

        {/* RIGHT — honest mailto form */}
        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-labelledby="contact-form-title"
            className="card p-6 sm:p-7"
          >
            <h3 id="contact-form-title" className="text-h3 text-text-primary">
              Send a message
            </h3>
            <p className="mt-1.5 text-sm text-text-secondary">
              This composes an email in your own client — nothing is sent through the site.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="contact-name" className={labelCls}>
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={update}
                  className={inputCls}
                  placeholder="Your name"
                  maxLength={MAX.name}
                  autoComplete="name"
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                />
                {errors.name && (
                  <p id="contact-name-error" role="alert" className={errorCls}>
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-email" className={labelCls}>
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  className={inputCls}
                  placeholder="you@example.com"
                  maxLength={MAX.email}
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                />
                {errors.email && (
                  <p id="contact-email-error" role="alert" className={errorCls}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-subject" className={labelCls}>
                  Subject
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={form.subject}
                  onChange={update}
                  className="input cursor-pointer"
                >
                  {contactFormSubjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="mb-1.5 flex items-baseline justify-between gap-2">
                  <label htmlFor="contact-message" className={labelBase}>
                    Message
                  </label>
                  <span
                    aria-hidden
                    className={`font-mono text-xs tabular-nums ${
                      form.message.length > MAX.message * 0.9 ? "text-accent" : "text-text-tertiary"
                    }`}
                  >
                    {form.message.length} / {MAX.message}
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={update}
                  rows={5}
                  maxLength={MAX.message}
                  className={textareaCls}
                  placeholder="A few lines about what you have in mind…"
                  aria-required="true"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                />
                {errors.message && (
                  <p id="contact-message-error" role="alert" className={errorCls}>
                    {errors.message}
                  </p>
                )}
              </div>
            </div>

            <button type="submit" className="btn-primary btn-lg mt-6 w-full">
              Compose email
              <FaArrowRight className="h-3.5 w-3.5" />
            </button>

            <p className="mt-3 text-center font-mono text-xs text-text-tertiary">
              Opens your email client · or write me at{" "}
              <a href={`mailto:${email}`} className="link">
                {email}
              </a>
            </p>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
