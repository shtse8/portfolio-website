"use client";

import { useState, useEffect, FormEvent } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaGithub, FaLinkedin, FaStackOverflow } from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { motion } from 'framer-motion';

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
  const [mounted, setMounted] = useState(false);
  
  // Set mounted on component load
  useEffect(() => {
    setMounted(true);
  }, []);
  
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
      icon: <FaEnvelope className="text-lg" />,
      title: 'Email',
      content: (
        <a 
          href={`mailto:${PERSONAL_INFO.email}`} 
          className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
        >
          {PERSONAL_INFO.email}
        </a>
      )
    },
    {
      icon: <FaGithub className="text-lg" />,
      title: 'GitHub',
      content: (
        <a 
          href={PERSONAL_INFO.social.github} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
        >
          github.com/shtse8
        </a>
      )
    },
    {
      icon: <FaLinkedin className="text-lg" />,
      title: 'LinkedIn',
      content: (
        <a 
          href={PERSONAL_INFO.social.linkedin} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
        >
          linkedin.com/in/shtse8
        </a>
      )
    },
    {
      icon: <FaStackOverflow className="text-lg" />,
      title: 'Stack Overflow',
      content: (
        <a 
          href={PERSONAL_INFO.social.stackoverflow} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
        >
          stackoverflow.com/users/4380384/shtse8
        </a>
      )
    },
    {
      icon: <FaMapMarkerAlt className="text-lg" />,
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

  if (!mounted) return null;
  
  return (
    <section id="contact" className="py-24 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-medium mb-4 tracking-tight text-gray-900 dark:text-white">
            Get in <span className="text-primary-500">Touch</span>
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            Have a project in mind or want to discuss potential opportunities? I'm excited to collaborate with you.
          </p>
          
          {/* Simple horizontal line - a hallmark of Scandinavian design */}
          <div className="w-16 h-px bg-gray-300 dark:bg-gray-700 mx-auto mt-8"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Information - clean, minimalist styling */}
          <div>
            <h3 className="text-xl font-normal mb-8 text-gray-900 dark:text-white">Contact Information</h3>
            
            <div className="space-y-8">
              {contactItems.map((item, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="text-gray-500 dark:text-gray-400 mr-4">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 font-light">{item.title}</h4>
                    {item.content}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-14 pt-12 border-t border-gray-200 dark:border-gray-800">
              <p className="text-gray-600 dark:text-gray-400 font-light">
                I'm currently available for freelance work or full-time positions. Let's build something meaningful together.
              </p>
            </div>
          </div>
          
          {/* Contact Form - refined, clean styling */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-normal mb-8 text-gray-900 dark:text-white">Send a Message</h3>
              
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Name and Email fields */}
                {formFields.map((field) => (
                  <div key={field.id} className="relative">
                    <label htmlFor={field.id} className="block text-sm font-normal text-gray-700 dark:text-gray-300 mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      value={field.value}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 bg-transparent border-b ${
                        field.error 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-600'
                      } text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary-500 transition duration-200`}
                      placeholder={field.placeholder}
                      aria-invalid={!!field.error}
                      aria-describedby={field.error ? `${field.id}-error` : undefined}
                    />
                    {field.error && (
                      <p 
                        id={`${field.id}-error`} 
                        className="mt-1 text-sm text-red-500 dark:text-red-400"
                      >
                        {field.error}
                      </p>
                    )}
                  </div>
                ))}
                
                {/* Subject field */}
                <div className="relative">
                  <label htmlFor="subject" className="block text-sm font-normal text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-transparent border-b ${
                      errors.subject 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    } text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary-500 transition duration-200`}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                  >
                    <option value="">Select a subject</option>
                    {PERSONAL_INFO.contactFormSubjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p 
                      id="subject-error" 
                      className="mt-1 text-sm text-red-500 dark:text-red-400"
                    >
                      {errors.subject}
                    </p>
                  )}
                </div>
                
                {/* Message field */}
                <div className="relative">
                  <label htmlFor="message" className="block text-sm font-normal text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={`w-full px-4 py-3 bg-transparent border-b ${
                      errors.message 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    } text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary-500 transition duration-200`}
                    placeholder="Your message here..."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  ></textarea>
                  {errors.message && (
                    <p 
                      id="message-error" 
                      className="mt-1 text-sm text-red-500 dark:text-red-400"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>
                
                {/* Submit button - clean, minimalist design */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitStatus === 'submitting'}
                    className={`px-8 py-3 border border-gray-300 dark:border-gray-600 ${
                      submitStatus === 'submitting'
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                        : 'bg-transparent hover:bg-primary-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white'
                    } transition-colors`}
                  >
                    {submitStatus === 'submitting' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2 text-xs inline-block" /> Send Message
                      </>
                    )}
                  </button>
                </div>
                
                {/* Status messages - clean, minimalist alerts */}
                {submitStatus === 'success' && (
                  <div className="mt-4 py-3 border-l-2 border-green-500 pl-4 text-sm text-gray-700 dark:text-gray-300">
                    Your message has been sent successfully. I'll get back to you soon.
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="mt-4 py-3 border-l-2 border-red-500 pl-4 text-sm text-gray-700 dark:text-gray-300">
                    There was an error sending your message. Please try again later.
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 