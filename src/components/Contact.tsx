"use client";

import { useState, useEffect, FormEvent } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaGithub, FaLinkedin, FaStackOverflow, FaArrowRight } from 'react-icons/fa';
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
      icon: <FaEnvelope className="text-xl" />,
      title: 'Email',
      content: (
        <a 
          href={`mailto:${PERSONAL_INFO.email}`} 
          className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
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
          className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          github.com/shtse8
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
          className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          linkedin.com/in/shtse8
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
          className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          stackoverflow.com/users/4380384/shtse8
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12
      }
    }
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (!mounted) return null;
  
  return (
    <section id="contact" className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-[radial-gradient(ellipse_at_center,_rgba(var(--primary-color),0.15),transparent_80%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(var(--primary-color),0.15),transparent_80%)] -z-10"></div>
      
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={headingVariants}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-primary-50 dark:bg-primary-900/30 px-5 py-2 rounded-full text-primary-600 dark:text-primary-400 text-sm font-medium inline-block">
              Let&apos;s Connect
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Have a project in mind or want to discuss potential opportunities? I&apos;m excited to collaborate with you!
          </p>
        </motion.div>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16">
          {/* Contact Information */}
          <motion.div 
            className="order-2 md:order-1"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {contactItems.map((item, index) => (
              <motion.div 
                key={index} 
                className="flex items-start mb-8"
                variants={itemVariants}
              >
                <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-xl text-primary-600 dark:text-primary-400 mr-4 shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                  {item.content}
                </div>
              </motion.div>
            ))}
            
            <motion.div 
              className="mt-12 bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold mb-3 flex items-center">
                <span className="mr-2 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 p-2 rounded-lg">
                  <FaArrowRight />
                </span>
                Ready to Start a Project?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                I&apos;m currently available for freelance work or full-time positions. Let&apos;s build something amazing together.
              </p>
            </motion.div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div 
            className="order-1 md:order-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700/50">
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Name and Email fields */}
                {formFields.map((field) => (
                  <div key={field.id} className="relative">
                    <label htmlFor={field.id} className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      value={field.value}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border ${
                        field.error 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-200 dark:border-gray-700'
                      } bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200`}
                      placeholder={field.placeholder}
                      aria-invalid={!!field.error}
                      aria-describedby={field.error ? `${field.id}-error` : undefined}
                    />
                    {field.error && (
                      <motion.p 
                        id={`${field.id}-error`} 
                        className="mt-1 text-sm text-red-500 dark:text-red-400"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {field.error}
                      </motion.p>
                    )}
                  </div>
                ))}
                
                {/* Subject field */}
                <div className="relative">
                  <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.subject 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-200 dark:border-gray-700'
                    } bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200`}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                  >
                    <option value="">Select a subject</option>
                    {PERSONAL_INFO.contactFormSubjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  {errors.subject && (
                    <motion.p 
                      id="subject-error" 
                      className="mt-1 text-sm text-red-500 dark:text-red-400"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {errors.subject}
                    </motion.p>
                  )}
                </div>
                
                {/* Message field */}
                <div className="relative">
                  <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.message 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-200 dark:border-gray-700'
                    } bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200`}
                    placeholder="Your message here..."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  ></textarea>
                  {errors.message && (
                    <motion.p 
                      id="message-error" 
                      className="mt-1 text-sm text-red-500 dark:text-red-400"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {errors.message}
                    </motion.p>
                  )}
                </div>
                
                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={submitStatus === 'submitting'}
                  className={`w-full py-3 px-6 rounded-xl font-medium text-white transition-all ${
                    submitStatus === 'submitting'
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-lg hover:shadow-primary-500/20'
                  }`}
                  whileHover={{ scale: submitStatus !== 'submitting' ? 1.02 : 1 }}
                  whileTap={{ scale: submitStatus !== 'submitting' ? 0.98 : 1 }}
                >
                  {submitStatus === 'submitting' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2 inline-block" /> Send Message
                    </>
                  )}
                </motion.button>
                
                {/* Status messages */}
                {submitStatus === 'success' && (
                  <motion.div 
                    className="mt-4 p-4 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-xl border border-green-100 dark:border-green-800/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Your message has been sent successfully! I&apos;ll get back to you soon.
                    </div>
                  </motion.div>
                )}
                
                {submitStatus === 'error' && (
                  <motion.div 
                    className="mt-4 p-4 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-xl border border-red-100 dark:border-red-800/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      There was an error sending your message. Please try again later.
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 