/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Government-grade palette
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        // 2026 accent tokens
        glass: {
          light: 'rgba(255,255,255,0.08)',
          medium: 'rgba(255,255,255,0.12)',
          heavy: 'rgba(255,255,255,0.20)',
          border: 'rgba(255,255,255,0.15)',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',
          subtle: '#f1f5f9',
          dark: '#0f172a',
          'dark-muted': '#1e293b',
          'dark-subtle': '#334155',
        },
        // AI / brand accent
        ai: {
          50: '#faf5ff',
          100: '#f3e8ff',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        },
        // Odisha government saffron
        gov: {
          saffron: '#FF9933',
          green: '#138808',
          navy: '#000080',
          gold: '#C9A84C',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        '10xl': ['10rem', { lineHeight: '1' }],
      },

      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },

      // 2026 keyframe animations
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':      { transform: 'translateY(-12px) rotate(2deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.05)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'counter-up': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'data-flow': {
          '0%':   { strokeDashoffset: '100', opacity: '0' },
          '50%':  { opacity: '1' },
          '100%': { strokeDashoffset: '0',   opacity: '0' },
        },
        'border-spin': {
          '0%':   { '--border-angle': '0deg' },
          '100%': { '--border-angle': '360deg' },
        },
        'ai-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(168,85,247,0.4)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(168,85,247,0)' },
        },
        'scan-line': {
          '0%':   { top: '0%' },
          '100%': { top: '100%' },
        },
        'number-tick': {
          '0%':   { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        'orbit': {
          '0%':   { transform: 'rotate(0deg) translateX(40px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(40px) rotate(-360deg)' },
        },
        'typewriter': {
          '0%':   { width: '0' },
          '100%': { width: '100%' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
      },

      animation: {
        'shimmer':        'shimmer 2.5s linear infinite',
        'float':          'float 3s ease-in-out infinite',
        'float-slow':     'float-slow 6s ease-in-out infinite',
        'pulse-glow':     'pulse-glow 2s ease-in-out infinite',
        'slide-up':       'slide-up 0.4s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.4s ease-out forwards',
        'fade-in':        'fade-in 0.3s ease-out forwards',
        'scale-in':       'scale-in 0.35s ease-out forwards',
        'counter-up':     'counter-up 0.5s ease-out forwards',
        'ai-pulse':       'ai-pulse 2s ease-in-out infinite',
        'scan-line':      'scan-line 2s linear infinite',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'orbit':          'orbit 8s linear infinite',
        'typewriter':     'typewriter 2s steps(30) forwards',
        'blink':          'blink 1s step-end infinite',
        'border-spin':    'border-spin 4s linear infinite',
      },

      backgroundImage: {
        // Shimmer skeleton
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
        // Mesh gradients
        'mesh-blue':   'radial-gradient(at 40% 20%, #0ea5e9 0px, transparent 50%), radial-gradient(at 80% 0%, #6366f1 0px, transparent 50%), radial-gradient(at 0% 50%, #0284c7 0px, transparent 50%)',
        'mesh-purple': 'radial-gradient(at 40% 20%, #a855f7 0px, transparent 50%), radial-gradient(at 80% 0%, #6366f1 0px, transparent 50%), radial-gradient(at 0% 50%, #ec4899 0px, transparent 50%)',
        'mesh-green':  'radial-gradient(at 40% 20%, #22c55e 0px, transparent 50%), radial-gradient(at 80% 0%, #0ea5e9 0px, transparent 50%), radial-gradient(at 0% 50%, #16a34a 0px, transparent 50%)',
        'mesh-dark':   'radial-gradient(at 40% 20%, #1e293b 0px, transparent 50%), radial-gradient(at 80% 0%, #0f172a 0px, transparent 50%), radial-gradient(at 0% 50%, #334155 0px, transparent 50%)',
        // Noise texture overlay
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        // Dot grid
        'dot-grid': 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
        // Conic gradient for spinner
        'conic-primary': 'conic-gradient(from 0deg, #0ea5e9, #6366f1, #a855f7, #0ea5e9)',
      },

      backgroundSize: {
        'dot-grid': '24px 24px',
      },

      boxShadow: {
        'glass':       '0 4px 24px -1px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
        'glass-lg':    '0 8px 40px -4px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)',
        'glow-blue':   '0 0 20px rgba(14,165,233,0.4)',
        'glow-purple': '0 0 20px rgba(168,85,247,0.4)',
        'glow-green':  '0 0 20px rgba(34,197,94,0.4)',
        'glow-red':    '0 0 20px rgba(239,68,68,0.4)',
        'glow-gold':   '0 0 20px rgba(201,168,76,0.4)',
        'bento':       '0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
        'bento-hover': '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
        'card-lift':   '0 20px 60px -10px rgba(0,0,0,0.15)',
        'inner-glow':  'inset 0 1px 0 rgba(255,255,255,0.15)',
      },

      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },

      transitionTimingFunction: {
        'spring':      'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth':      'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.68, -0.3, 0.32, 1.3)',
      },

      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },

      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      gridTemplateColumns: {
        'bento-3': 'repeat(3, minmax(0, 1fr))',
        'bento-4': 'repeat(4, minmax(0, 1fr))',
        'bento-5': 'repeat(5, minmax(0, 1fr))',
        'auto-fill-280': 'repeat(auto-fill, minmax(280px, 1fr))',
        'auto-fill-320': 'repeat(auto-fill, minmax(320px, 1fr))',
      },

      gridTemplateRows: {
        'bento-2': 'repeat(2, minmax(0, 1fr))',
        'bento-3': 'repeat(3, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
}