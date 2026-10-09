import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * SwitchCast Official Sitemap Integration
 * Automatically generates a standards-compliant XML sitemap in dist/sitemap.xml
 * and public/sitemap.xml during production builds.
 */
export function switchcastSitemapIntegration(options = {}) {
  const origin = options.origin || 'https://switchcast.wasmer.app';

  return {
    name: 'switchcast-sitemap',
    hooks: {
      'astro:build:done': async ({ dir, pages }) => {
        const distDir = fileURLToPath(dir);
        console.log(`\n[sitemap] Generating official sitemap.xml for ${origin}...`);

        // Collect canonical URLs only
        const canonicalEntries = [];

        for (const page of pages) {
          let pathname = page.pathname;
          
          // Normalize pathname
          if (!pathname.startsWith('/')) {
            pathname = `/${pathname}`;
          }
          if (!pathname.endsWith('/')) {
            pathname = `${pathname}/`;
          }

          // EXCLUDE: duplicate version aliases without 'v' prefix (e.g. /releases/1.2.1/)
          // Only index canonical version paths (e.g. /releases/v1.2.1/)
          const isVersionAlias = /^\/releases\/\d+\.\d+\.\d+\/$/.test(pathname);
          if (isVersionAlias) {
            continue;
          }

          // EXCLUDE 404 or non-indexable routes if any
          if (pathname.includes('404')) {
            continue;
          }

          // Calculate priority and changefreq based on route
          let priority = '0.8';
          let changefreq = 'weekly';

          if (pathname === '/') {
            priority = '1.0';
            changefreq = 'daily';
          } else if (pathname === '/releases/') {
            priority = '0.9';
            changefreq = 'daily';
          } else if (pathname.includes('/releases/v')) {
            priority = '0.8';
            changefreq = 'monthly';
          }

          const fullUrl = `${origin}${pathname}`;
          canonicalEntries.push({
            loc: fullUrl,
            changefreq,
            priority,
            lastmod: new Date().toISOString().split('T')[0]
          });
        }

        // Sort entries deterministically: / first, then /releases/, then version pages descending
        canonicalEntries.sort((a, b) => {
          if (a.loc === `${origin}/`) return -1;
          if (b.loc === `${origin}/`) return 1;
          if (a.loc === `${origin}/releases/`) return -1;
          if (b.loc === `${origin}/releases/`) return 1;
          return b.loc.localeCompare(a.loc);
        });

        // Build XML content
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${canonicalEntries
  .map(
    entry => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

        const distSitemapPath = path.join(distDir, 'sitemap.xml');
        fs.writeFileSync(distSitemapPath, xml, 'utf-8');

        // Also update public/sitemap.xml so dev server or static copy can find it
        const publicDir = path.resolve(distDir, '..', 'public');
        if (fs.existsSync(publicDir)) {
          fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf-8');
        }

        console.log(`[sitemap] ✓ Written sitemap.xml with ${canonicalEntries.length} canonical routes:`);
        canonicalEntries.forEach(e => console.log(`  - ${e.loc} (${e.priority})`));
      }
    }
  };
}
