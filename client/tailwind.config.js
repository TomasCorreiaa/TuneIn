/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'theme-text': 'rgb(var(--color-text-main) / <alpha-value>)',
        'theme-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'theme-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',
        'theme-border': 'rgb(var(--color-border-strong) / <alpha-value>)',
        accent: {
          orange: 'rgb(var(--accent-1) / <alpha-value>)',
          pink: 'rgb(var(--accent-2) / <alpha-value>)',
          purple: 'rgb(var(--accent-3) / <alpha-value>)'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
