"use client";

import { useState, useCallback } from 'react';
import { FormData } from '../types/contact';

export function useContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [activeField, setActiveField] = useState<string | null>(null);
  const [formStep, setFormStep] = useState<number>(1);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const validateStep = useCallback((): boolean => {
    const newErrors: Partial<FormData> = {};

    if (formStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
    } else if (formStep === 2) {
      if (!formData.subject) {
        newErrors.subject = 'Please select a subject';
      }
    } else if (formStep === 3) {
      if (!formData.message.trim()) {
        newErrors.message = 'Message is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, formStep]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  }, [errors]);

  const handleNextStep = useCallback(() => {
    if (validateStep() && formStep < 3) {
      setFormStep(prev => prev + 1);
    }
  }, [formStep, validateStep]);

  const handlePrevStep = useCallback(() => {
    if (formStep > 1) {
      setFormStep(prev => prev - 1);
    }
  }, [formStep]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setErrors({});
    setFormStep(1);
    setActiveField(null);
  }, []);

  return {
    formData,
    errors,
    activeField,
    formStep,
    setActiveField,
    handleChange,
    handleNextStep,
    handlePrevStep,
    validateForm,
    validateStep,
    resetForm
  };
}
