/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0B0F17',
        cardBg: '#141B27',
        limeAccent: '#00E676',
        cyanAccent: '#00E5FF',
        goldAccent: '#FFD700',
      },
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
        prompt: ['Prompt', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
