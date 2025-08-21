/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eef2ff',
          500: '#4F46E5',
          600: '#4338ca',
          700: '#3730a3',
        },
        secondary: {
          50: '#faf5ff',
          500: '#8B5CF6',
          600: '#7c3aed',
        },
        accent: {
          50: '#fdf2f8',
          500: '#EC4899',
          600: '#db2777',
        },
        surface: {
          50: '#F8FAFC',
          100: '#f1f5f9',
        },
      },
    },
  },
  plugins: [],
}