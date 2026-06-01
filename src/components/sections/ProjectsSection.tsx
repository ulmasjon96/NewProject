import Project1 from '@/assets/project-1.webp';
import Project2 from '@/assets/project-2.webp';
import Project3 from '@/assets/project-3.webp';
import Project4 from '@/assets/project-4.webp';
import { ProjectCard } from '@/components/ui/project-card';
import { SectionTitle } from '@/components/ui/section-title';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ProjectsSection() {
  const { t } = useTranslation();

  const projects = [
    {
      titleKey: 'projects.project1.title',
      descKey: 'projects.project1.description',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Chart.js'],
      image: Project1,
      liveUrl: 'https://mizan-agency.uz/',
    },
    {
      titleKey: 'projects.project2.title',
      descKey: 'projects.project2.description',
      tags: ['React Native', 'Node.js', 'MongoDB'],
      image: Project2,
      liveUrl: 'https://example.com',
      codeUrl: 'https://github.com',
    },
    {
      titleKey: 'projects.project3.title',
      descKey: 'projects.project3.description',
      tags: ['Next.js', 'OpenAI', 'Supabase'],
      image: Project3,
      liveUrl: 'https://example.com',
      codeUrl: 'https://github.com',
    },
    {
      titleKey: 'projects.project4.title',
      descKey: 'projects.project4.description',
      tags: ['Vue.js', 'Python', 'PostgreSQL'],
      image: Project4,
      liveUrl: 'https://example.com',
      codeUrl: 'https://github.com',
    },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <section
        id="projects"
        className="py-20 md:py-32 bg-gradient-to-b from-background via-muted/10 to-background"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <SectionTitle number={t('projects.number')} title={t('projects.title')} />

            <div className="flex-1">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                  {t('projects.heading')}
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {t('projects.description')}
                </p>
              </m.div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.titleKey}
                    title={t(project.titleKey)}
                    description={t(project.descKey)}
                    image={project.image}
                    tags={project.tags}
                    liveUrl={project.liveUrl}
                    codeUrl={project.codeUrl}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
