/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'amazon-dark': '#232f3e',
        'amazon-light': '#37475a',
        'amazon-accent': '#f90',
        'flipkart-dark': '#2874f0',
        'flipkart-light': '#FFFFC2',
        'flipkart-accent': '#fb641b',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
 
  },
  plugins: [],
}

