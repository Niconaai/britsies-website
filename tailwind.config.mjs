// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'], // Ek het 'mdx' bygevoeg vir volledigheid
  theme: {
    extend: {
      // Hier kan ons later ons Maroen en Goud kleure byvoeg
      colors: {
        'brits-maroon': '#800000',
        'brits-gold': '#D4AF37',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Hier is waar die inprop hoort
  ],
};

export default config;