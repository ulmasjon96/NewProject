'use client';

import { AnimatedSection, AnimatedText } from '@/components/ui/animated-section';
import { SectionTitle } from '@/components/ui/section-title';
import { LazyMotion, domAnimation, m } from 'framer-motion';

import AboutImg1 from '@/assets/about-1.webp';
import AboutImg2 from '@/assets/about-2.webp';
import { useTranslation } from 'react-i18next';
export function AboutSection() {
  const { t } = useTranslation();
  return (
    <LazyMotion features={domAnimation}>
      <section id="about" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            {/* Section Title */}
            <SectionTitle number={t('about.number')} title={t('about.title')} />

            {/* Content */}
            <div className="flex-1 space-y-12">
              {/* First paragraph with image */}
              <AnimatedSection delay={0.2} className="flex flex-col md:flex-row gap-8 items-start">
                <m.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="w-48 h-60 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-primary/20"
                >
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                    <img src={AboutImg1} alt="" />
                  </div>
                </m.div>

                <div className="flex-1">
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    <AnimatedText delay={0.3}>{t('about.p1')}</AnimatedText>
                  </p>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-4">
                    <AnimatedText delay={0.4}>{t('about.p2')}</AnimatedText>
                  </p>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-4">
                    <AnimatedText delay={0.5}>{t('about.p3')}</AnimatedText>
                  </p>
                </div>
              </AnimatedSection>

              {/* Second paragraph with image */}
              <AnimatedSection
                delay={0.4}
                direction="left"
                className="flex flex-col md:flex-row-reverse gap-8 items-start"
              >
                <m.div
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  className="w-48 h-60 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-primary/20"
                >
                  <div className="w-full h-full bg-gradient-to-br from-muted to-primary/20 flex items-center justify-center">
                    <img src={AboutImg2} className="w-full h-full object-cover" alt="" />
                  </div>
                </m.div>

                <div className="flex-1">
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    <AnimatedText delay={0.5}>{t('about.p4')}</AnimatedText>
                  </p>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-4">
                    <AnimatedText delay={0.6}>{t('about.p5')}</AnimatedText>
                  </p>
                </div>
              </AnimatedSection>

              {/* Stats */}
              <AnimatedSection delay={0.6} direction="scale">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                  {[
                    { value: '2+', label: t('about.stat.experience') },
                    { value: '15+', label: t('about.stat.projects') },
                    { value: '10+', label: t('about.stat.technologies') },
                    { value: '100%', label: t('about.stat.dedication') },
                  ].map((stat, index) => (
                    <m.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
                    >
                      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </m.div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

export default AboutSection;
