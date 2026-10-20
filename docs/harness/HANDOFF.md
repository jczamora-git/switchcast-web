# SWITCHCAST WEBSITE — HARNESS HANDOFF RECORD

**Document Version:** 2.0.0  
**Updated:** 2026-10-20  
**Harness Task:** SwitchCast v1.5.0 Release Integration & Product Capability Expansion  

---

## 1. Current Status
- **Status**: Production Release v1.5.0 Synchronized, Dynamic Release Automation Operational, Interactive Simulator Expanded, Evergreen SEO & Open Graph Ready
- **Page Structure**:
  - Landing Page: `/` (`src/pages/index.astro` with authoritative `SoftwareApplication` JSON-LD schema pinned to v1.5.0)
  - Release Center Catalog: `/releases/` (`src/pages/releases/index.astro` with `BreadcrumbList` schema and compact release cards)
  - Dynamic Release Detail Pages: `/releases/[version]/` (canonical routes `/releases/v1.5.0/`, `/releases/v1.4.0/`, `/releases/v1.3.0/`, `/releases/v1.2.1/`, etc. with `BreadcrumbList` schema; non-canonical aliases set to `noindex`)
- **Static Output**: Pre-rendered into `dist/` (16 static HTML pages + `dist/sitemap.xml` + `dist/robots.txt` + `dist/google8e150a81a712479d.html`)
- **Framework**: Astro 7.3.8 (Static SSG), Vanilla CSS, TypeScript, Vanilla JS, Sharp (build-time imaging)
- **Official Version Hierarchy**:
  - `v1.5.0` (Latest Release) — Downloadable (`SwitchCast-v1.5.0-win-x64.zip`, 64.0 MB, SHA-256 with file)
  - `v1.4.0` (Previous Release) — Downloadable (`SwitchCast-v1.4.0-win-x64.zip`, 61.9 MB, SHA-256 with file)
  - `v1.3.0` (Previous Release) — Downloadable (`SwitchCast-v1.3.0-win-x64.zip`, 64.0 MB, SHA-256 with file)
  - `v1.2.1` (Previous Release) — Downloadable (`SwitchCast-v1.2.1-win-x64.zip`, 63.8 MB, SHA-256 with file)
  - `v1.2.0` (Previous Release) — Downloadable (`SwitchCast-v1.2.0-win-x64.zip`, 63.7 MB, SHA-256 with file)
  - `v1.1.0` (Previous Release) — Downloadable (`SwitchCast-v1.1.0-win-x64.zip`, 61.6 MB, SHA-256 digest copy)
  - `v1.0.0` (Initial Release) — Downloadable (`SwitchCast-v1.0.0-win-x64.zip`, 61.5 MB, SHA-256 digest copy)

---

## 2. Release Management & Ordering Contracts
- **Semantic Version Ordering Over Timestamps**:
  - Stable releases are ordered strictly by semantic version (`1.5.0 > 1.4.0 > 1.3.0 > 1.2.1 > 1.2.0 > 1.1.0 > 1.0.0`).
  - `v1.5.0` is strictly selected as the latest release even if older versions have later GitHub publication timestamps.
  - Regression test: `npm run test:releases` (`scripts/test-release-order.mjs`).
- **Official Download Assets & Missing Binary Handling**:
  - All 7 versions are verified published GitHub releases.
  - Non-downloadable releases (published releases without attached `.zip` files) are modeled as `downloadable: false`, `package: null`, and rendered with a clear "Download Unavailable" badge without broken download buttons or fake links.
  - Deduping ensures subsequent sync runs never create duplicate version records.
- **Concise User-Facing Changelogs**:
  - Every version features 3–5 concise highlights avoiding internal implementation jargon.
  - Detailed technical documentation is housed in an accessible collapsible section on individual release pages.

---

## 3. Automation & Verification Workflows
- **Diagnostics Check**: `npm run check` (0 errors, 0 warnings across 30 files)
- **Interactive Demo State Tests**: `npm run test:demo` (6/6 flows passed, including Slides, Music, and Webcam)
- **Release Order Test**: `npm run test:releases` (6 test suites passed)
- **Release Verification**: `npm run release:verify` (7 releases verified)
- **OG Banner Generation**: `npm run seo:generate` (Builds 1200x630 pixel-perfect 84.1 KB evergreen social preview)
- **Production Static Build**: `npm run build` (Pre-renders 16 HTML pages and emits XML sitemap via Astro integration)
- **Automated SEO Audit**: `npm run seo:verify` (277-point verification across all HTML, metadata, and assets)
- **Harness Health**: `npm run harness:status`

---

## 4. Source References
- **Local Application Repository (READ-ONLY)**: `C:\Users\JC Zamora\source\repos\SwitchCast\SwitchCast\`
- **GitHub Releases Portal**: `https://github.com/jczamora-git/SwitchCast/releases`
- **Jeizi Productions Studio**: `https://jeiziproductions.com`

---

## 5. Do Not Repeat
- Do NOT use GitHub `published_at` timestamps to determine the latest software version. Always use semantic version comparison.
- Do NOT fabricate download links, package archives, or checksum files.
- Do NOT download or store Windows ZIP binaries inside the Astro deployment (`public/` or `dist/`).
- Do NOT modify the desktop application repository.
- Do NOT re-add the version badge to the main website top navbar.
- Do NOT install forbidden UI libraries (React, Next.js, Vue, Tailwind CSS, GSAP).

---

## 6. Next Action
- Deploy static build to Wasmer production and verify live URLs.
