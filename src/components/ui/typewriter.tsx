'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TypewriterProps {
  phrases: string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
}

export function Typewriter({
  phrases,
  className,
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
}: TypewriterProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) {
      if (currentText) setCurrentText('');
      if (isDeleting) setIsDeleting(false);
      if (currentPhraseIndex !== 0) setCurrentPhraseIndex(0);
      return;
    }

    const currentPhrase = phrases[currentPhraseIndex] ?? '';
    let pauseTimeout: ReturnType<typeof window.setTimeout> | null = null;

    const timeout = window.setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < currentPhrase.length) {
            setCurrentText(currentPhrase.slice(0, currentText.length + 1));
          } else {
            pauseTimeout = window.setTimeout(() => setIsDeleting(true), pauseTime);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    );

    return () => {
      window.clearTimeout(timeout);
      if (pauseTimeout) {
        window.clearTimeout(pauseTimeout);
      }
    };
  }, [currentText, isDeleting, currentPhraseIndex, phrases, speed, deleteSpeed, pauseTime]);

  return (
    <span className={cn('inline-block', className)}>
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1 inline-block w-[3px] h-[1em] bg-primary align-middle"
      />
    </span>
  );
}
