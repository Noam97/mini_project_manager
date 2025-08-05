import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the React front‑end. The dev server runs on port 3000
// by default and proxies API requests if desired. Adjust the proxy settings
// depending on where your backend runs.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
    // Example proxy:
    // proxy: {
    //   '/api': 'http://localhost:5000'
    // }
  }
});