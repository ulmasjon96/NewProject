'use client';

import { SectionTitle } from '@/components/ui/section-title';
import { SkillCard } from '@/components/ui/skill-card';
import { cn } from '@/lib/utils';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const getLocalizedSkillDesc = (rawDesc: string, language: string): string => {
  const [primaryPart, uzPart] = rawDesc.split(' - ');
  const normalizedLanguage = language.split('-')[0];

  // Most records are stored as: "English text - Uzbek text".
  if (normalizedLanguage === 'uz') {
    return (uzPart || primaryPart).trim();
  }

  // EN/RU/TJ fallback to primary part until dedicated per-language texts are added.
  return primaryPart.trim();
};

const skills = [
  {
    name: 'HTML',
    icon: 'devicon-html5-plain colored',
    level: 95,
    desc: 'Semantic HTML - semantik HTML yorliqlari.',
    category: 'frontend',
  },
  {
    name: 'CSS',
    icon: 'devicon-css3-plain colored',
    level: 80,
    desc: 'Modern styling - zamonaviy stillar.',
    category: 'frontend',
  },
  {
    name: 'SCSS',
    icon: 'devicon-sass-original colored',
    level: 80,
    desc: 'Modular, maintainable, and nested styling using Sass preprocessor.',
    category: 'frontend',
  },
  {
    name: 'JavaScript',
    icon: 'devicon-javascript-plain colored',
    level: 60,
    desc: 'ES6+, DOM, OOP - JavaScript asoslari.',
    category: 'frontend',
  },
  {
    name: 'TypeScript',
    icon: 'devicon-typescript-plain colored',
    level: 60,
    desc: 'Static types - statik tiplar bilan JavaScript.',
    category: 'frontend',
  },
  {
    name: 'React',
    icon: 'devicon-react-original colored',
    level: 60,
    desc: 'Hooks, JSX - React kutubxonasi.',
    category: 'frontend',
  },
  // {
  //   name: 'Vue.js',
  //   icon: 'devicon-vuejs-plain colored',
  //   level: 0,
  //   desc: 'MVVM, Directives - Vue framework.',
  //   category: 'frontend',
  // },
  // {
  //   name: 'Bootstrap',
  //   icon: 'devicon-bootstrap-plain colored',
  //   level: 0,
  //   desc: 'Using Bootstrap for responsive design and ready UI components.',
  //   category: 'frontend',
  // },
  {
    name: 'Tailwind CSS',
    icon: 'devicon-tailwindcss-plain colored',
    level: 70,
    desc: 'Utility-first CSS framework for custom and fast UI styling.',
    category: 'frontend',
  },
  // {
  //   name: 'Angular',
  //   icon: 'devicon-angularjs-plain colored',
  //   level: 0,
  //   desc: 'Angular is a platform for building web apps.',
  //   category: 'frontend',
  // },

  // ========================================
  // BACKEND - SERVER TOMONI
  // ========================================
  // {
  //   name: 'Java',
  //   icon: 'devicon-java-plain colored',
  //   level: 0,
  //   desc: 'Java runs on billions of devices.',
  //   category: 'backend',
  // },
  // {
  //   name: 'C++',
  //   icon: 'devicon-cplusplus-plain colored',
  //   level: 0,
  //   desc: 'C++ is powerful and efficient.',
  //   category: 'backend',
  // },
  // {
  //   name: 'C#',
  //   icon: 'devicon-csharp-plain colored',
  //   level: 0,
  //   desc: 'C# is popular for Windows apps.',
  //   category: 'backend',
  // },
  // {
  //   name: 'Go',
  //   icon: 'devicon-go-plain colored',
  //   level: 0,
  //   desc: 'Go is fast and scalable.',
  //   category: 'backend',
  // },
  // {
  //   name: 'Rust',
  //   icon: 'devicon-rust-plain colored',
  //   level: 0,
  //   desc: 'Rust focuses on safety and speed.',
  //   category: 'backend',
  // },
  // {
  //   name: 'Scala',
  //   icon: 'devicon-scala-plain colored',
  //   level: 0,
  //   desc: 'Scala mixes OOP and functional.',
  //   category: 'backend',
  // },
  // {
  //   name: 'NestJS',
  //   icon: 'devicon-nestjs-plain colored',
  //   level: 0,
  //   desc: 'Modular backend architecture using TypeScript.',
  //   category: 'backend',
  // },
  // {
  //   name: 'Node.js',
  //   icon: 'devicon-nodejs-plain colored',
  //   level: 0,
  //   desc: 'Server-side JS - serverda JavaScript.',
  //   category: 'backend',
  // },
  // {
  //   name: 'Express.js',
  //   icon: 'devicon-express-original colored',
  //   level: 0,
  //   desc: 'REST APIs - REST API yaratish.',
  //   category: 'backend',
  // },
  // {
  //   name: 'PHP',
  //   icon: 'devicon-php-plain colored',
  //   level: 0,
  //   desc: 'Web scripting - veb skriptlar.',
  //   category: 'backend',
  // },
  // {
  //   name: 'Laravel',
  //   icon: 'devicon-laravel-plain colored',
  //   level: 0,
  //   desc: 'MVC framework - Laravel framework.',
  //   category: 'backend',
  // },
  {
    name: 'Python',
    icon: 'devicon-python-plain colored',
    level: 25,
    desc: 'Scripting & backend - skriptlar va backend.',
    category: 'backend',
  },
  {
    name: 'Django',
    icon: 'devicon-django-plain colored',
    level: 10,
    desc: 'Web framework - Python web framework.',
    category: 'backend',
  },
  {
    name: 'Ruby',
    icon: 'devicon-ruby-plain colored',
    level: 0,
    desc: 'OOP scripting - OOP skript tili.',
    category: 'backend',
  },
  {
    name: 'Rails',
    icon: 'devicon-rails-plain colored',
    level: 0,
    desc: 'Convention framework - Ruby on Rails.',
    category: 'backend',
  },

  // // ========================================
  // // DATABASE - MA'LUMOTLAR BAZASI
  // // ========================================
  // {
  //   name: 'MongoDB',
  //   icon: 'devicon-mongodb-plain colored',
  //   level: 0,
  //   desc: "NoSQL DB - NoSQL ma'lumotlar bazasi.",
  //   category: 'database',
  // },
  // {
  //   name: 'MySQL',
  //   icon: 'devicon-mysql-plain colored',
  //   level: 0,
  //   desc: "Relational DB - relyatsion ma'lumotlar bazasi.",
  //   category: 'database',
  // },
  // {
  //   name: 'PostgreSQL',
  //   icon: 'devicon-postgresql-plain colored',
  //   level: 0,
  //   desc: "SQL DB - SQL ma'lumotlar bazasi.",
  //   category: 'database',
  // },
  // {
  //   name: 'Firebase',
  //   icon: 'devicon-firebase-plain colored',
  //   level: 0,
  //   desc: "Realtime DB - real vaqtli ma'lumotlar bazasi.",
  //   category: 'database',
  // },
  // {
  //   name: 'Redis',
  //   icon: 'devicon-redis-plain colored',
  //   level: 0,
  //   desc: 'Caching - kesh saqlash tizimi.',
  //   category: 'database',
  // },

  // ========================================
  // DEVOPS - DEVOPS VA TOOLLAR
  // ========================================
  {
    name: 'Git',
    icon: 'devicon-git-plain colored',
    level: 40,
    desc: 'Version control - versiya nazorati.',
    category: 'devops',
  },
  {
    name: 'GitHub',
    icon: 'devicon-github-original colored',
    level: 60,
    desc: 'CI/CD, repos - kod saqlash va CI/CD.',
    category: 'devops',
  },
  {
    name: 'Docker',
    icon: 'devicon-docker-plain colored',
    level: 0,
    desc: 'Containers - konteynerlar.',
    category: 'devops',
  },
  // {
  //   name: 'Kubernetes',
  //   icon: 'devicon-kubernetes-plain colored',
  //   level: 0,
  //   desc: 'Orchestration - konteyner orkestratsiyasi.',
  //   category: 'devops',
  // },
  // {
  //   name: 'Linux',
  //   icon: 'devicon-linux-plain colored',
  //   level: 0,
  //   desc: 'CLI, scripts - terminal va skriptlar.',
  //   category: 'devops',
  // },
  // {
  //   name: 'Nginx',
  //   icon: 'devicon-nginx-plain colored',
  //   level: 0,
  //   desc: 'Reverse proxy - teskari proksi server.',
  //   category: 'devops',
  // },
  // {
  //   name: 'Jenkins',
  //   icon: 'devicon-jenkins-plain colored',
  //   level: 0,
  //   desc: 'CI/CD - avtomatik build va deploy.',
  //   category: 'devops',
  // },
  // {
  //   name: 'GraphQL',
  //   icon: 'devicon-graphql-plain colored',
  //   level: 0,
  //   desc: "Query APIs - API so'rovlari.",
  //   category: 'devops',
  // },
  // {
  //   name: 'Postman',
  //   icon: 'devicon-postman-plain colored',
  //   level: 0,
  //   desc: 'API testing - API testlash.',
  //   category: 'devops',
  // },

  // ========================================
  // DESIGN - DIZAYN DASTURLARI
  // ========================================
  {
    name: 'Figma',
    icon: 'devicon-figma-plain colored',
    level: 70,
    desc: 'UI/UX Design - interfeys dizayni.',
    category: 'design',
  },
  {
    name: 'Adobe XD',
    icon: 'devicon-xd-plain colored',
    level: 0,
    desc: 'Prototyping - prototip yaratish.',
    category: 'design',
  },
  {
    name: 'Photoshop',
    icon: 'devicon-photoshop-plain colored',
    level: 0,
    desc: 'Image editing - rasm tahrirlash.',
    category: 'design',
  },
  {
    name: 'Illustrator',
    icon: 'devicon-illustrator-plain colored',
    level: 0,
    desc: 'Adobe Illustrator is used for vector graphics.',
    category: 'design',
  },

  // // ========================================
  // // CMS - KONTENT BOSHQARISH TIZIMLARI
  // // ========================================
  // {
  //   name: 'WordPress',
  //   icon: 'devicon-wordpress-plain colored',
  //   level: 0,
  //   desc: 'CMS platform - kontent boshqarish tizimi.',
  //   category: 'cms',
  // },
  // {
  //   name: 'Drupal',
  //   icon: 'devicon-drupal-plain colored',
  //   level: 0,
  //   desc: 'Content framework - kontent framework.',
  //   category: 'cms',
  // },

  // // ========================================
  // // TESTING - TEST YOZISH VOSITALARI
  // // ========================================
  // {
  //   name: 'Jest',
  //   icon: 'devicon-jest-plain colored',
  //   level: 0,
  //   desc: 'JavaScript testing - JavaScript testlash.',
  //   category: 'testing',
  // },
  // {
  //   name: 'Mocha',
  //   icon: 'devicon-mocha-plain colored',
  //   level: 0,
  //   desc: 'JS test framework - JS test framework.',
  //   category: 'testing',
  // },
  // {
  //   name: 'Selenium',
  //   icon: 'devicon-selenium-plain colored',
  //   level: 0,
  //   desc: 'Automation testing - avtomatik testlash.',
  //   category: 'testing',
  // },

  // // ========================================
  // // MOBILE - MOBIL DASTURLASH
  // // ========================================
  // {
  //   name: 'Flutter',
  //   icon: 'devicon-flutter-plain colored',
  //   level: 0,
  //   desc: 'Cross-platform mobile - kross-platforma mobil.',
  //   category: 'mobile',
  // },
  // {
  //   name: 'React Native',
  //   icon: 'devicon-react-original colored',
  //   level: 0,
  //   desc: 'Mobile apps in React - React bilan mobil.',
  //   category: 'mobile',
  // },
  // {
  //   name: 'Kotlin',
  //   icon: 'devicon-kotlin-plain colored',
  //   level: 0,
  //   desc: 'Android development - Android dasturlash.',
  //   category: 'mobile',
  // },
  // {
  //   name: 'Swift',
  //   icon: 'devicon-swift-plain colored',
  //   level: 0,
  //   desc: 'iOS development - iOS dasturlash.',
  //   category: 'mobile',
  // },
];

export function SkillsSection() {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('frontend');
  const activeLanguage = (i18n.resolvedLanguage || i18n.language || 'uz').split('-')[0];

  const categories = [
    { id: 'frontend', label: t('skills.category.frontend') },
    { id: 'backend', label: t('skills.category.backend') },
    // { id: 'database', label: t('skills.category.database') },
    { id: 'devops', label: t('skills.category.devops') },
    { id: 'design', label: t('skills.category.design') },
    // { id: 'cms', label: t('skills.category.cms') },
    // { id: 'testing', label: t('skills.category.testing') },
    // { id: 'mobile', label: t('skills.category.mobile') },
  ];

  const filteredSkills = skills.filter((skill) => skill.category === activeCategory);

  return (
    <LazyMotion features={domAnimation}>
      <section id="skills" className="py-20 md:py-32">
        <div className="container mx-auto px-4  ">
          <div className=" flex flex-col md:flex-row gap-8 md:gap-16">
            {/* Section Title */}
            <SectionTitle number={t('skills.number')} title={t('skills.title')} />

            {/* Content */}
            <div className="flex-1 ">
              {/* Heading */}
              <m.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-3xl md:text-4xl text-foreground text-center mb-8"
              >
                {t('skills.heading')}
              </m.h3>
              {/* Filter buttons */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap justify-center gap-3 mb-12"
              >
                {categories.map((category) => (
                  <m.button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'px-5 py-2 rounded-full text-sm font-medium transition-all',
                      activeCategory === category.id
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                        : 'bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
                    )}
                  >
                    {category.label}
                  </m.button>
                ))}
              </m.div>
              {/* Skills grid */}
              <m.div
                layout
                className="

								h-[478px]
                overflow-y-auto
                overflow-x-hidden
								grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4
              "
              >
                <AnimatePresence mode="popLayout">
                  {filteredSkills.map((skill, index) => (
                    <SkillCard
                      key={skill.name}
                      name={skill.name}
                      icon={skill.icon}
                      level={skill.level}
                      desc={getLocalizedSkillDesc(skill.desc, activeLanguage)}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </m.div>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

export default SkillsSection;
