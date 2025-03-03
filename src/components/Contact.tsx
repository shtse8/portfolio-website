"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaGithub, 
  FaLinkedin, FaStackOverflow, FaArrowRight, FaRegLightbulb,
  FaLongArrowAltRight, FaRegCommentDots, FaUsers, FaRegClock
} from 'react-icons/fa';
import { PERSONAL_INFO } from '@/data/personal';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

// Background elements component
const ContactBackground = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/20 dark:from-gray-900/90 dark:to-blue-950/10"></div>
    
    {/* Abstract patterns */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="contactGrid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#contactGrid)" />
    </svg>
    
    {/* Accent elements */}
    <motion.div 
      className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-blue-400/5 dark:bg-blue-500/5 blur-3xl"
      animate={{
        y: [0, 20, 0],
        x: [0, -20, 0],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
    <motion.div 
      className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-indigo-300/5 dark:bg-indigo-400/5 blur-3xl"
      animate={{
        y: [0, -15, 0],
        x: [0, 15, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
  </div>
);

// Benefits component
const ContactBenefits = () => {
  const benefits = [
    {
      icon: <FaRegLightbulb />,
      title: "Innovative Approach",
      description: "Every project begins with fresh ideas and creative thinking"
    },
    {
      icon: <FaRegCommentDots />,
      title: "Clear Communication",
      description: "Regular updates and transparent discussion throughout"
    },
    {
      icon: <FaUsers />,
      title: "Collaborative Process",
      description: "Working together to achieve your vision and goals"
    },
    {
      icon: <FaRegClock />,
      title: "Timely Delivery",
      description: "Respect for deadlines and efficient workflow management"
    }
  ];
  
  return (
    <motion.div 
      className="grid sm:grid-cols-2 gap-6 mt-8"
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
      initial="hidden"
      animate="visible"
    >
      {benefits.map((benefit, index) => (
        <motion.div 
          key={index}
          className="bg-white/60 dark:bg-gray-800/30 backdrop-blur-sm p-5 rounded-xl border border-gray-100/70 dark:border-gray-700/20 flex"
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { 
              y: 0, 
              opacity: 1,
              transition: { duration: 0.4 }
            }
          }}
        >
          <div className="mr-4 bg-blue-100/70 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 p-3 rounded-full h-min">
            {benefit.icon}
          </div>
          <div>
            <h4 className="text-lg font-light text-gray-800 dark:text-gray-200 mb-1">{benefit.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light">{benefit.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

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
  const [activeField, setActiveField] = useState<string | null>(null);
  const [formStep, setFormStep] = useState<number>(1);
  
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
  
  const validateStep = (): boolean => {
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
  };
  
  const handleNextStep = () => {
    if (validateStep()) {
      setFormStep(prev => prev + 1);
    }
  };
  
  const handlePrevStep = () => {
    setFormStep(prev => prev - 1);
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
      setFormStep(1);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    }
  };
  
  // Contact channels with enhanced design
  const contactChannels = [
    {
      icon: <FaEnvelope />,
      title: 'Email',
      value: PERSONAL_INFO.email,
      link: `mailto:${PERSONAL_INFO.email}`,
      color: 'bg-blue-500 text-white'
    },
    {
      icon: <FaGithub />,
      title: 'GitHub',
      value: 'github.com/shtse8',
      link: PERSONAL_INFO.social.github,
      color: 'bg-gray-800 text-white dark:bg-gray-700'
    },
    {
      icon: <FaLinkedin />,
      title: 'LinkedIn',
      value: 'linkedin.com/in/shtse8',
      link: PERSONAL_INFO.social.linkedin,
      color: 'bg-blue-600 text-white'
    },
    {
      icon: <FaStackOverflow />,
      title: 'Stack Overflow',
      value: 'stackoverflow.com/u/4380384',
      link: PERSONAL_INFO.social.stackoverflow,
      color: 'bg-orange-500 text-white'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Location',
      value: `${PERSONAL_INFO.location.remote}, based in ${PERSONAL_INFO.location.base}`,
      color: 'bg-emerald-500 text-white'
    }
  ];

  if (!mounted) return null;
  
  return (
    <section id="contact" className="relative py-24 md:py-32 px-4 min-h-screen overflow-hidden">
      <ContactBackground />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Title with Decorative Elements */}
        <div className="relative mb-20 md:mb-24 max-w-3xl mx-auto">
          <motion.div
            className="absolute -top-16 -left-8 w-28 h-28 border border-blue-200/50 dark:border-blue-800/30 rounded-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block mb-5 px-5 py-2 bg-blue-50/80 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 text-sm tracking-wide">
              Ready to Connect
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight mb-6 tracking-wide">
              Let&apos;s discuss your project
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed font-light">
              Have a project in mind or want to explore how we could work together? I&apos;m always open to discussing new opportunities and ideas.
            </p>
          </motion.div>
        </div>
        
        <div className="grid lg:grid-cols-7 gap-8 md:gap-12">
          {/* Contact Channels - Left Side */}
          <motion.div 
            className="lg:col-span-3 order-2 lg:order-1 flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-light mb-8 flex items-center">
              <span className="inline-block w-10 h-0.5 bg-blue-400 dark:bg-blue-500 mr-4" aria-hidden="true"></span>
              Ways to Reach Me
            </h3>
            
            <div className="space-y-5 mb-10">
              {contactChannels.map((channel, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <div className={`${channel.color} p-4 rounded-xl mr-5 group-hover:shadow-md transition-all duration-300 flex-shrink-0`}>
                    {channel.icon}
                  </div>
                  
                  <div className="flex-grow">
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">{channel.title}</h4>
                    {channel.link ? (
                      <a 
                        href={channel.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-light text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group-hover:translate-x-1 inline-block transition-transform duration-300"
                      >
                        {channel.value}
                      </a>
                    ) : (
                      <p className="font-light text-gray-800 dark:text-gray-200">
                        {channel.value}
                      </p>
                    )}
                  </div>
                  
                  {channel.link && (
                    <motion.div
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                    >
                      <FaArrowRight className="text-gray-400 dark:text-gray-500 group-hover:text-blue-400 dark:group-hover:text-blue-500 transition-colors" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
            
            <ContactBenefits />
          </motion.div>
          
          {/* Contact Form - Right Side with Multi-step Approach */}
          <motion.div 
            className="lg:col-span-4 order-1 lg:order-2 bg-white/60 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/60 dark:border-gray-700/20 overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Form header with progress indicator */}
              <div className="bg-gray-50/70 dark:bg-gray-700/30 p-6 border-b border-gray-100/60 dark:border-gray-600/20">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-light tracking-wide">Connect With Me</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-light">
                    Step {formStep} of 3
                  </div>
                </div>
                
                <div className="w-full bg-gray-200/50 dark:bg-gray-600/50 h-1 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500 dark:bg-blue-400"
                    initial={{ width: `${(formStep - 1) * 33.33}%` }}
                    animate={{ width: `${formStep * 33.33}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
              
              {/* Multi-step form */}
              <div className="p-8">
                <form onSubmit={handleSubmit} noValidate>
                  <AnimatePresence mode="wait">
                    {formStep === 1 && (
                      <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div>
                          <h4 className="text-xl font-light text-gray-800 dark:text-gray-200 mb-4">
                            <span className="text-blue-500 dark:text-blue-400 mr-2">1.</span> 
                            Let&apos;s get to know you
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-light">
                            Start by sharing your basic contact information
                          </p>
                        </div>
                        
                        {/* Name field */}
                        <div className="relative">
                          <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2 font-light tracking-wide">
                            Your Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setActiveField('name')}
                            onBlur={() => setActiveField(null)}
                            required
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.name 
                                ? 'border-red-400 dark:border-red-400/70' 
                                : activeField === 'name'
                                  ? 'border-blue-400 dark:border-blue-400/70'
                                  : 'border-gray-200/50 dark:border-gray-700/40'
                            } bg-white/70 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 focus:outline-none transition duration-200`}
                            placeholder="John Doe"
                          />
                          {errors.name && (
                            <motion.p 
                              className="mt-2 text-sm text-red-400 dark:text-red-400/90"
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {errors.name}
                            </motion.p>
                          )}
                        </div>
                        
                        {/* Email field */}
                        <div className="relative">
                          <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2 font-light tracking-wide">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setActiveField('email')}
                            onBlur={() => setActiveField(null)}
                            required
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.email 
                                ? 'border-red-400 dark:border-red-400/70' 
                                : activeField === 'email'
                                  ? 'border-blue-400 dark:border-blue-400/70'
                                  : 'border-gray-200/50 dark:border-gray-700/40'
                            } bg-white/70 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 focus:outline-none transition duration-200`}
                            placeholder="john@example.com"
                          />
                          {errors.email && (
                            <motion.p 
                              className="mt-2 text-sm text-red-400 dark:text-red-400/90"
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {errors.email}
                            </motion.p>
                          )}
                        </div>
                      </motion.div>
                    )}
                    
                    {formStep === 2 && (
                      <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div>
                          <h4 className="text-xl font-light text-gray-800 dark:text-gray-200 mb-4">
                            <span className="text-blue-500 dark:text-blue-400 mr-2">2.</span> 
                            What would you like to discuss?
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-light">
                            Select a topic for our conversation
                          </p>
                        </div>
                        
                        {/* Subject field */}
                        <div className="relative">
                          <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 mb-2 font-light tracking-wide">
                            Subject
                          </label>
                          <div className="grid grid-cols-1 gap-3">
                            {PERSONAL_INFO.contactFormSubjects.map((subject) => (
                              <motion.div 
                                key={subject}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                  formData.subject === subject 
                                    ? 'border-blue-300 dark:border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/20' 
                                    : 'border-gray-200 dark:border-gray-700 bg-white/30 dark:bg-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                                }`}
                                onClick={() => setFormData(prev => ({ ...prev, subject }))}
                              >
                                <div className="flex items-center">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    formData.subject === subject 
                                      ? 'border-blue-500' 
                                      : 'border-gray-300 dark:border-gray-600'
                                  }`}>
                                    {formData.subject === subject && (
                                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                    )}
                                  </div>
                                  <span className="ml-3 font-light">{subject}</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          {errors.subject && (
                            <motion.p 
                              className="mt-2 text-sm text-red-400 dark:text-red-400/90"
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {errors.subject}
                            </motion.p>
                          )}
                        </div>
                      </motion.div>
                    )}
                    
                    {formStep === 3 && (
                      <motion.div 
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div>
                          <h4 className="text-xl font-light text-gray-800 dark:text-gray-200 mb-4">
                            <span className="text-blue-500 dark:text-blue-400 mr-2">3.</span> 
                            Share your thoughts
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-light">
                            Tell me about your project or inquiry
                          </p>
                        </div>
                        
                        {/* Message field */}
                        <div className="relative">
                          <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2 font-light tracking-wide">
                            Your Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            onFocus={() => setActiveField('message')}
                            onBlur={() => setActiveField(null)}
                            required
                            rows={5}
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.message 
                                ? 'border-red-400 dark:border-red-400/70' 
                                : activeField === 'message'
                                  ? 'border-blue-400 dark:border-blue-400/70'
                                  : 'border-gray-200/50 dark:border-gray-700/40'
                            } bg-white/70 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 focus:outline-none transition duration-200`}
                            placeholder="Hello, I&apos;m interested in discussing..."
                          ></textarea>
                          {errors.message && (
                            <motion.p 
                              className="mt-2 text-sm text-red-400 dark:text-red-400/90"
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {errors.message}
                            </motion.p>
                          )}
                        </div>
                        
                        {/* Summary section */}
                        <div className="bg-gray-50/70 dark:bg-gray-800/30 p-4 rounded-xl text-sm border border-gray-100/60 dark:border-gray-700/30">
                          <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Message Summary</h5>
                          <ul className="space-y-1 text-gray-600 dark:text-gray-400 font-light">
                            <li className="flex">
                              <span className="w-20 flex-shrink-0">From:</span>
                              <span className="font-normal text-gray-800 dark:text-gray-300">{formData.name}</span>
                            </li>
                            <li className="flex">
                              <span className="w-20 flex-shrink-0">Email:</span>
                              <span className="font-normal text-gray-800 dark:text-gray-300">{formData.email}</span>
                            </li>
                            <li className="flex">
                              <span className="w-20 flex-shrink-0">Subject:</span>
                              <span className="font-normal text-gray-800 dark:text-gray-300">{formData.subject}</span>
                            </li>
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Form navigation */}
                  <div className="flex justify-between mt-10">
                    {formStep > 1 ? (
                      <motion.button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-light transition-all hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center"
                        whileHover={{ x: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaLongArrowAltRight className="mr-2 transform rotate-180" /> Back
                      </motion.button>
                    ) : (
                      <div></div>
                    )}
                    
                    {formStep < 3 ? (
                      <motion.button
                        type="button"
                        onClick={handleNextStep}
                        className="px-6 py-3 bg-blue-500/80 text-white rounded-xl font-light transition-all hover:bg-blue-400/80 flex items-center"
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Continue <FaLongArrowAltRight className="ml-2" />
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"
                        disabled={submitStatus === 'submitting'}
                        className={`px-6 py-3 rounded-xl font-light text-white transition-all flex items-center ${
                          submitStatus === 'submitting'
                            ? 'bg-gray-400/80 cursor-not-allowed' 
                            : 'bg-blue-500/80 hover:bg-blue-400/80'
                        }`}
                        whileHover={{ scale: submitStatus !== 'submitting' ? 1.01 : 1 }}
                        whileTap={{ scale: submitStatus !== 'submitting' ? 0.99 : 1 }}
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
                      </motion.button>
                    )}
                  </div>
                </form>
                
                {/* Status messages */}
                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div 
                      className="mt-8 p-5 bg-green-50/70 text-green-700 dark:bg-green-900/20 dark:text-green-300 rounded-xl border border-green-100/60 dark:border-green-800/20 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-light">Your message has been sent successfully! I&apos;ll get back to you soon.</span>
                      </div>
                    </motion.div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <motion.div 
                      className="mt-8 p-5 bg-red-50/70 text-red-700 dark:bg-red-900/20 dark:text-red-300 rounded-xl border border-red-100/60 dark:border-red-800/20 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-light">There was an error sending your message. Please try again later.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 