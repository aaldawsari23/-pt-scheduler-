/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#475569',
        accent: '#f97316',
        neutral: '#f8fafc',
        'base-100': '#ffffff',
        'msk': '#f97316',
        'pt-service': '#2563eb',
        'neuro': '#16a34a',
      }
    },
  },
  plugins: [],
}
