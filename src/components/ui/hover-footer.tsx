'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState, type MouseEvent } from 'react';

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const boundsRef = useRef({ left: 0, top: 0, width: 1, height: 1 });

  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: '50%', cy: '50%' });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const updateBounds = () => {
      const rect = svg.getBoundingClientRect();
      boundsRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width || 1,
        height: rect.height || 1,
      };
    };

    updateBounds();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateBounds);
      resizeObserver.observe(svg);
    }

    window.addEventListener('scroll', updateBounds, { passive: true });
    window.addEventListener('resize', updateBounds, { passive: true });

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', updateBounds);
      window.removeEventListener('resize', updateBounds);
    };
  }, []);

  const handleMouseMove = (event: MouseEvent<SVGSVGElement>) => {
    const { left, top, width, height } = boundsRef.current;
    const cx = ((event.clientX - left) / width) * 100;
    const cy = ((event.clientY - top) / height) * 100;

    const safeCx = Math.min(100, Math.max(0, cx || 50));
    const safeCy = Math.min(100, Math.max(0, cy || 50));

    setMaskPosition({
      cx: `${safeCx}%`,
      cy: `${safeCy}%`,
    });
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className={cn('select-none uppercase cursor-pointer', className)}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <radialGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx={maskPosition.cx}
          cy={maskPosition.cy}
          r="40%"
        >
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
          <stop offset="40%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          <stop offset="70%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: '50%', cy: '50%' }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0.15, ease: 'easeOut' }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-muted-foreground/30 font-sans text-7xl font-bold"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>

      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-primary font-sans text-7xl font-extrabold"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 4, ease: 'easeInOut' }}
      >
        {text}
      </motion.text>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="url(#textGradient)"
        stroke="none"
        mask="url(#textMask)"
        filter="url(#glow)"
        className="font-sans text-7xl font-extrabold"
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        background:
          'radial-gradient(125% 125% at 50% 10%, hsl(var(--card) / 0.6) 50%, hsl(var(--primary) / 0.2) 100%)',
      }}
    />
  );
};
