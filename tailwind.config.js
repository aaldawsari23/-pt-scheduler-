/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Tajawal', 'sans-serif'],
      },
      animation: {
        'slideInTop': 'slideInTop 0.4s ease-out backwards',
        'bounceIn': 'bounceIn 0.6s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'slideIn': 'slideIn 0.3s ease-out backwards',
        'fadeIn': 'fadeIn 0.5s ease-out backwards',
        'fadeOut': 'fadeOut 0.3s ease-out forwards',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'hard': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}