import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://switchcast.wasmer.app',
  output: 'static',
  build: {
    format: 'directory'
  }
});
