import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://switchcast.jeiziproductions.com',
  output: 'static',
  build: {
    format: 'directory'
  }
});
