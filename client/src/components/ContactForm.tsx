'use client';

import { useState, useRef, type FormEvent } from 'react';
import { motion, useInView } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSend, FiUser, FiMail, FiMessageSquare, FiCheck } from 'react-icons/fi';
import { createContact } from '@/lib/database';

const ease = [0.25, 1, 0.5, 1] as [number, number, number, number];

const fieldVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease },
  }),
};

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await createContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setIsSuccess(true);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 2000);
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={ref} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          custom={0}
          variants={fieldVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <label className="block text-sm font-medium app-heading mb-2">
            <FiUser className="inline w-4 h-4 mr-1" />
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="app-input px-4 py-3 rounded-lg"
            placeholder="Your name"
          />
        </motion.div>
        <motion.div
          custom={1}
          variants={fieldVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <label className="block text-sm font-medium app-heading mb-2">
            <FiMail className="inline w-4 h-4 mr-1" />
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="app-input px-4 py-3 rounded-lg"
            placeholder="your@email.com"
          />
        </motion.div>
      </div>

      <motion.div
        custom={2}
        variants={fieldVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <label className="block text-sm font-medium app-heading mb-2">
          Subject
        </label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="app-input px-4 py-3 rounded-lg"
          placeholder="What's this about?"
        />
      </motion.div>

      <motion.div
        custom={3}
        variants={fieldVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <label className="block text-sm font-medium app-heading mb-2">
          <FiMessageSquare className="inline w-4 h-4 mr-1" />
          Message *
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={5}
          className="app-input app-break-anywhere px-4 py-3 rounded-lg resize-none"
          placeholder="Your message..."
        />
      </motion.div>

      <motion.div
        custom={4}
        variants={fieldVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="app-btn-primary app-touch-target inline-flex w-full sm:w-auto justify-center items-center gap-2 px-8 py-3 font-medium rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
        >
          {isSubmitting ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              />
              Sending...
            </>
          ) : isSuccess ? (
            <motion.span
              className="inline-flex items-center gap-2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <FiCheck className="w-4 h-4" />
              Sent!
            </motion.span>
          ) : (
            <>
              <FiSend className="w-4 h-4" />
              Send Message
            </>
          )}
        </motion.button>
      </motion.div>
    </form>
  );
}
