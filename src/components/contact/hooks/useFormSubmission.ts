"use client";

import { useState, useCallback, useEffect } from 'react';
import { FormData, SubmitStatus } from '../types/contact';

export function useFormSubmission(onSuccess?: () => void) {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  // Reset form status after delay
  useEffect(() => {
    if (submitStatus === 'success' || submitStatus === 'error') {
      const timer = setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleSubmit = useCallback(async (formData: FormData) => {
    setSubmitStatus('submitting');

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Log form data for now (replace with actual submission)
      console.log('Form submitted:', formData);

      setSubmitStatus('success');

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    }
  }, [onSuccess]);

  return {
    submitStatus,
    handleSubmit,
    setSubmitStatus
  };
}
