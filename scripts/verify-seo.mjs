import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const EXPECTED_ORIGIN = 'https://switchcast.wasmer.app';
const EXPECTED_SITEMAP_URL = `${EXPECTED_ORIGIN}/sitemap.xml`;

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passCount++;
  } else {
    console.error(`  ✗ FAILED: ${message}`);
    failCount++;
  }
}

async function verifySeo() {
  console.log('\n==================================================');
  console.log('SWITCHCAST WEBSITE — SEO & OPEN GRAPH AUDIT');
  console.log('==================================================\n');

  if (!fs.existsSync(distDir)) {
    console.error(`Error: dist directory not found at ${distDir}. Run 'npm run build' first.`);
    process.exit(1);
  }

  // 1. Homepage exists
  const homePath = path.join(distDir, 'index.html');
  assert(fs.existsSync(homePath), 'Homepage exists (dist/index.html)');

  // 2. Release Center exists
  const releasesIndexPath = path.join(distDir, 'releases', 'index.html');
  assert(fs.existsSync(releasesIndexPath), 'Release Center exists (dist/releases/index.html)');

  // 3. Release detail pages exist
  const releasesManifestPath = path.join(rootDir, 'src', 'data', 'releases.json');
  const releasesData = JSON.parse(fs.readFileSync(releasesManifestPath, 'utf-8'));
  const publishedReleases = releasesData.filter(r => r.published);

  for (const rel of publishedReleases) {
    const canonicalDetailPath = path.join(distDir, 'releases', rel.tag, 'index.html');
    assert(fs.existsSync(canonicalDetailPath), `Release canonical detail exists (dist/releases/${rel.tag}/index.html)`);

    const aliasDetailPath = path.join(distDir, 'releases', rel.version, 'index.html');
    assert(fs.existsSync(aliasDetailPath), `Release alias detail exists (dist/releases/${rel.version}/index.html)`);
  }

  // 4-8. Indexable pages HTML inspection
  const htmlFilesToCheck = [
    { name: 'Homepage', file: homePath, isAlias: false },
    { name: 'Release Center', file: releasesIndexPath, isAlias: false },
    ...publishedReleases.map(rel => ({
      name: `Release ${rel.tag}`,
      file: path.join(distDir, 'releases', rel.tag, 'index.html'),
      isAlias: false
    })),
    ...publishedReleases.map(rel => ({
      name: `Release Alias ${rel.version}`,
      file: path.join(distDir, 'releases', rel.version, 'index.html'),
      isAlias: true
    }))
  ];

  for (const item of htmlFilesToCheck) {
    const html = fs.readFileSync(item.file, 'utf-8');

    // Title tag
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    assert(!!titleMatch && titleMatch[1].trim().length > 0, `${item.name} has non-empty <title> tag ("${titleMatch ? titleMatch[1].slice(0, 40) + '...' : ''}")`);

    // Meta description
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
    assert(!!descMatch && descMatch[1].trim().length > 0, `${item.name} has non-empty meta description`);

    // Canonical URL
    const canonicalMatches = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/gi) || [];
    assert(canonicalMatches.length === 1, `${item.name} has exactly one canonical URL (found ${canonicalMatches.length})`);

    const canonicalHrefMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
    const canonicalHref = canonicalHrefMatch ? canonicalHrefMatch[1] : '';
    assert(canonicalHref.startsWith(EXPECTED_ORIGIN), `${item.name} canonical URL uses HTTPS production origin (${canonicalHref})`);
    assert(canonicalHref.endsWith('/'), `${item.name} canonical URL has trailing slash (${canonicalHref})`);

    // No localhost in head metadata
    const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    const headContent = headMatch ? headMatch[1] : '';
    assert(!headContent.includes('localhost') && !headContent.includes('127.0.0.1'), `${item.name} has no localhost URLs in <head>`);

    // Open Graph tags
    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    assert(!!ogImageMatch && ogImageMatch[1].startsWith('https://'), `${item.name} has absolute HTTPS og:image (${ogImageMatch ? ogImageMatch[1] : ''})`);

    const ogWidthMatch = html.match(/<meta[^>]+property=["']og:image:width["'][^>]+content=["'](\d+)["']/i);
    assert(!!ogWidthMatch && ogWidthMatch[1] === '1200', `${item.name} declares og:image:width 1200`);

    const ogHeightMatch = html.match(/<meta[^>]+property=["']og:image:height["'][^>]+content=["'](\d+)["']/i);
    assert(!!ogHeightMatch && ogHeightMatch[1] === '630', `${item.name} declares og:image:height 630`);

    const ogTypeMatch = html.match(/<meta[^>]+property=["']og:image:type["'][^>]+content=["']image\/png["']/i);
    assert(!!ogTypeMatch, `${item.name} declares og:image:type image/png`);

    const ogAltMatch = html.match(/<meta[^>]+property=["']og:image:alt["'][^>]+content=["']([^"']+)["']/i);
    assert(!!ogAltMatch && ogAltMatch[1].length > 0, `${item.name} declares descriptive og:image:alt`);

    // Twitter tags
    const twitterCardMatch = html.match(/<meta[^>]+name=["']twitter:card["'][^>]+content=["']summary_large_image["']/i);
    assert(!!twitterCardMatch, `${item.name} declares twitter:card summary_large_image`);

    const twitterImageMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
    assert(!!twitterImageMatch && twitterImageMatch[1].startsWith('https://'), `${item.name} declares twitter:image`);

    // Robots meta for aliases
    if (item.isAlias) {
      const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
      assert(!!robotsMatch && robotsMatch[1].includes('noindex'), `${item.name} alias is set to noindex`);
    }

    // JSON-LD validation if present
    const jsonLdMatches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    for (const match of jsonLdMatches) {
      try {
        const parsed = JSON.parse(match[1]);
        assert(typeof parsed === 'object' && parsed !== null, `${item.name} has valid JSON-LD (${parsed['@type'] || 'object'})`);
      } catch (err) {
        assert(false, `${item.name} JSON-LD failed to parse: ${err.message}`);
      }
    }
  }

  // 10-12. OG image file verification in dist/
  const ogFile = path.join(distDir, 'og-switchcast.png');
  const ogFileV2 = path.join(distDir, 'og-switchcast-v2.png');
  assert(fs.existsSync(ogFile), 'dist/og-switchcast.png exists');
  assert(fs.existsSync(ogFileV2), 'dist/og-switchcast-v2.png exists');

  if (fs.existsSync(ogFileV2)) {
    const meta = await sharp(ogFileV2).metadata();
    assert(meta.width === 1200, `Actual OG width is exactly 1200px (got ${meta.width})`);
    assert(meta.height === 630, `Actual OG height is exactly 630px (got ${meta.height})`);
    assert(meta.format === 'png', `Actual OG format is PNG (got ${meta.format})`);
    const sizeKb = (fs.statSync(ogFileV2).size / 1024).toFixed(1);
    assert(fs.statSync(ogFileV2).size < 500 * 1024, `Optimized OG file size is well under 500KB (${sizeKb} KB)`);
  }

  // 15. robots.txt exists
  const robotsPath = path.join(distDir, 'robots.txt');
  assert(fs.existsSync(robotsPath), 'dist/robots.txt exists');

  if (fs.existsSync(robotsPath)) {
    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    assert(!robotsContent.includes('Disallow: /'), 'robots.txt does not disallow root');
    assert(robotsContent.includes(`Sitemap: ${EXPECTED_SITEMAP_URL}`), `robots.txt references exact sitemap (${EXPECTED_SITEMAP_URL})`);
  }

  // 16. Sitemap exists
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  assert(fs.existsSync(sitemapPath), 'dist/sitemap.xml exists');

  if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    assert(sitemapContent.includes('<?xml version="1.0" encoding="UTF-8"?>'), 'sitemap.xml has valid XML declaration');
    assert(sitemapContent.includes('<urlset'), 'sitemap.xml has urlset container');

    // 18. Sitemap includes canonical pages
    assert(sitemapContent.includes(`<loc>${EXPECTED_ORIGIN}/</loc>`), 'sitemap.xml includes homepage (/)');
    assert(sitemapContent.includes(`<loc>${EXPECTED_ORIGIN}/releases/</loc>`), 'sitemap.xml includes /releases/');

    for (const rel of publishedReleases) {
      assert(sitemapContent.includes(`<loc>${EXPECTED_ORIGIN}/releases/${rel.tag}/</loc>`), `sitemap.xml includes canonical /releases/${rel.tag}/`);
    }

    // 19. Sitemap excludes duplicate version aliases
    for (const rel of publishedReleases) {
      assert(!sitemapContent.includes(`<loc>${EXPECTED_ORIGIN}/releases/${rel.version}/</loc>`), `sitemap.xml excludes duplicate alias /releases/${rel.version}/`);
    }

    const locEntries = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    assert(locEntries.length >= 6, `sitemap.xml contains at least 6 canonical loc entries (found ${locEntries.length})`);
    assert(locEntries.every(loc => !loc.includes('?')), 'sitemap.xml URLs contain no query strings');
  }

  // 21. Google site verification file
  const googleVerifyFile = path.join(distDir, 'google8e150a81a712479d.html');
  assert(fs.existsSync(googleVerifyFile), 'Google verification HTML file exists (dist/google8e150a81a712479d.html)');

  console.log('\n--------------------------------------------------');
  console.log(`SEO Audit Summary: ${passCount} passed, ${failCount} failed.`);
  console.log('--------------------------------------------------\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

verifySeo().catch(err => {
  console.error('Fatal error during SEO verification:', err);
  process.exit(1);
});
