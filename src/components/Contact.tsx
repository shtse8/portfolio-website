"use client";

import { useState, useEffect, FormEvent } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaGithub, FaLinkedin, FaStackOverflow } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data/portfolioData';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  // Reset form status after delay
  useEffect(() => {
    if (submitStatus === 'success' || submitStatus === 'error') {
      const timer = setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);
  
  const validateForm = (): boolean => {
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
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setSubmitStatus('submitting');
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    }
  };
  
  // Contact info items configuration
  const contactItems = [
    {
      icon: <FaEnvelope className="text-xl" />,
      title: 'Email',
      content: (
        <a 
          href={`mailto:${PERSONAL_INFO.email}`} 
          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block max-w-[220px] sm:max-w-none"
        >
          {PERSONAL_INFO.email}
        </a>
      )
    },
    {
      icon: <FaGithub className="text-xl" />,
      title: 'GitHub',
      content: (
        <a 
          href={PERSONAL_INFO.social.github} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          @shtse8
        </a>
      )
    },
    {
      icon: <FaLinkedin className="text-xl" />,
      title: 'LinkedIn',
      content: (
        <a 
          href={PERSONAL_INFO.social.linkedin} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          @shtse8
        </a>
      )
    },
    {
      icon: <FaStackOverflow className="text-xl" />,
      title: 'Stack Overflow',
      content: (
        <a 
          href={PERSONAL_INFO.social.stackoverflow} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          @shtse8
        </a>
      )
    },
    {
      icon: <FaMapMarkerAlt className="text-xl" />,
      title: 'Location',
      content: (
        <p className="text-gray-600 dark:text-gray-400">
          {PERSONAL_INFO.location.remote}<br />
          Based in {PERSONAL_INFO.location.base}
        </p>
      )
    }
  ];
  
  // Form fields configuration
  const formFields = [
    {
      id: 'name',
      label: 'Your Name',
      type: 'text',
      placeholder: 'John Doe',
      value: formData.name,
      error: errors.name
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'john@example.com',
      value: formData.email,
      error: errors.email
    }
  ];
  
  return (
    <section id="contact" className="py-16 md:py-24 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Have a project in mind or want to discuss potential opportunities? I&apos;d love to hear from you!
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Information */}
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              {contactItems.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg text-blue-600 dark:text-blue-300 mr-4 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-4">Let&apos;s Connect</h3>
              <p className="text-gray-600 dark:text-gray-400">
                I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="order-1 md:order-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 h-full">
              <h3 className="text-2xl font-bold mb-6">Send Me a Message</h3>
              
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Name and Email fields */}
                {formFields.map((field) => (
                  <div key={field.id} className="relative">
                    <label htmlFor={field.id} className="block text-gray-700 dark:text-gray-300 mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      value={field.value}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border ${
                        field.error 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                      placeholder={field.placeholder}
                      aria-invalid={!!field.error}
                      aria-describedby={field.error ? `${field.id}-error` : undefined}
                    />
                    {field.error && (
                      <p id={`${field.id}-error`} className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {field.error}
                      </p>
                    )}
                  </div>
                ))}
                
                {/* Subject field */}
                <div className="relative">
                  <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.subject 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                  >
                    <option value="">Select a subject</option>
                    {PERSONAL_INFO.contactFormSubjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p id="subject-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                      {errors.subject}
                    </p>
                  )}
                </div>
                
                {/* Message field */}
                <div className="relative">
                  <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.message 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                    placeholder="Your message here..."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  ></textarea>
                  {errors.message && (
                    <p id="message-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                      {errors.message}
                    </p>
                  )}
                </div>
                
                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitStatus === 'submitting'}
                  className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-colors flex items-center justify-center ${
                    submitStatus === 'submitting'
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {submitStatus === 'submitting' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2" /> Send Message
                    </>
                  )}
                </button>
                
                {/* Status messages */}
                {submitStatus === 'success' && (
                  <div className="mt-4 p-3 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded-lg animate-fadeIn">
                    Your message has been sent successfully! I&apos;ll get back to you soon.
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="mt-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 rounded-lg animate-fadeIn">
                    There was an error sending your message. Please try again later.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 