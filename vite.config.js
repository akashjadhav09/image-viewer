import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 1214, // Set the port
    open: true, // Automatically open the browser
  },
});
