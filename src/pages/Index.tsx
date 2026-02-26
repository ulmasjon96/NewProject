import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';

const HeroSection = lazy(() => import('@/components/sections/HeroSection'));
const AboutSection = lazy(() => import('@/components/sections/AboutSection'));
const SkillsSection = lazy(() => import('@/components/sections/SkillsSection'));
const ProjectsSection = lazy(() => import('@/components/sections/ProjectsSection'));
const CodeSection = lazy(() => import('@/components/sections/CodeSection'));
const ContactForm = lazy(() => import('@/components/sections/ContactForm'));

const sectionFallback = (id: string, text: string) => (
  <section id={id} className="py-32">
    <div className="text-center">{text}</div>
  </section>
);

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />

      <main>
        <Suspense
          fallback={<div className="h-screen flex items-center justify-center">{t('loading')}</div>}
        >
          <HeroSection />
        </Suspense>

        <Suspense fallback={sectionFallback('about', t('loading'))}>
          <AboutSection />
        </Suspense>

        <Suspense fallback={sectionFallback('skills', t('loading'))}>
          <SkillsSection />
        </Suspense>

        <Suspense fallback={sectionFallback('projects', t('loading'))}>
          <ProjectsSection />
        </Suspense>

        <Suspense fallback={sectionFallback('code', t('loading'))}>
          <CodeSection />
        </Suspense>

        <Suspense fallback={sectionFallback('contact', t('loading'))}>
          <ContactForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
