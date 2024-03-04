import { defineConfig } from "vite";
import patsh from "vite-tsconfig-paths";

import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  root: './src',
  publicDir: '../public',
  build: {
    emptyOutDir: true,
    outDir: '../dist'
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  plugins: [
    react({ plugins: [] }),
    patsh({ root: '../' })
  ],
});
