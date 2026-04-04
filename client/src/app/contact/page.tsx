import type { Metadata } from 'next';
import SectionHeading from '@/components/SectionHeading';
import ContactForm from '@/components/ContactForm';
import AnimatedSection from '@/components/AnimatedSection';
import { FaEnvelope } from 'react-icons/fa6';
import { FiMapPin, FiPhone } from 'react-icons/fi';
import { getHomeSections, getSocialLinks } from '@/lib/database';
import { getSocialIcon } from '@/lib/socialIcons';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact | Portfolio',
  description: 'Get in touch with me for collaboration or inquiries.',
};

function findSectionValue(
  sections: Awaited<ReturnType<typeof getHomeSections>>,
  candidates: string[],
) {
  for (const section of sections) {
    if (candidates.includes(section.section_name.toLowerCase())) {
      return section.content;
    }
  }

  return '';
}

export default async function ContactPage() {
  const [homeSections, socialLinks] = await Promise.all([
    getHomeSections().catch(() => []),
    getSocialLinks().catch(() => []),
  ]);

  const location = findSectionValue(homeSections, ['location']);
  const email = findSectionValue(homeSections, ['email'])
    || socialLinks.find((link) => link.platform.toLowerCase() === 'email')?.url.replace(/^mailto:/, '')
    || '';
  const phone = findSectionValue(homeSections, ['phone']);

  const contactInfo = [
    { icon: FiMapPin, label: 'Location', value: location || 'Not set in admin panel' },
    { icon: FaEnvelope, label: 'Email', value: email || 'Not set in admin panel' },
    { icon: FiPhone, label: 'Phone', value: phone || 'Not set in admin panel' },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Get in Touch" subtitle="Have a question or want to work together?" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <AnimatedSection className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="p-3 rounded-lg app-chip">
                    <info.icon className="w-5 h-5 app-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium app-muted">{info.label}</h3>
                    <p className="app-heading wrap-break-word">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-medium app-muted mb-3">Follow me</h3>
              <div className="flex gap-3 flex-wrap">
                {socialLinks.length === 0 && (
                  <p className="text-sm app-muted">
                    No social links configured from admin panel.
                  </p>
                )}
                {socialLinks.map((social) => {
                  const Icon = getSocialIcon(social.icon_class);
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg app-icon-button app-surface-soft transition-all"
                      aria-label={social.platform}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>

          <div className="lg:col-span-3">
            <div className="app-surface p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
