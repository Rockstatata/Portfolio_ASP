import SectionHeading from '@/components/SectionHeading';
import ContactForm from '@/components/ContactForm';
import AnimatedSection from '@/components/AnimatedSection';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { FiMapPin, FiPhone } from 'react-icons/fi';

export const metadata = {
  title: 'Contact | Portfolio',
  description: 'Get in touch with me for collaboration or inquiries.',
};

const contactInfo = [
  { icon: FiMapPin, label: 'Location', value: 'San Francisco, CA' },
  { icon: FaEnvelope, label: 'Email', value: 'hello@example.com' },
  { icon: FiPhone, label: 'Phone', value: '+1 (555) 000-0000' },
];

const socialLinks = [
  { icon: FaGithub, href: 'https://github.com', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
];

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Get in Touch" subtitle="Have a question or want to work together?" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <AnimatedSection className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <info.icon className="w-5 h-5 text-[#DC143C]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{info.label}</h3>
                    <p className="text-gray-900 dark:text-white">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Follow me</h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[#DC143C] hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
