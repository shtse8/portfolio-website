import { FaEnvelope, FaGithub, FaLinkedin, FaStackOverflow, FaMapMarkerAlt } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data/personal';
import { ContactChannel } from '../types/contact';

export const contactChannels: ContactChannel[] = [
  {
    icon: FaEnvelope,
    label: 'Email',
    value: PERSONAL_INFO.email,
    href: `mailto:${PERSONAL_INFO.email}`,
    color: 'bg-blue-500 text-white'
  },
  {
    icon: FaGithub,
    label: 'GitHub',
    value: 'github.com/shtse8',
    href: PERSONAL_INFO.social.github,
    color: 'bg-gray-800 text-white dark:bg-gray-700',
    external: true
  },
  {
    icon: FaLinkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/shtse8',
    href: PERSONAL_INFO.social.linkedin,
    color: 'bg-blue-600 text-white',
    external: true
  },
  {
    icon: FaStackOverflow,
    label: 'Stack Overflow',
    value: 'stackoverflow.com/u/4380384',
    href: PERSONAL_INFO.social.stackoverflow,
    color: 'bg-orange-500 text-white',
    external: true
  },
  {
    icon: FaMapMarkerAlt,
    label: 'Location',
    value: `${PERSONAL_INFO.location.remote}, based in ${PERSONAL_INFO.location.base}`,
    color: 'bg-emerald-500 text-white'
  }
];

export const subjectOptions = [
  { value: '', label: 'Select a subject' },
  { value: 'collaboration', label: 'Project Collaboration' },
  { value: 'job', label: 'Job Opportunity' },
  { value: 'consultation', label: 'Technical Consultation' },
  { value: 'speaking', label: 'Speaking Engagement' },
  { value: 'other', label: 'Other Inquiry' }
];
