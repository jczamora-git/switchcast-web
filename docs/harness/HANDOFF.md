# SWITCHCAST WEBSITE — HARNESS HANDOFF RECORD

**Document Version:** 1.8.0  
**Updated:** 2026-10-10  
**Harness Task:** Open Graph Domain Realignment & Cache Busting  

---

## 1. Current Status
- **Status**: SwitchCast v1.2.1 Integrated as Latest Release; 4 Published Releases Archived
- **Page Structure**:
  - Landing Page: `/` (`src/pages/index.astro` incorporating `src/components/ProductExperience.astro` and `src/components/demo/InteractiveDemo.astro`)
  - Release Center Catalog: `/releases/` (`src/pages/releases/index.astro`)
  - Dynamic Release Detail Pages: `/releases/[version]/` (`src/pages/releases/[version].astro` generating `/releases/v1.2.1/`, `/releases/1.2.1/`, `/releases/v1.2.0/`, `/releases/1.2.0/`, `/releases/v1.1.0/`, `/releases/1.1.0/`, `/releases/v1.0.0/`, `/releases/1.0.0/`)
- **Static Output**: Pre-rendered into `dist/` (10 static HTML pages)
- **Framework**: Astro 7.3.8 (Static SSG), Vanilla CSS, TypeScript, Vanilla JS
- **Official Version Hierarchy**:
  - `v1.2.1` (Latest Release) — Downloadable (`SwitchCast-v1.2.1-win-x64.zip`, 63.8 MB, SHA-256 with file)
  - `v1.2.0` (Previous Release) — Downloadable (`SwitchCast-v1.2.0-win-x64.zip`, 63.7 MB, SHA-256 with file)
  - `v1.1.0` (Previous Release) — Downloadable (`SwitchCast-v1.1.0-win-x64.zip`, 61.6 MB, SHA-256 digest copy)
  - `v1.0.0` (Initial Release) — Downloadable (`SwitchCast-v1.0.0-win-x64.zip`, 61.5 MB, SHA-256 digest copy)

---

## 2. Release Management & Ordering Contracts
- **Semantic Version Ordering Over Timestamps**:
  - Stable releases are ordered by semantic version (`1.2.1 > 1.2.0 > 1.1.0 > 1.0.0`).
  - `v1.2.1` is strictly selected as the latest release.
  - Regression test: `npm run test:releases` (`scripts/test-release-order.mjs`).
- **Official Download Assets**:
  - All four versions (`v1.2.1`, `v1.2.0`, `v1.1.0`, `v1.0.0`) are verified published GitHub releases with real `.zip` binary downloads.
  - v1.2.1 and v1.2.0 feature uploaded `.sha256` checksum files; v1.1.0 and v1.0.0 feature verified SHA-256 copy digests without dangling download links.
- **Concise User-Facing Changelogs**:
  - Every version features 3–4 concise highlights avoiding internal implementation jargon.
  - Version detail pages display "What's New in vX.X.X" highlights first, with detailed technical documentation housed in an accessible collapsible section.

---

## 3. Automation & Verification Workflows
- **Diagnostics Check**: `npm run check` (0 errors, 0 warnings across 24 files)
- **Interactive Demo State Tests**: `npm run test:demo` (5/5 flows passed)
- **Release Order Test**: `npm run test:releases` (passed)
- **Verification Command**: `npm run release:verify` (4 releases verified)
- **Production Build**: `npm run build` (10 static pages built successfully into `dist/`)
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
- Present updated v1.2.1 release on website for user review.
