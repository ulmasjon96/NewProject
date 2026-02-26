import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      writingMode: {
        'horizontal-tb': 'horizontal-tb',
        'vertical-rl': 'vertical-rl',
        'vertical-lr': 'vertical-lr',
      },
      colors: {
        cyber: {
          1: '#00f7c2',
          2: '#00ffb9',
          3: '#00e6dc',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        glow: {
          cyan: 'hsl(var(--glow-cyan))',
          pink: 'hsl(var(--glow-pink))',
          yellow: 'hsl(var(--glow-yellow))',
          blue: 'hsl(var(--glow-blue))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Pacifico', 'cursive'],
        elegant: ['Great Vibes', 'cursive'],
        brush: ['Streetbrush', 'cursive'],
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        navGlow: {
          '0%,18%,20%,40%,60%,90%': {
            opacity: '0.25',
            textShadow: 'none',
          },
          '18.1%,20.1%,41%,64%,100%': {
            opacity: '1',
            textShadow: '0 0 8px currentColor, 0 0 18px currentColor, 0 0 34px currentColor',
          },
        },
        textGlow: {
          '0%': { backgroundPosition: '-1000% 0' },
          '100%': { backgroundPosition: '1000% 0' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          from: { opacity: '0', transform: 'translateY(-30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(50px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-50px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 5px hsl(var(--primary)), 0 0 10px hsl(var(--primary) / 0.5)',
          },
          '50%': {
            boxShadow: '0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary) / 0.5)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'border-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        scan: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },

        equalizer: {
          '0%,100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.8)' },
        },

        scanVertical: {
          '0%': { top: '0%', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
      },
      animation: {
        navGlow: 'navGlow 1s steps(1, end) infinite',
        textGlow: 'textGlow 4s cubic-bezier(0.02, 0.63, 0.94, 0.4) infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'fade-down': 'fade-down 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.6s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        glow: 'glow 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        'border-flow': 'border-flow 6s linear infinite',

        scan: 'scan 2s linear infinite',
        equalizer: 'equalizer 2s ease-in-out infinite',
        'scan-vertical': 'scanVertical 2s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glow':
          'linear-gradient(120deg, hsl(330 100% 60%), hsl(177 100% 47%), hsl(45 100% 50%), hsl(330 100% 60%))',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
