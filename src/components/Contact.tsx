"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FaGithub, FaLinkedin, FaStackOverflow, FaEnvelope, FaWandMagicSparkles, FaArrowRight } from "react-icons/fa6";
import { PERSONAL_INFO } from "@/data/personal";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

const { email, social, location } = PERSONAL_INFO;

const SOCIALS = [
  { href: social.github, label: "GitHub", Icon: FaGithub },
  { href: social.linkedin, label: "LinkedIn", Icon: FaLinkedin },
  { href: social.stackoverflow, label: "Stack Overflow", Icon: FaStackOverflow },
  { href: `mailto:${email}`, label: email, Icon: FaEnvelope },
];

/**
 * Contact — AI-native. No form.
 *
 * Instead of a 4-field form (so 2018), the visitor clicks "Talk to my AI"
 * and the agent asks them what they need, collects their info conversationally,
 * and composes a prefilled email link. The section itself is minimal: a bold
 * CTA, social links, and location.
 */
export default function Contact() {
  const reduce = useReducedMotion();

  function openAgent() {
    window.dispatchEvent(new CustomEvent("open-agent", { detail: { seed: "I'd like to get in touch with Kyle" } }));
  }

  return (
    <div className="container-content">
      <SectionHeader
        index="03"
        eyebrow="Get in touch"
        title="Let's talk."
        description="No forms to fill — just tell my AI what you need. It'll ask the right questions and draft the email for you."
      />

      <Reveal delay={0.1}>
        <div className="mt-10 flex flex-col items-center gap-8 py-8 text-center">
          {/* AI CTA */}
          <motion.button
            onClick={openAgent}
            whileHover={reduce ? undefined : { scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-3 rounded-full bg-accent px-8 py-4 text-base font-semibold text-accent-contrast shadow-lg shadow-accent/20 transition-shadow hover:shadow-xl hover:shadow-accent/30"
          >
            <FaWandMagicSparkles className="h-5 w-5" />
            Talk to my AI
            <FaArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.button>

          <p className="max-w-md text-sm text-text-tertiary">
            The agent asks your name, what you need, and composes a ready-to-send email.
            Powered by Sylphx AI Gateway.
          </p>

          {/* Social links */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-secondary transition-all hover:border-accent hover:text-text-primary"
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </div>

          <p className="font-mono text-xs text-text-tertiary">
            {location.base} · {location.remote}
          </p>
        </div>
      </Reveal>
    </div>
  );
}
