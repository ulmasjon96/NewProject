'use client';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const NAV_LINKS = [
  {
    href: '#about',
    labelKey: 'nav.about',
    hoverColor: 'hover:text-[hsl(var(--glow-cyan))]',
    activeColor: 'text-[hsl(var(--glow-cyan))]',
  },
  {
    href: '#skills',
    labelKey: 'nav.skills',
    hoverColor: 'hover:text-[hsl(var(--glow-pink))]',
    activeColor: 'text-[hsl(var(--glow-pink))]',
  },
  {
    href: '#projects',
    labelKey: 'nav.projects',
    hoverColor: 'hover:text-[hsl(var(--glow-yellow))]',
    activeColor: 'text-[hsl(var(--glow-yellow))]',
  },
  {
    href: '#code',
    labelKey: 'nav.code',
    hoverColor: 'hover:text-[hsl(142,76%,50%)]',
    activeColor: 'text-[hsl(142,76%,50%)]',
  },
  {
    href: '#contact',
    labelKey: 'nav.contact',
    hoverColor: 'hover:text-[hsl(var(--glow-blue))]',
    activeColor: 'text-[hsl(var(--glow-blue))]',
  },
];

const getSectionId = (href: string) => href.replace('#', '');
const SECTION_IDS = NAV_LINKS.map((link) => getSectionId(link.href));

export function Header() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    let frame = 0;

    const updateVisibility = () => {
      const visible = window.scrollY >= 600;
      setIsVisible((prev) => (prev === visible ? prev : visible));
      frame = 0;
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (section): section is HTMLElement => Boolean(section),
    );
    if (!sections.length) return;

    // IntersectionObserver avoids synchronous layout reads on each scroll tick.
    const sectionRatios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const sectionId = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) {
            sectionRatios.set(sectionId, entry.intersectionRatio);
          } else {
            sectionRatios.delete(sectionId);
          }
        }

        let nextActive = '';
        let maxRatio = 0;
        for (const sectionId of SECTION_IDS) {
          const ratio = sectionRatios.get(sectionId) ?? 0;
          if (ratio > maxRatio) {
            maxRatio = ratio;
            nextActive = sectionId;
          }
        }

        if (nextActive) {
          setActiveSection((prev) => (prev === nextActive ? prev : nextActive));
        }
      },
      {
        root: null,
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.7, 1],
      },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-background/80 backdrop-blur-lg border-b border-border',
      )}
    >
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-3 md:grid md:grid-cols-[minmax(220px,1fr)_auto_minmax(220px,1fr)] md:gap-6">
          {/* Logo */}
          <a
            href="#"
            className="max-w-[185px] truncate font-display text-[1.15rem] sm:text-[1.3rem] md:max-w-none md:text-2xl text-foreground hover:text-primary transition-colors md:justify-self-start"
          >
            {t('header.logo')}
          </a>

          {/* Mobile Language Switcher - between logo and hamburger */}
          <LanguageSwitcher className="md:hidden flex items-center" />

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center justify-center gap-6 lg:gap-8">
            {NAV_LINKS.map((link) => {
              const sectionId = getSectionId(link.href);
              const isActive = activeSection === sectionId;

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setActiveSection(sectionId)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'nav-link-hover-flicker relative text-2xl font-bold uppercase tracking-wide pb-1.5',

                      'text-foreground transition-all duration-300',
                      link.hoverColor,

                      // underline
                      "after:content-[''] after:absolute after:w-full after:h-1",
                      'after:bg-current after:bottom-0 after:left-0',
                      'after:scale-x-0 after:origin-right after:transition-transform',
                      'hover:after:scale-x-100 hover:after:origin-left',

                      // ACTIVE STATE 🔥
                      isActive &&
                        cn(
                          link.activeColor,
                          'after:scale-x-100 after:origin-left nav-link-flicker',
                        ),
                    )}
                  >
                    {t(link.labelKey)}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3 md:justify-self-end md:justify-end md:gap-4">
            {/* Desktop Language Switcher */}
            <LanguageSwitcher className="hidden md:flex items-center" />
            <ThemeToggle className="hidden md:flex items-center" />
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              className="md:hidden text-foreground hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-lg z-40"
          >
            <nav className="container mx-auto px-4 py-8">
              <ul className="flex flex-col items-center gap-8">
                {NAV_LINKS.map((link, index) => {
                  const sectionId = getSectionId(link.href);
                  const isActive = activeSection === sectionId;

                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <a
                        href={link.href}
                        onClick={() => {
                          setActiveSection(sectionId);
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          'nav-link-hover-flicker text-2xl font-bold uppercase tracking-widest text-foreground transition-colors',
                          link.hoverColor,
                          isActive && cn(link.activeColor, 'nav-link-flicker'),
                        )}
                      >
                        {t(link.labelKey)}
                      </a>
                    </motion.li>
                  );
                })}
                <ThemeToggle />
              </ul>

              {/* Background watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[60deg] pointer-events-none">
                <span className="text-[130px] font-bold uppercase stroke-text opacity-30">
                  {t('name')}
                </span>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
