"use client";

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaGithub, FaLinkedin, FaEnvelope, FaCalendarAlt, FaClock, FaCheckCircle } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data/personal';
import { cn } from '@/lib/utils';

interface FormData {
  name: string;
  email: string;
  message: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

// Quick contact options
const QUICK_CONTACT = [
  {
    label: 'Email',
    href: `mailto:${PERSONAL_INFO.email}`,
    icon: FaEnvelope,
    description: 'Direct email',
    external: false
  },
  {
    label: 'LinkedIn',
    href: PERSONAL_INFO.social.linkedin,
    icon: FaLinkedin,
    description: 'Professional network',
    external: true
  },
  {
    label: 'GitHub',
    href: PERSONAL_INFO.social.github,
    icon: FaGithub,
    description: 'Open source work',
    external: true
  },
];

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitStatus('submitting');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 px-6"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 id="contact-heading" className="text-3xl md:text-4xl font-medium tracking-tight text-text-primary mb-4">
            Get in Touch
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Interested in working together? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 max-w-4xl mx-auto">
          {/* Left side - Quick contact & availability */}
          <motion.div
            className="md:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Availability status */}
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium text-green-700 dark:text-green-400">Available Now</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-500">
                Open to freelance projects, consulting, and full-time opportunities.
              </p>
            </div>

            {/* Response time */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border">
              <FaClock className="w-5 h-5 text-accent" />
              <div>
                <div className="text-sm font-medium text-text-primary">Typical response time</div>
                <div className="text-xs text-text-tertiary">Within 24 hours</div>
              </div>
            </div>

            {/* Quick contact options */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                Quick Connect
              </h3>
              {QUICK_CONTACT.map((option) => (
                <Link
                  key={option.label}
                  href={option.href}
                  target={option.external ? "_blank" : undefined}
                  rel={option.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    "bg-surface border border-border hover:border-accent/30",
                    "transition-all duration-200 group"
                  )}
                >
                  <option.icon className="w-5 h-5 text-text-tertiary group-hover:text-accent transition-colors" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                      {option.label}
                    </div>
                    <div className="text-xs text-text-tertiary">{option.description}</div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Location */}
            <div className="text-sm text-text-tertiary">
              <span className="font-medium text-text-secondary">{PERSONAL_INFO.location?.base}</span>
              <br />
              {PERSONAL_INFO.location?.remote}
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-xl bg-surface border border-border">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="textarea"
                  placeholder="Tell me about your project..."
                />
                {errors.message && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitStatus === 'submitting'}
                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitStatus === 'submitting' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : submitStatus === 'success' ? (
                  <span className="flex items-center justify-center gap-2">
                    <FaCheckCircle className="w-4 h-4" />
                    Message Sent!
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FaPaperPlane className="w-4 h-4" />
                    Send Message
                  </span>
                )}
              </button>

              {/* Status messages */}
              {submitStatus === 'success' && (
                <p className="text-center text-sm text-green-600 dark:text-green-400">
                  Thanks for reaching out! I'll get back to you within 24 hours.
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="text-center text-sm text-red-500">
                  Something went wrong. Please try again or email directly.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
