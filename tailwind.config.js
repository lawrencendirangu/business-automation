/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#7C3AED',
      },
      borderRadius: {
        xl2: '16px',
      },
      boxShadow: {
        soft: '0 10px 30px -16px rgba(15, 23, 42, 0.2)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Manrope"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

