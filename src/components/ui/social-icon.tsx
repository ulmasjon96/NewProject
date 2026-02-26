import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export interface SocialIconData {
  href: string;
  icon: ReactNode;
  label: string;
  platform: 'github' | 'vk' | 'instagram' | 'telegram';
}

interface Props extends SocialIconData {
  delay?: number;
}

export function SocialIcon({ href, icon, label, platform, delay = 0 }: Props) {
  return (
    <>
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        whileTap={{ scale: 0.9 }}
        className={clsx(
          'social-icon',
          platform,
          'flex h-12 w-12 items-center justify-center rounded-full',
          'border-2 border-transparent bg-[#0f0f0f] text-white',
          'transition-all duration-300 relative overflow-hidden',
        )}
      >
        {icon}
      </motion.a>

      {/* ✅ ODDIY CSS — VITE UCHUN TO‘G‘RI */}
      <style>{`
        .social-icon {
          background:
            linear-gradient(#0f0f0f, #0f0f0f) padding-box,
            linear-gradient(
              120deg,
              #ff00cc,
              #00c6ff,
              #f6c90e,
              #ff00cc
            ) border-box;
          background-size: 300% 300%;
        }

        .github:hover {
          color: #f6c90e;
          background:
            linear-gradient(#0f0f0f, #0f0f0f) padding-box,
            linear-gradient(120deg, #f6c90e, #d17a00) border-box;
          animation: glow-github 2s infinite ease-in-out, borderFlow 6s linear infinite;
          transform: scale(1.2) rotate(10deg);
        }

        .telegram:hover {
          color: #00c6ff;
          background:
            linear-gradient(#0f0f0f, #0f0f0f) padding-box,
            linear-gradient(120deg, #00c6ff, #0077ff) border-box;
          animation: glow-telegram 2s infinite ease-in-out, borderFlow 6s linear infinite;
          transform: scale(1.2) rotate(10deg);
        }

        .vk:hover {
          color: #63a4ff;
          background:
            linear-gradient(#0f0f0f, #0f0f0f) padding-box,
            linear-gradient(120deg, #63a4ff, #83d0ff) border-box;
          animation: glow-vk 2s infinite ease-in-out, borderFlow 6s linear infinite;
          transform: scale(1.2) rotate(10deg);
        }

        .instagram:hover {
          color: #dd2a7b;
          background:
            linear-gradient(#0f0f0f, #0f0f0f) padding-box,
            linear-gradient(120deg, #dd2a7b, #feda77, #8134af) border-box;
          animation: glow-instagram 2s infinite ease-in-out, borderFlow 6s linear infinite;
          transform: scale(1.2) rotate(10deg);
        }

        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }

        @keyframes glow-github {
          0%,100% { box-shadow: 0 0 15px #f6c90e; }
          50% { box-shadow: 0 0 35px #f6c90e; }
        }

        @keyframes glow-telegram {
          0%,100% { box-shadow: 0 0 15px #00c6ff; }
          50% { box-shadow: 0 0 35px #00c6ff; }
        }

        @keyframes glow-vk {
          0%,100% { box-shadow: 0 0 15px #63a4ff; }
          50% { box-shadow: 0 0 35px #63a4ff; }
        }

        @keyframes glow-instagram {
          0%,100% { box-shadow: 0 0 15px #dd2a7b; }
          50% { box-shadow: 0 0 35px #dd2a7b; }
        }
      `}</style>
    </>
  );
}
