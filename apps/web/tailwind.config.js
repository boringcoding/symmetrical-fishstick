/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', '"Noto Sans Khmer"', 'system-ui', 'sans-serif'],
        khmer: ['"Noto Sans Khmer"', 'sans-serif'],
      },
      colors: {
        night: {
          900: '#070a1a',
          800: '#0b1026',
          700: '#121838',
          600: '#1b2350',
        },
        moon: {
          glow: '#f4f0e6',
          soft: '#d9d3c4',
        },
        gold: '#e8c987',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
        fadeup: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        twinkle: 'twinkle 4s ease-in-out infinite',
        fadeup: 'fadeup 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
