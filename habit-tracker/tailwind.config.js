/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBlue: "#3B6AFF",
        gradientPink: "#F093FB",
        gradientBlue: "#6FD6FF",
        white: "#FFFFFF",
        lightBlue: "#D6ECFF",
        navy: "#1E2A4A",
        softPink: "#FFB7D5",
      },
      borderRadius: {
        card: "20px",
      },
      fontFamily: {
        sans: ["System"],
      },
      boxShadow: {
        card: "0px 6px 16px rgba(30, 42, 74, 0.08)",
      },
    },
  },
  plugins: [],
};



