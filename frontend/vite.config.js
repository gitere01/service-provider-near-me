import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      // Add aliases for image file extensions
      'png': 'url-loader',
      'jpg': 'url-loader',
      'jpeg': 'url-loader',
      'gif': 'url-loader',
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  server: {
    proxy: {
      // Add any proxy configurations if needed
    },
  },
});
