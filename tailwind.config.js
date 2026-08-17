/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        graphite: {
          DEFAULT: '#26262c',
          50: '#f5f5f6',
          100: '#e4e4e7',
          200: '#c7c7cd',
          300: '#a3a3ad',
          400: '#6f6f7a',
          500: '#54545e',
          600: '#3d3d45',
          700: '#2f2f36',
          800: '#26262c',
          900: '#18181c',
          950: '#0f0f12',
        },
        signal: {
          DEFAULT: '#ff5a1f',
          50: '#fff1ea',
          100: '#ffe0cf',
          200: '#ffc19f',
          300: '#ff9563',
          400: '#ff7a42',
          500: '#ff5a1f',
          600: '#e04a15',
          700: '#b8390f',
        },
        paper: '#f6f5f2',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '4px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(10px)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'fade-in': 'fade-in 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};