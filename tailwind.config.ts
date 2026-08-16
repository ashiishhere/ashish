import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#111111',
        surface2: '#161616',
        border: '#242424',
        foreground: '#f5f5f5',
        muted: '#9a9a9a',
        accent: {
          DEFAULT: '#c8102e',
          light: '#e11d3f',
          dark: '#8c0b20',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        fadeUp: 'fadeUp 0.8s ease forwards',
      },
    },
  },
  plugins: [],
};
export default config;
