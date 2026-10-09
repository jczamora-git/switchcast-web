# SWITCHCAST — PRODUCTION SEO & SEARCH CONSOLE GUIDE

This document details the production SEO architecture, Open Graph specifications, automated sitemap generation, and Google Search Console verification procedures for SwitchCast.

---

## 1. Production Domain & Indexing Endpoints

* **Production Site Origin:** `https://switchcast.wasmer.app/`
* **Canonical Homepage:** `https://switchcast.wasmer.app/`
* **Canonical Release Center:** `https://switchcast.wasmer.app/releases/`
* **Canonical Release Detail Routes:**
  * `https://switchcast.wasmer.app/releases/v1.2.1/`
  * `https://switchcast.wasmer.app/releases/v1.2.0/`
  * `https://switchcast.wasmer.app/releases/v1.1.0/`
  * `https://switchcast.wasmer.app/releases/v1.0.0/`
* **Sitemap URL:** `https://switchcast.wasmer.app/sitemap.xml`
* **Robots Exclusion Standard:** `https://switchcast.wasmer.app/robots.txt`

---

## 2. Canonical URL & Routing Architecture

* **Trailing Slash Convention:** Astro generates static HTML files using `build.format: 'directory'`. Every canonical page URL strictly ends with a trailing slash (`/`), matching the exact directory output structure.
* **Release Version Aliases:**
  * Canonical route: `/releases/v1.2.1/` (indexed in sitemap).
  * Friendly alias: `/releases/1.2.1/` (retained for backward compatibility and bookmarks, marked with `<meta name="robots" content="noindex, follow" />` and points canonical to `/releases/v1.2.1/`).
  * Sitemap strictly excludes non-canonical aliases.

---

## 3. Open Graph & Social Sharing Specification

* **Asset Filename:** `public/og-switchcast-v2.png` (and `og-switchcast.png`)
* **Standard Resolution:** 1200 x 630 pixels (Aspect Ratio: 1.905:1).
* **Format:** PNG with compression and palette optimization (~85 KB vs original 1.48 MB).
* **Design Elements:**
  * Deep charcoal background (`#07080a`) with technical blueprint grid and ambient coral/orange glow.
  * Official SwitchCast logo badge.
  * High-contrast editorial typography (`SWITCHCAST`, `SHARE ONCE. SWITCH SEAMLESSLY.`).
  * Authentic presentation window preview with live broadcasting tag and floating presenter dock switcher.
  * Windows platform indicator and v1.2.1 standalone badge.
  * Safe area padding (>80px margin) ensuring zero clipping in Facebook, Messenger, Discord, and Telegram link bubbles.
* **Automation:** Regenerate at any time with `npm run seo:generate` (`scripts/generate-og.mjs`).

---

## 4. Google Search Console Setup & Verification

SwitchCast is pre-configured with Google Search Console verification:

### Method 1: HTML Verification File (Already Deployed)
1. Verification file: `public/google8e150a81a712479d.html`
2. Accessible at: `https://switchcast.wasmer.app/google8e150a81a712479d.html`
3. Content: `google-site-verification: google8e150a81a712479d.html`

### Method 2: HTML Meta Tag (Already Injected in Head)
1. Meta tag present in `src/layouts/BaseLayout.astro`:
   ```html
   <meta name="google-site-verification" content="google8e150a81a712479d" />
   ```

### Next Steps for Webmaster:
1. Open [Google Search Console](https://search.google.com/search-console).
2. Enter Property URL: `https://switchcast.wasmer.app/`.
3. Choose **HTML tag** or **HTML file** verification method and click **Verify**.
4. In the left sidebar, navigate to **Sitemaps**.
5. Add new sitemap: `sitemap.xml`.
6. Submit and verify status reports **Success**.

---

## 5. Structured Data (Schema.org)

1. **Homepage (`/`)**:
   * Type: `SoftwareApplication`
   * Operating System: `Windows 10, Windows 11`
   * Application Category: `BusinessApplication, MultimediaApplication`
   * Version & Download: Dynamically bound to `src/data/release.json`
   * Offers: `0 USD` (Free standalone software)
   * Publisher & Author: `Jeizi Productions`, `John Christopher King Zamora`
2. **Release Center (`/releases/`)**:
   * Type: `BreadcrumbList` (`Home > Releases`)
3. **Release Detail Pages (`/releases/v1.2.1/`)**:
   * Type: `BreadcrumbList` (`Home > Releases > v1.2.1`)

---

## 6. Social Scraper Cache Refresh Procedures

When sharing updates or if a platform retains an older preview card:

* **Facebook & Messenger:** Visit [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/), input `https://switchcast.wasmer.app/`, and click **Scrape Again**.
* **Telegram:** Message `@WebpageBot` on Telegram and send `https://switchcast.wasmer.app/` to purge server cache.
* **LinkedIn:** Test with [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).
* **Discord / Twitter:** Cache-bust instantly in messages by appending `?v=1` or `?v=2` (e.g. `https://switchcast.wasmer.app/?v=1`).

---

## 7. Verification Workflow

Run the automated verification suite before publishing:

```bash
# 1. Regenerate Open Graph banner
npm run seo:generate

# 2. Build production static bundle (generates dist/ and sitemap.xml)
npm run build

# 3. Execute 20-point automated SEO and sitemap audit
npm run seo:verify
```
