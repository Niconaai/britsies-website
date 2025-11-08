// postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // Gebruik die nuwe, korrekte pakket
    autoprefixer: {},
  },
};

export default config;