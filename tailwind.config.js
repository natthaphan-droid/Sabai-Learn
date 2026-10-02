/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F5F1E8',
        primary: '#293124',
        secondary: '#DFEACF',
        accent: '#F5D681',
        softblue: '#D8E6FB',
        textPrimary: '#252824',
        textSecondary: '#737A72',
        surface: '#FFFFFF',
        danger: '#BA4941',
        success: '#879F79',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Thai"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 10px rgba(40, 65, 45, 0.03)',
        card: '0 3px 16px rgba(40, 65, 45, 0.035)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      }
    },
  },
  plugins: [],
}
