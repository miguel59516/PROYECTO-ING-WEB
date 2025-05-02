/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E12613',
          light: '#ff3b27',
          dark: '#c21e0d'
        },
        secondary: {
          DEFAULT: '#828280',
          dark: '#1D1D1B'
        },
        background: '#F6F6F6'
      },
      aspectRatio: {
        'w-16': 16,
        'h-9': 9,
      },
    },
  },
  plugins: [],
};