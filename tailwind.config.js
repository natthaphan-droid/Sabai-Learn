/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F8F5',
        primary: '#7FAF8A',
        secondary: '#A8CDB2',
        accent: '#F4D96B',
        softblue: '#AFC9D8',
        textPrimary: '#333333',
        textSecondary: '#777777',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.02)',
        card: '0 8px 30px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      }
    },
  },
  plugins: [],
}
