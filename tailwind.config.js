/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B6AFF',
        'primary-dark': '#1E2A4A',
        secondary: '#D6ECFF',
        accent: '#3B6AFF',
        'text-dark': '#1E2A4A',
        'text-light': '#94A3B8',
        gradientPink: '#F093FB',
        gradientBlue: '#6FD6FF',
        lightBlue: '#D6ECFF',
        navy: '#1E2A4A',
        softPink: '#FFB7D5',
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
}
