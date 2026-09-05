import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base so the build works from any subpath, e.g. GitHub Pages.
  base: './',
  server: { host: true, port: 5173 },
});
