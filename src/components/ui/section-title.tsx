import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  number: string;
  title: string;
  className?: string;
}

export function SectionTitle({ number, title, className }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={cn('flex items-center', className)}
    >
      {/* Mobile (Horizontal) */}
      <div className="md:hidden flex flex-col-reverse w-full">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl sm:text-4xl text-primary font-bold">{number}</span>
          <div className="h-1 w-6 sm:w-8 bg-primary/30 flex-grow"></div>
        </div>
        <h2
          className="stroke-text

        text-[2.2rem] sm:text-6xl font-bold uppercase tracking-wide cursor-pointer transition-colors duration-300 hover:text-primary"
        >
          {title}
        </h2>
      </div>

      {/* Desktop (Vertical) */}
      <div className="hidden md:flex items-center h-64 lg:h-72 xl:h-80">
        <div className="[writing-mode:vertical-rl] flex  flex-col-reverse -rotate-180  gap-4 lg:gap-6 xl:gap-8 hover:text-primary duration-300  transition-all ">
          <span className="text-2.5xl font-bold lg:text-3xl xl:text-4xl text-primary  ">
            {number}
          </span>
          <h2
            className=" stroke-text

          text-6xl lg:text-6xl whitespace-nowrap  xl:text-[4rem] font-extrabold uppercase tracking-[0.15em] lg:tracking-[0.15em] cursor-pointer  "
          >
            {title}
          </h2>
        </div>
      </div>
    </motion.div>
  );
}
