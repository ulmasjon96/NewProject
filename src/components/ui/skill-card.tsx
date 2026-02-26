import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface SkillCardProps {
  name: string;
  icon: string;
  level: number;
  index: number;
  desc?: string;
}

const getBadgeKey = (level: number): string => {
  if (level >= 90) return 'skills.badge.expert';
  if (level >= 75) return 'skills.badge.advanced';
  if (level >= 60) return 'skills.badge.intermediate';
  if (level >= 45) return 'skills.badge.beginner';
  if (level >= 10) return 'skills.badge.basic';
  return 'skills.badge.learning';
};

const getBadgeColor = (level: number): string => {
  if (level >= 75) return 'bg-green-500/15 text-green-400';
  if (level >= 45) return 'bg-primary/15 text-primary';
  if (level >= 10) return 'bg-yellow-500/15 text-yellow-400';
  return 'bg-muted text-muted-foreground';
};

export const SkillCard = React.forwardRef<HTMLDivElement, SkillCardProps>(
  ({ name, icon, level, index, desc }, ref) => {
    const { t } = useTranslation();
    const badge = t(getBadgeKey(level));
    const badgeColor = getBadgeColor(level);

    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const closeModal = () => setIsModalOpen(false);

    return (
      <>
        {/* SKILL CARD */}
        <motion.div
          ref={ref}
          layout
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.35, delay: index * 0.04 }}
          whileHover={{ y: -6, scale: 1.04 }}
          onClick={() => setIsModalOpen(true)}
          className={cn(
            'relative group flex flex-col items-center gap-3 w-full h-[140px]',
            'p-5 rounded-2xl overflow-hidden',
            'bg-card border border-border text-foreground',
            'hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10',
            'transition-all duration-300 ease-out cursor-pointer',
          )}
        >
          {/* ICON */}
          <div className="text-4xl text-primary/90">
            <i className={icon} />
          </div>

          {/* NAME */}
          <span className="text-sm font-semibold text-center leading-tight">{name}</span>

          {/* PROGRESS */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${level}%` }}
              transition={{
                duration: 0.9,
                ease: 'easeOut',
                delay: 0.1 + index * 0.04,
              }}
              className="h-full bg-primary rounded-full"
            />
          </div>

          {/* BADGE (hover) */}
          <div
            className="
            absolute top-3 right-3
            px-2 py-1 text-xs rounded-full
            bg-primary/75 text-primary-foreground font-medium
            opacity-0 scale-90
            group-hover:opacity-100         group-hover:scale-100
            transition-all duration-300
            pointer-events-none
          "
          >
            {badge} ({level}%)
          </div>
        </motion.div>

        {/* MODAL */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-card text-foreground p-6 rounded-2xl max-w-md w-full text-center"
              >
                {/* CLOSE */}
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-4 text-muted-foreground hover:text-primary transition-colors"
                >
                  <X size={22} />
                </button>

                {/* TITLE */}
                <h2 className="text-2xl font-bold mb-3 text-primary">{name}</h2>

                {/* DESC */}
                <p className="text-muted-foreground">{desc || t('skills.noDesc')}</p>

                {/* LEVEL */}
                <div className="mt-4 font-semibold text-primary">
                  {t('skills.level')}: {level}% — {badge}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  },
);

SkillCard.displayName = 'SkillCard';
