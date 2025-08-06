import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Vite configuration for the React front‑end. The dev server runs on port 3000
// by default and proxies API requests if desired. Adjust the proxy settings
// depending on where your backend runs.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  resolve: {
    alias: {
        '@': resolve(__dirname, './src'),
    },
  }
});