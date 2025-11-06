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
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}
