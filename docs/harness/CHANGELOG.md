# SWITCHCAST WEBSITE — HARNESS CHANGELOG

All notable changes to the SwitchCast website and its dedicated agent harness are documented here.

---

## [1.2.0] — 2026-10-10

### Added
- Complete standalone production website built with Astro (Static Generation), TypeScript, and Vanilla CSS.
- Responsive single-page layout featuring 11 core sections:
  1. `Navbar.astro` (Navigation, branding, version badge, download CTA, mobile menu)
  2. `Hero.astro` (Bold tagline, version pill, specs strip, primary download CTA)
  3. `ProductPreview.astro` (Interactive 4-view Fluent Design interface mockup: Dashboard, Presenter Dock, HWND Output, Sources Manager)
  4. `Features.astro` (Verified feature grid, category badges, global keyboard shortcuts table)
  5. `HowItWorks.astro` (4-step visual workflow and zero-leak privacy callout)
  6. `UseCases.astro` (Software demos, online teaching, executive meetings, webinars)
  7. `DownloadSection.astro` (Verified v1.2.0 release package, one-click SHA-256 copy, installation guide)
  8. `SystemRequirements.astro` (Platform compatibility table and OS compositor behaviors)
  9. `FAQ.astro` (Accessible interactive accordion addressing common questions)
  10. `Footer.astro` (Attribution to John Christopher King Zamora and Jeizi Productions, repository links)
- Dedicated Website Coding-Agent Harness:
  - `AGENTS.md` (Operational rules and read-only source constraints)
  - `README.md` (Project overview and CLI commands)
  - `docs/harness/AUDIT.md` (Architectural audit and feature verification record)
  - `docs/harness/HANDOFF.md` (Handoff state tracker)
  - `docs/harness/CHANGELOG.md` (This changelog record)
- Release Automation & Verification Scripts:
  - `scripts/sync-release.mjs` (Syncs manifest from GitHub Releases API)
  - `scripts/verify-release.mjs` (Verifies release manifest contract)
  - `scripts/harness-status.mjs` (Fast offline harness health report)
- Assets:
  - Authentic `favicon.ico` imported directly from desktop application source assets.
  - High-resolution vector `switchcast-logo.svg`.
- SEO & Accessibility:
  - Full OpenGraph & Twitter Card metadata.
  - `SoftwareApplication` JSON-LD structured data.
  - Full `prefers-reduced-motion: reduce` CSS override support.
