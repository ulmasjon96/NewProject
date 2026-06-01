import heroBg from '@/assets/hero-bg.webp';
import HeroImg from '@/assets/heroSection.webp';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { SocialIcon } from '@/components/ui/social-icon';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Typewriter } from '@/components/ui/typewriter';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import Github from 'lucide-react/dist/esm/icons/github';
import Instagram from 'lucide-react/dist/esm/icons/instagram';
import Send from 'lucide-react/dist/esm/icons/send';

interface SocialIconData {
  href: string;
  icon: React.ReactNode;
  label: string;
  platform: 'github' | 'vk' | 'instagram' | 'telegram';
}

const socialIcons: SocialIconData[] = [
  {
    href: 'https://github.com/ulmasjon96',
    icon: <Github className="h-6 w-6" />,
    label: 'GitHub',
    platform: 'github',
  },
  {
    href: 'https://instagram.com',
    icon: <Instagram className="h-6 w-6" />,
    label: 'Instagram',
    platform: 'instagram',
  },
  {
    href: 'https://t.me/Ulmasjon96',
    icon: <Send className="h-6 w-6" />,
    label: 'Telegram',
    platform: 'telegram',
  },
];

export function HeroSection() {
  const { t } = useTranslation();

  const typewriterPhrases = [
    t('hero.typewriter.name'),
    t('hero.typewriter.frontend'),
    t('hero.typewriter.uiux'),
    t('hero.typewriter.web3'),
  ];

  const greeting = t('hero.greeting');

  return (
    <LazyMotion features={domAnimation}>
      {' '}
      <section className="relative  flex flex-col overflow-hidden bg-background">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />

        {/* Animated grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Top bar with social icons and theme toggle */}
        <m.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="relative z-10 flex items-center justify-between p-4 md:p-8"
        >
          <SocialIcon
            href="https://github.com"
            icon={<Github className="h-6 w-6" />}
            label="GitHub"
            platform="github"
            delay={1.6}
          />

          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {socialIcons.slice(1).map((social, index) => (
                <SocialIcon key={social.label} {...social} delay={1.7 + index * 0.1} />
              ))}
            </div>
            <LanguageSwitcher className="hidden md:flex items-center" />
            {/* Mobile Language Switcher - between logo and hamburger */}
            <LanguageSwitcher className="md:hidden flex items-center" />
            <ThemeToggle />
          </div>
        </m.header>

        {/* Hero content */}
        <div className="relative z-10 flex-1   mt-16">
          <div className="w-full max-w-[89rem] mx-auto">
            <div
              className="
              flex
							justify-between

							flex-col
							lg:flex-row

              gap-8 lg:gap-12
              items-center
              w-full
            "
            >
              {/* ================= IMAGE ================= */}
              <m.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="
              flex justify-center
              order-first lg:order-last
              lg:justify-self-end
            "
              >
                <div className="relative ">
                  {/* Outer rotating ring */}
                  <m.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-6 rounded-full border-2 border-dashed border-primary/20"
                  />

                  {/* Inner rotating ring */}
                  <m.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-3 rounded-full border border-primary/30"
                  />

                  {/* Glow */}
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />

                  {/* Main image */}
                  <m.div
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="
              relative
              flex items-center justify-center
              w-[300px] h-[300px]
              md:w-[360px] md:h-[360px]
              lg:w-[460px] lg:h-[460px]
              rounded-full
              bg-gradient-to-br from-primary/30 via-primary/10 to-transparent
              backdrop-blur-sm
              border border-primary/20
              shadow-2xl shadow-primary/20
              overflow-hidden
            "
                  >
                    <img
                      src={HeroImg}
                      alt="Developer workspace"
                      width={800}
                      height={533}
                      loading="eager"
                      decoding="sync"
                      fetchPriority="high"
                      className="w-[100%] h-[100%] object-cover rounded-2xl shadow-xl"
                    />
                  </m.div>

                  {/* Floating dots */}
                  <m.div
                    animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-4 -right-4 w-4 h-4 rounded-full bg-primary/60"
                  />
                  <m.div
                    animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-[hsl(var(--glow-pink))]/60"
                  />
                </div>
              </m.div>

              {/* ================= TEXT ================= */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="
          order-last lg:order-first
          lg:justify-self-start
          text-center lg:text-left
        "
              >
                {/* Greeting */}
                <m.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="font-elegant text-4xl md:text-5xl lg:text-6xl mb-4 text-glow"
                >
                  {greeting.split('').map((char, i) => (
                    <m.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.1, delay: 0.6 + i * 0.04 }}
                    >
                      {char}
                    </m.span>
                  ))}
                </m.h1>

                {/* Name */}
                <div className="mb-8 overflow-hidden">
                  <h2 className="typewriter-text text-6xl  text-foreground text-reflect text-glow-lg md:text-7xl h-[2em] font-bold uppercase tracking-wider text-glow-lg">
                    <Typewriter phrases={typewriterPhrases} speed={100} />
                  </h2>
                </div>

                {/* Button */}
                <m.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 2 }}
                  className="flex justify-center lg:justify-start"
                >
                  <m.a
                    href="#contact"
                    whileTap={{ scale: 0.97 }}
                    className="group relative inline-flex items-center gap-1 overflow-hidden rounded-[100px] border-4 border-transparent bg-transparent px-7 py-3.5 text-sm font-semibold text-primary no-underline shadow-[0_0_0_2px_hsl(var(--primary))] transition-[border-radius,box-shadow,color] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:rounded-xl hover:text-[hsl(var(--primary-foreground))] hover:shadow-[0_0_0_12px_transparent] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:shadow-[0_0_0_4px_hsl(var(--primary)/0.75)] sm:px-9 sm:py-4 sm:text-base"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="absolute left-4 z-20 w-6 -translate-x-16 opacity-0 fill-primary transition-[transform,opacity,fill] duration-700 will-change-transform [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100 group-hover:fill-[hsl(var(--primary-foreground))]"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                    </svg>
                    <span className="relative z-30 -translate-x-2 transition-transform duration-700 will-change-transform [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
                      {t('hero.contactBtn')}
                    </span>
                    <span className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-primary opacity-0 transition-[transform,opacity] duration-700 will-change-transform [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
                    <svg
                      viewBox="0 0 24 24"
                      className="absolute right-4 z-20 w-6 translate-x-0 opacity-100 fill-primary transition-[transform,opacity,fill] duration-700 will-change-transform [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-16 group-hover:opacity-0 group-hover:fill-[hsl(var(--primary-foreground))]"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                    </svg>
                  </m.a>
                </m.div>
              </m.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="relative z-10 flex justify-center pb-8"
        >
          <m.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-sm">{t('hero.scrollDown')}</span>
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex justify-center pt-2">
              <m.div
                animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-3 rounded-full bg-primary"
              />
            </div>
          </m.div>
        </m.div>
      </section>
    </LazyMotion>
  );
}

export default HeroSection;
