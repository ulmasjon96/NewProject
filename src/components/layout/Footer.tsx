import { FooterBackgroundGradient, TextHoverEffect } from '@/components/ui/hover-footer';
import { motion } from 'framer-motion';
import { Github, Instagram, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

const socialLinks = [
  { icon: <Github size={25} />, label: 'GitHub', href: 'https://github.com/ulmasjon96' },
  { icon: <Instagram size={25} />, label: 'Instagram', href: 'https://instagram.com/' },
  { icon: <Send size={25} />, label: 'Telegram', href: 'https://t.me/ulmasjon96' },

  // { icon: <Globe size={25} />, label: 'Website', href: '#' },
];

export function Footer() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const scrollToSection = (href: string) => {
    // Resume sahifaga o'tish
    if (href === '#resume') {
      navigate('/resume');
      window.scrollTo(0, 0);
      return;
    }

    // boshqa sectionlar scroll
    const id = href.substring(1);
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const footerLinks = [
    {
      title: t('footer.aboutMe'),
      links: [
        { label: t('footer.myStory'), href: '#about' },
        { label: t('footer.skills'), href: '#skills' },
        { label: t('footer.projects'), href: '#projects' },
        { label: t('footer.resume'), href: '#resume' },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <Mail size={18} className="text-primary" />,
      text: 'ulmasjon@example.com',
      href: 'mailto:ulmasjon@example.com',
    },
    {
      icon: <Phone size={18} className="text-primary" />,
      text: '+998 99 554 05 17',
      href: 'tel:+998995540517',
    },
    {
      icon: <MapPin size={18} className="text-primary" />,
      text: t('footer.location'),
    },
  ];
  return (
    <footer
      id="footer"
      className="relative overflow-hidden rounded-3xl mx-4 md:mx-8 mb-8 bg-card/50"
    >
      <div className="relative  mb-[50px] z-10 max-w-7xl mx-auto p-8 md:p-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8 lg:gap-16 pb-12 ">
          {/* Brand section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-2">
              <span className="text-primary text-3xl">❤</span>
              <span className="text-foreground text-3xl font-bold">{t('name')}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('footer.title')}</p>
          </motion.div>

          {/* Footer link sections */}
          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (sectionIndex + 1) }}
            >
              <h4 className="text-foreground text-lg font-semibold mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label} className="relative">
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith('#')) {
                          e.preventDefault();
                          scrollToSection(link.href);
                        }
                      }}
                      className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-foreground text-lg font-semibold mb-6">
              {t('footer.contactTitle')}
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-muted-foreground hover:text-primary transition-colors">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <hr className="border-t border-border my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
          {/* Social icons */}
          <div className="flex space-x-6">
            {socialLinks.map(({ icon, label, href }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ scale: 1.2, color: 'hsl(var(--primary))' }}
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full"
              >
                {icon}
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} {t('name')}. {t('footer.copyright')}
          </p>
        </div>
      </div>

      {/* Text hover effect */}
      <div className="hidden lg:flex h-[30rem] -mt-[100px] -mb-[120px]">
        <TextHoverEffect text="O'lmas" className="z-50" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}
