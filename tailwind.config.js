/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    keyframes: {
      slide: {
        '0%': { transform: 'translateX(0)' },
        '100%': { transform: 'translateX(-50%)' }, // changed from -100% to -50%
      },
    },
    animation: {
      slide: 'slide 30s linear infinite',
    },
  },
  plugins: [],
}

