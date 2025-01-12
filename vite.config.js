// vite.config.js
export default {
  base: process.env.NODE_ENV === 'production' ? '/MinesOfEisenfrost/' : '/',
  build: {
    outDir: 'dist', // Output directory for build
  },
};
