/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['"Inter"', 'sans-serif'],
        inriaSans:['"Inria Sans"','sans-serif'],
        Aladin:['"Aladin"','sans-serif'],
      },
    },
  },
  plugins: [],
};
