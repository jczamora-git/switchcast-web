# SWITCHCAST WEBSITE — HARNESS CHANGELOG

All notable changes to the SwitchCast website and its dedicated agent harness are documented here.

---

## [1.8.0] — 2026-10-10

### Fixed (Open Graph Domain & Scraper Cache-Busting)
- **Active Wasmer Domain Realignment**:
  - Updated `astro.config.mjs`, `BaseLayout.astro`, releases pages, and `robots.txt` from non-resolving placeholder domain `https://switchcast.jeiziproductions.com` to the live active domain `https://switchcast.wasmer.app`.
  - Fixed 404 response on social crawler image scrapers fetching `og-switchcast.png`.
- **Open Graph Asset Cache-Busting**:
  - Appended version parameter `?v=1.2.1` to `<meta property="og:image">` and `twitter:image` to bust edge proxy and social crawler image caches.

---

## [1.7.0] — 2026-10-10

### Changed (SwitchCast v1.2.1 Release Integration)
- **Official SwitchCast v1.2.1 Publication**:
  - Integrated newly published release `v1.2.1` as the latest stable Windows release (`SwitchCast-v1.2.1-win-x64.zip`, 63.8 MB, 66,891,945 bytes).
  - Pinned SHA-256 ZIP verification hash `0A6D1EB0970800CF971ACFC2799908FE8D5B38AFFAE2DB6A7513B8B917DF643C` with separate `.sha256` download asset.
  - Moved `v1.2.0` to previous versions list; preserved all historical releases (`v1.2.0`, `v1.1.0`, `v1.0.0`) with direct downloads.
- **Brief v1.2.1 User-Facing Changelog**:
  - Added 4 concise highlights to `sync-release.mjs` and release manifests: media source presentation output activation, enhanced dock with direct source unqueue, fixed mixed-source queue navigation, and updated application branding.
- **Homepage & Release Center Consistency**:
  - Automatically synchronized `src/data/release.json` and `src/data/releases.json`.
  - Homepage Hero, Download Section, JSON-LD `SoftwareApplication` schema, and Release Center catalog seamlessly reflect `v1.2.1`.
  - Statically generated detail pages `/releases/v1.2.1/` and `/releases/1.2.1/` with overview highlights, package downloads, and collapsible full documentation.
- **Authentic Branding Asset Synchronization**:
  - Imported updated multi-resolution `SwitchCast.ico` (22,089 bytes) from desktop project `Assets/` into `public/favicon.ico` and `public/assets/SwitchCast.ico`.
- **Harness & Verification Hardening**:
  - Updated `scripts/verify-release.mjs` and `scripts/test-release-order.mjs` to validate 4 releases with `v1.2.1` as latest.

---

## [1.6.0] — 2026-10-10

### Changed (Interactive Demo UI/UX High-Pass & Website Navigation)
- **Stable Demonstration Window Geometry**:
  - Stabilized desktop demo layout (`.demo-grid: minmax(0, 1.2fr) minmax(0, 0.95fr)`) with fixed height (`height: 520px`) and dedicated internal vertical scrolling on `.win-content` and `.sources-catalog-list`, eliminating layout shifting across tab switches or presentation states.
  - Pinned presentation canvas strictly to `aspect-ratio: 16 / 9; width: 100%;` to maintain constant visual framing.
  - Implemented stable explanation container (`min-height: 86px`) to prevent right-column height jumps upon interaction.
- **Unified Single Explanation System**:
  - Consolidated overlapping instructional copy into ONE dynamic explanation card titled `WHAT THIS DOES` (default: *"Explore the controls to see how SwitchCast works."*).
  - Standardized all interaction explanations to 15–25 word single-sentence descriptions.
  - Removed clutter: meeting tip dashed banner, verbose subheaders, and clunky 4-step workflow chip badges.
- **Dedicated Mobile Demonstration Layout**:
  - Implemented top-level mobile view switcher (`[ SwitchCast App ] [ Audience Output ] [ Presenter Dock ]`) on screens `<= 1024px`.
  - Replaced vertical sidebar with responsive horizontal navigation pills for the App view on mobile.
  - Adapted Presenter Dock into a touch-friendly wrapped control grid while retaining full shared state synchronization with `DemoStore`.
- **Website Navigation Polish**:
  - Removed redundant `v1.2.0` badge beside SwitchCast in the top website navbar (`Navbar.astro`).

---

## [1.5.0] — 2026-10-10

### Changed (Release Center History Correction & Brief Changelogs)
- **Official SwitchCast v1.1.0 Publication**:
  - Removed outdated "Development Milestone", "Not Published", and "No Binary Package Available" statuses now that v1.1.0 has been officially published on GitHub Releases.
  - Linked real official downloadable Windows asset (`SwitchCast-v1.1.0-win-x64.zip`, 61.6 MB) with direct download button.
  - Extracted asset digest (`B743987499576EDAD4176F4A8B8CA66E0D0570D3E8CE6D9BA02298A7C23D46F4`) with one-click copy button without inventing a non-existent standalone `.sha256` download file.
- **Strict Semantic Version Ordering**:
  - Pinned `v1.2.0` strictly as "Latest Release" based on semantic version hierarchy (`1.2.0 > 1.1.0 > 1.0.0`) despite GitHub's `published_at` timestamp showing v1.1.0 published at a later time.
  - Pinned `v1.1.0` as "Previous Release" and `v1.0.0` as "Initial Release".
  - Created automated regression test (`scripts/test-release-order.mjs` via `npm run test:releases`) proving semantic order stability across future synchronizations.
- **Concise User-Facing Changelog Highlights**:
  - Simplified changelog presentation across the entire website to 3–4 concise bullet points per version, eliminating internal implementation jargon (Direct3D, COMException, HWND, threading internals).
  - Placed "What's New in vX.X.X" highlights prominently at the top of individual release pages (`/releases/[version]/`), with full technical documentation housed in an accessible collapsible section.
- **Release Synchronization & Verification Hardening**:
  - Updated `scripts/sync-release.mjs` to seamlessly merge official published metadata for `v1.1.0` while maintaining idempotent deduplication.
  - Updated `scripts/verify-release.mjs` to accept digest-only checksums when no standalone file asset is uploaded.

---

## [1.4.0] — 2026-10-10
 
### Added (Interactive Product Demonstration Simulation)
- **Interactive SwitchCast Demonstration Simulator (`src/components/demo/InteractiveDemo.astro`)**:
  - Replaced the static Product Experience mockup with a fully functional, authentic browser simulation of the SwitchCast desktop application.
  - Replicated WinUI 3 desktop shell with custom title bar, navigation sidebar, 4-column status strip, and Fluent-styled controls.
  - Implemented 3 application tabs: **Dashboard** (presentation status, active source selector, pause/blackout toggles, live queue list), **Sources** (category tabs for Application Windows, Displays, and Media with search and queue toggling), and **Settings** (General & About v1.2.0, platform metadata, theme preview).
  - Implemented **Presentation Output Window** displaying 6 distinct source previews (Web Browser, PowerPoint Slides, VS Code Editor, Hardware Displays 1 & 2, Media Video, and System Architecture Diagram), standby screen, frozen frame pause indicator, and 100% opaque privacy blackout curtain.
  - Implemented **Floating Presenter Dock** with on-air status pill, previous/next source switching, switching mode toggles (`Live Only`, `Active + Live`, `Active Only`), pause, blackout, stop presenting, borderless fullscreen toggle, and adaptive video transport controls (play/pause, seek -10s/+10s, restart, timeline progress, volume slider, mute).
  - Implemented **Dynamic Explanation Card (`CONTROL EXPLAINED`)** updating seamlessly on every user interaction with human-friendly descriptions.
  - Implemented **Guided Workflow Tracker** tracking 4 steps: 1. Add Sources -> 2. Open Output -> 3. Start Presenting -> 4. Switch Sources.
  - Implemented **Reset Demo** button restoring initial simulator defaults without reloading the page.
- **Simulator Architecture & Pure State Engine**:
  - `src/scripts/demo/demo-types.ts`: Comprehensive TypeScript types.
  - `src/scripts/demo/demo-data.ts`: 7 synthetic demo sources and initial state.
  - `src/scripts/demo/demo-store.ts`: Single-source-of-truth state container with subscription pattern, video timeline loop, and prerequisite checking.
  - `src/scripts/demo/demo-controller.ts`: Pure Vanilla DOM controller connecting UI events to `DemoStore`.
  - `src/styles/interactive-demo.css`: Authentic WinUI 3 styling and responsive layout (side-by-side desktop view, mobile view switcher).
  - `scripts/test-demo-store.mjs`: Node test suite validating all 5 interactive simulation user flows via `npm run test:demo`.
 
---

## [1.3.1] — 2026-10-10

### Added (Historical Version Timeline — v1.1.0 Milestone)
- **SwitchCast v1.1.0 Historical Development Milestone**:
  - Added intermediate milestone `v1.1.0` (tagged in local repository on October 9, 2026) to the version history timeline between `v1.2.0` and `v1.0.0`.
  - Audited and verified changes from desktop Git commit history: direct local media presentation (Images & Videos), initial local media audio playback, floating presenter dock dragging improvements, unified stop presenting workflow, and UI dropdown overflow constraints.
  - Clearly marked `v1.1.0` as `Development Milestone / Not Published` with zero fake download buttons, zero fabricated ZIP packages, and no dangling checksum or GitHub Release links.
  - Statically generated detail routes `/releases/v1.1.0/` and `/releases/1.1.0/` with milestone notices and verified notes.
- **Release Data & Synchronization Hardening**:
  - Extended `src/utils/releases.ts` with explicit `published` and `downloadable` flags.
  - Hardened `scripts/sync-release.mjs` to protect unpublished milestones from being overwritten or deleted across remote synchronizations.
  - Updated `scripts/verify-release.mjs` to enforce contracts for both published downloadable releases and unpublished development milestones.

---

## [1.3.0] — 2026-10-10

### Added (Release Center Implementation)
- **Official SwitchCast Release Center (`/releases/`)**:
  - `src/pages/releases/index.astro`: Comprehensive release catalog featuring prominent latest release showcase (`v1.2.0`), direct Windows download button, SHA-256 verification hash copy, and chronological previous version history (`v1.0.0`).
- **Dynamic Static Version Detail Pages (`/releases/[version]/`)**:
  - `src/pages/releases/[version].astro`: Pre-rendered static pages for all versions (`v1.2.0`, `1.2.0`, `v1.0.0`, `1.0.0`) with formatted changelogs, system specs, direct package download, and breadcrumb back navigation.
- **Centralized Release Manifest Architecture**:
  - `src/data/releases.json`: Centralized single source of truth containing structured records for all published releases.
  - `src/utils/releases.ts`: Typed data access helpers (`getAllReleases`, `getLatestRelease`, `getPreviousReleases`, `getReleaseByVersion`).
  - `src/utils/markdown.ts`: Pure TypeScript markdown parser rendering release notes cleanly into accessible HTML without external dependencies.
- **Automated Synchronization & Verification Workflows**:
  - `scripts/sync-release.mjs`: Extracted official GitHub releases, assets, sizes, and release notes; keeps `releases.json` and `release.json` synchronized. Added `npm run releases:sync` alias.
  - `scripts/verify-release.mjs`: Validates release manifest schema, download URLs, archive file extensions, and optional checksums. Added `npm run releases:verify` alias.
- **Navigation & Homepage Integration**:
  - Added `Releases` (`/releases`) to header navbar and mobile drawer menu with root-relative navigation anchors.
  - Added `Releases` link to site footer.
  - Updated homepage download section with prominent `View All Releases →` link.

---

## [1.2.1] — 2026-10-10

### Changed (Product Website Redesign)
- **Reduced Page to 4 Core Sections**:
  - `Hero.astro`: Replaced crowded technical layout with bold headline *"SHARE ONCE. SWITCH SEAMLESSLY."*, concise value proposition, subtle release pill, and prominent download CTA.
  - `ProductExperience.astro`: Replaced artificial code/stream mockup with clean presentation canvas showcase and 3 concise steps (*SELECT -> SHARE -> SWITCH*).
  - `WhySwitchCast.astro`: Replaced bloated 9-card feature grid with 3 focused, human-centered use cases (*Business Meetings*, *Webinars & Online Classes*, *Live Demonstrations*).
  - `DownloadSection.astro`: Replaced technical architecture boxes with focused download card, 3-step setup, and quiet SHA-256 copy toggle.
- **Simplified Navigation**: Condensed header to 3 links (*How It Works*, *Why SwitchCast*, *Download*), GitHub link, and download CTA.
- **Refined Footer**: Minimal layout attributing John Christopher King Zamora and Jeizi Productions without decorative tech badges.
- **Design System Polish**: Reduced excessive section padding (`clamp(3.25rem, 5.5vw, 5.25rem)`), softened card borders, eliminated nested cards, and removed uppercase monospace tags everywhere.
- **Removed Obsolete Components**: Deleted `ProductPreview.astro`, `Features.astro`, `HowItWorks.astro`, `UseCases.astro`, `SystemRequirements.astro`, `FAQ.astro`, and `features.ts`.

---

## [1.2.0] — 2026-10-10

### Added
- Complete standalone production website built with Astro (Static Generation), TypeScript, and Vanilla CSS.
- Dedicated Website Coding-Agent Harness: `AGENTS.md`, `README.md`, `docs/harness/AUDIT.md`, `docs/harness/HANDOFF.md`, `docs/harness/CHANGELOG.md`.
- Release Automation & Verification Scripts: `sync-release.mjs`, `verify-release.mjs`, `harness-status.mjs`.
- Assets: Authentic `favicon.ico` imported directly from desktop application source assets and vector `switchcast-logo.svg`.
