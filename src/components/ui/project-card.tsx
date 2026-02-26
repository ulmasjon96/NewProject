'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  codeUrl?: string;
  index: number;
}

export function ProjectCard({
  title,
  description,
  image,
  tags,
  liveUrl,
  codeUrl,
  index,
}: ProjectCardProps) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      viewport={{ once: true, margin: '-50px' }}
      className="group relative overflow-hidden rounded-2xl bg-card border border-border"
    >
      {/* Image Container */}
      <div className="relative w-full h-[280px]">
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:blur-sm"
        />

        {/* Overlay
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" /> */}

        {/* Buttons - Show on hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
          {liveUrl && (
            <motion.a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'flex items-center gap-2 rounded-full px-5 py-2.5',
                'bg-primary text-primary-foreground font-medium',
                'shadow-lg shadow-primary/25 hover:shadow-primary/40',
                'transition-all duration-300',
              )}
            >
              <ExternalLink className="h-4 w-4" />
              {t('projects.liveDemo')}
            </motion.a>
          )}

          {codeUrl && (
            <motion.a
              href={codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'flex items-center gap-2 rounded-full px-5 py-2.5',
                'bg-secondary text-secondary-foreground font-medium',
                'border border-border hover:border-primary/50',
                'transition-all duration-300',
              )}
            >
              <Github className="h-4 w-4" />
              {t('projects.sourceCode')}
            </motion.a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Glow effect on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: 'inset 0 0 60px hsl(var(--primary) / 0.1)' }}
      />
    </motion.div>
  );
}
