// vite.config.js
export default {
  base: process.env.NODE_ENV === 'production' ? '/minesOfEisenfrost/' : '/',
  build: {
    outDir: 'dist', // Output directory for build
  },
};
