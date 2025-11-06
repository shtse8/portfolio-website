import { IconType } from 'react-icons';

export interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface ContactBenefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface ContactChannel {
  icon: IconType;
  label: string;
  value: string;
  href?: string;
  color: string;
  external?: boolean;
}
