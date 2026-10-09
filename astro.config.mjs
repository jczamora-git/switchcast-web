import { defineConfig } from 'astro/config';
import { switchcastSitemapIntegration } from './scripts/sitemap-integration.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://switchcast.wasmer.app',
  output: 'static',
  build: {
    format: 'directory'
  },
  integrations: [
    switchcastSitemapIntegration({ origin: 'https://switchcast.wasmer.app' })
  ]
});
