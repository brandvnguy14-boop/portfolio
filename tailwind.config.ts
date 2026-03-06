import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCFA',
          100: '#FAF9F5',
          200: '#F5F3EF',
          300: '#EBE7DF',
          400: '#DDD7CC',
        },
        sage: {
          50: '#F0F5F3',
          100: '#D1E0DB',
          200: '#A3C1B7',
          300: '#6B9E8D',
          400: '#3D7D6A',
          500: '#2D6A5A',
          600: '#245649',
          700: '#1B4137',
          800: '#122B25',
          900: '#091612',
        },
        bronze: {
          50: '#F9F5F0',
          100: '#EDE4D6',
          200: '#D4C2A6',
          300: '#B8996E',
          400: '#8B7355',
          500: '#6E5A42',
          600: '#524332',
        },
        copper: {
          50: '#FBF4EE',
          100: '#F2DFD0',
          200: '#E5C0A1',
          300: '#D4A07A',
          400: '#C4956A',
          500: '#A67A50',
        },
        ink: {
          50: '#F5F5F5',
          100: '#E0E0E0',
          200: '#B0B0B0',
          300: '#7A7A7A',
          400: '#4A4A4A',
          500: '#1A1A1A',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
