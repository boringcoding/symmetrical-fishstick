/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Sora', '"Noto Sans Khmer"', 'system-ui', 'sans-serif'],
        khmer: ['"Noto Sans Khmer"', 'Sora', 'sans-serif'],
      },
      colors: {
        night: {
          950: '#05050c',
          900: '#070a18',
          800: '#0c0f22',
          700: '#15132a',
          600: '#1b2350',
        },
        ink: '#f6f4ff',
        muted: '#9c98cc',
        aurora: {
          pink: '#ff5ec7',
          violet: '#7b5cff',
          cyan: '#00e0ff',
        },
        gold: '#e8c987',
        moonglow: '#f4f0e6',
      },
      boxShadow: {
        glow: '0 10px 34px rgba(123,92,255,.45)',
        sheet: '0 -20px 60px rgba(0,0,0,.6)',
        card: '0 16px 50px rgba(0,0,0,.5)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.15' },
          '50%': { opacity: '1' },
        },
        fadeup: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sheen: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        grow: {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        sheetup: {
          from: { transform: 'translateY(102%)' },
          to: { transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        twinkle: 'twinkle 4s ease-in-out infinite',
        fadeup: 'fadeup 0.6s cubic-bezier(.2,.85,.25,1) both',
        sheen: 'sheen 7s ease-in-out infinite',
        grow: 'grow 1s cubic-bezier(.2,.85,.25,1) both',
        sheetup: 'sheetup .42s cubic-bezier(.2,.8,.2,1) both',
      },
    },
  },
  plugins: [],
};
