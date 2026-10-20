# SWITCHCAST WEBSITE — HARNESS CHANGELOG

All notable changes to the SwitchCast website and its dedicated agent harness are documented here.

---

## [2.4.0] — 2026-10-20

### Added (Official Windows Setup EXE as Primary Download)
- **Windows Setup Installer as Primary Download Target**:
  - Designated `SwitchCast-Setup-v1.5.0-x64.exe` (44.5 MB, 44,451,001 bytes, SHA-256: `7D193E6AEAAA698BE7D9BB944C30C225618A11F19E5E693F23C611A657AA2351`) as the primary recommended package for v1.5.0.
  - Preserved `SwitchCast-v1.5.0-win-x64.zip` (64.0 MB, 67,121,906 bytes, SHA-256: `13553770161D343C8A116DDF31099FD4D2DB47D819462EE5F5866909649A7FC9`) as the alternate portable version with separate metadata and independent verification checksum.
- **Enhanced Release Synchronization (`scripts/sync-release.mjs`)**:
  - Updated asset selection pipeline to prefer official Windows x64 setup EXE installers while retaining ZIP packages as portable alternatives.
  - Implemented separate checksum matching per binary asset, resolving canonical SHA-256 hashes directly from GitHub API asset digests with remote `.sha256` asset fallback.
  - Ensured future releases cleanly support both installer EXE and portable ZIP assets without hash cross-contamination.
- **Verification Harness Expansion (`scripts/verify-release.mjs`, `scripts/test-release-order.mjs`)**:
  - Removed ZIP-only verification constraints; added full validation for both `.exe` and `.zip` packages, package-specific checksum filenames, and portable package URLs.
  - Updated regression test assertions to verify v1.5.0 primary Setup EXE and alternate portable ZIP.
- **Homepage Download Section Updates (`src/components/DownloadSection.astro`)**:
  - Primary button: "Download for Windows" targeting `SwitchCast-Setup-v1.5.0-x64.exe`.
  - Supporting label: "Setup Installer · Windows x64 · 44.5 MB".
  - Subtle secondary option link: "Prefer the portable version? Download ZIP".
  - Quick Setup updated for installer workflow: 01 Download, 02 Install (Run setup wizard), 03 Present (Launch from Start Menu or Desktop shortcut).
  - Quick checksum toggle configured to copy installer SHA-256 hash.
- **Hero Messaging Alignment (`src/components/Hero.astro`)**:
  - Replaced outdated "No Installation Wizard" messaging with "Easy Windows Setup · Local-First · No Remote Tracking".
- **Release Center & Detail Pages (`src/pages/releases/index.astro`, `src/pages/releases/[version].astro`)**:
  - Dual action buttons: Primary "Download Installer (.exe)" and secondary "Download Portable ZIP".
  - Separate checksum display blocks and one-click copy buttons for both installer and portable packages.
  - Added "Installation & Getting Started" guide on release detail page.
  - Updated hosting notice to reflect installer and portable package coexistence.
- **SEO Structured Data**:
  - Verified `SoftwareApplication` JSON-LD schema on homepage points to `SwitchCast-Setup-v1.5.0-x64.exe` with `44.5 MB` file size.

---

## [2.3.0] — 2026-10-20

### Added (Premium Editorial Footer High-Pass)
- **Mobbin-Inspired Editorial Footer Architecture (`src/components/Footer.astro`)**:
  - Replaced the compact utilitarian footer with a spacious, typography-driven editorial footer adhering to Mobbin's visual principles while strictly preserving SwitchCast's distinct visual branding.
  - Palette: Deep near-black background (`#050507`), subtle upper divider (`rgba(255, 255, 255, 0.08)`), refined typography hierarchy, and restrained SwitchCast coral accent highlights (`#ff7a59`).
  - Multi-column editorial layout:
    - **Brand Column (Left)**: SwitchCast vector icon and title, evocative product descriptor (*"One shared window. Everything you present."*), and formal creator attribution (*"Created by John Christopher King Zamora / A Jeizi Productions project"*).
    - **Navigation Columns (Right)**:
      - `Product`: `How It Works` (`/#showcase`), `Interactive Demo` (`/#demo`), `Download for Windows` (`/#download`).
      - `Releases`: `Latest Release (v1.5.0)` (`/releases/v1.5.0/`), `All Versions` (`/releases/`), `GitHub Repository` (`https://github.com/jczamora-git/SwitchCast`).
      - `Creator`: `Jeizi Productions` (`https://jeiziproductions.com`), `Contact Developer` (`mailto:jeizi.productions@gmail.com`).
  - Dynamic release metadata integration: Uses `getLatestRelease()` to dynamically generate `Latest Release v${releaseData.version}` linking directly to its release detail page.
  - Bottom copyright row: Clean dynamic copyright (`© 2026 SwitchCast. All rights reserved. • Built by John Christopher King Zamora`) and standalone application indicator.
- **Oversized Background Wordmark (`SWITCHCAST`)**:
  - Implemented an oversized typography display feature spanning the bottom of the footer: `font-size: clamp(5.5rem, 17.5vw, 18.5rem)`.
  - Subtle dark-gray contrast gradient with faint coral warmth (`rgba(255, 255, 255, 0.045)` to `rgba(255, 122, 89, 0.015)`).
  - Strictly decorative (`aria-hidden="true"`, `pointer-events: none`, `user-select: none`).
  - Contained within `overflow: hidden` bounding wrapper with bleed effect; verified zero horizontal document overflow across all viewports.
- **Seamless Dark Section Transition (`src/components/DownloadSection.astro`)**:
  - Refined download section lower edge with subtle vertical gradient fade into the deep `#050507` footer surface, avoiding jarring surface contrasts while preserving natural document scrolling.
- **Subtle Interactions & Accessibility**:
  - Restrained hover micro-interactions (soft coral text shifts and directional underlines).
  - Explicit keyboard focus rings (`outline: 2px solid var(--accent-coral)`).
  - Full `prefers-reduced-motion` compliance.
- **Responsive Adaptations**:
  - Desktop (1440px): 4-column balanced grid with generous negative space and giant wordmark.
  - Tablet / Mobile (390px, 768px): Stacks brand information with a clean 2-column navigation grid, scaling wordmark to `clamp(4rem, 16vw, 7.5rem)`.
- **Browser Subagent Visual QA**:
  - Verified across Desktop (1440x900), Mobile (390x844), and Release Catalog (`/releases/`) with automated screenshot captures.

---

## [2.2.0] — 2026-10-20

### Added (Premium Product Experience & Glass Navbar Redesign)
- **Removal of Technical Developer Scenes & Metrics**:
  - Completely purged code editor views (`PresentationCoordinator.cs`, `Renderer.cs`, C# method implementations), Direct3D latency claims, pipeline reliability percentages, and cloud telemetry counters from the showcase.
  - Refocused the showcase on a realistic business presentation workflow: **"One Meeting. Multiple Sources. One Shared Window."**
- **Real-World Presenter Showcase (`src/components/ProductShowcase.astro`)**:
  - Implemented 4 connected business presentation scenes based on an executive Quarterly Business Review:
    - `01 / PREPARE ("Everything ready")`: Session Manager queueing business sources (`Quarterly Review.pptx`, `Sales Dashboard — Browser`, `Product Walkthrough.mp4`, `Presenter Camera`) with active/next indicators and staged preview.
    - `02 / SHARE ("Share once")`: Presentation Output window displaying a professional business slide with key metrics (+38% YoY, 94% Retention, 12,400+ Teams) and quarterly performance chart.
    - `03 / SWITCH ("Switch seamlessly")`: Single persistent output window smoothly cycling through Sales Dashboard, Walkthrough Video, and Presenter Studio Camera without changing the screen share.
    - `04 / CONTROL ("Stay in control")`: Floating Presenter Dock with slide navigation (`‹ Slide 4 / 18 ›`), Freeze-Frame Pause, and Blackout curtain demonstration.
  - Mobile-first adaptation: Prioritizes large audience output previews, legible metrics, and tap-friendly scene selector buttons without horizontal overflow.
- **Premium Floating Glass Navigation (`src/components/Navbar.astro`)**:
  - Refined floating navbar with dark translucent glass (`rgba(24, 25, 34, 0.78)` to `rgba(14, 15, 21, 0.84)`), 22px backdrop blur, subtle 1px border, and top-edge light reflection highlight (`inset 0 1px 0 0 rgba(255, 255, 255, 0.14)`).
  - Navigation links: `How It Works`, `Try Demo`, `Why SwitchCast`, `Releases`, GitHub repo icon, and Coral `Download` button.
  - Added full-screen dimmed backdrop overlay for mobile menu drawer with Escape key, outside-click, and link selection auto-dismissal.
- **Anchor Offset & Scroll Clearance (`src/styles/global.css`)**:
  - Configured `html { scroll-padding-top: 104px; }` and `.section, .hero-section { scroll-margin-top: 104px; }` ensuring zero heading overlap under the floating navbar.
- **Dedicated Interactive Simulator Entry Point (`src/components/ProductExperience.astro`)**:
  - Streamlined `ProductExperience.astro` to provide a dedicated hands-on invitation (*"Try It Yourself" / "Hands-on Interactive Simulator"*).
  - Removed redundant duplicate workflow steps to keep homepage concise and non-repetitive.
- **Comprehensive Visual & Browser QA**:
  - Executed browser subagent testing on desktop (1280x800) and mobile (390x844) viewports confirming zero overlap, real-world scenes, and working mobile navigation.

---

## [2.1.0] — 2026-10-20

### Added (Cinematic Website & Product Experience High-Pass)
- **Floating Inset Navigation Bar (`src/components/Navbar.astro`)**:
  - Implemented centered floating dark surface (`max-width: 1140px`, `top: 0.85rem`) with 20px backdrop blur, subtle 1px border, and controlled shadow.
  - Desktop: SwitchCast brand icon and title | `How It Works`, `Simulator`, `Why SwitchCast`, `Releases` | GitHub repository link + Download button.
  - Mobile: Floating pill with logo and animated hamburger toggle button. Dropdown card drawer includes all navigation routes, GitHub repository link, and full-width Download CTA. Auto-closes on link selection, outside click, and Escape key.
- **Hero Hierarchy & Supporting Copy Refinement (`src/components/Hero.astro`)**:
  - Preserved headline `SHARE ONCE. SWITCH SEAMLESSLY.`.
  - Added product identifier pill: `SwitchCast for Windows · v1.5.0` with subtle coral pulse indicator.
  - Updated supporting copy to exact value proposition: *"Switch between apps, slides, cameras, and media without changing the window your audience sees."*
  - Dual CTAs: `Download for Windows` (`#download`) and `See How It Works` (`#showcase`).
- **Cinematic Product Showcase (`src/components/ProductShowcase.astro`)**:
  - Created a dedicated, reusable component showcasing the authentic Windows desktop presentation environment with subtle coral glow backdrop.
  - 4-scene interactive storyboard:
    - `01 One Window`: Presentation Output displaying keynote slide deck with live audience view pill.
    - `02 Switch Sources`: Seamless source transition into live code editor window.
    - `03 Stay in Control`: Zoomed view of Floating Presenter Dock with Next/Prev source, slide counter (`4 / 18`), Freeze-Frame Pause, and Blackout curtain.
    - `04 Ready to Present`: Unified presentation workflow showing Control Application queue, active mode bar, and floating dock.
  - Autoplays smoothly (4.5s per scene), pauses when offscreen (`IntersectionObserver`), respects `prefers-reduced-motion`, with manual tab triggers and Play/Pause control. Zero layout shift.
  - Mobile adaptation: Responsive portrait stage with bold titles, readable text, and tap-friendly tabs.
- **Interactive Simulator Preservation (`src/components/ProductExperience.astro`)**:
  - Maintained complete interactive simulator (`InteractiveDemo.astro`) as a dedicated hands-on section with `#demo` and `#experience` anchor support.
  - Accompanied by the 3 simple steps: Select, Share, Switch.
- **Anchor Navigation & Scroll Alignment (`src/styles/global.css`)**:
  - Configured `html { scroll-padding-top: 96px; }` and `.section { scroll-margin-top: 96px; }` to eliminate heading clipping under the floating navbar.
- **Download Section Polish (`src/components/DownloadSection.astro`)**:
  - Updated section title to `Ready for Your Next Presentation?` and button to `Download for Windows`.
- **Browser Visual Verification**:
  - Completed end-to-end browser subagent verification on desktop (1920x1080) and mobile (390x844) viewports.

---

## [2.0.0] — 2026-10-20

### Added (SwitchCast v1.5.0 Release Integration & Website Overhaul)
- **Official SwitchCast v1.5.0 Publication & Synchronization**:
  - Integrated official release `v1.5.0` as the latest stable Windows release (`SwitchCast-v1.5.0-win-x64.zip`, 64.0 MB, 67,120,738 bytes).
  - Pinned SHA-256 verification hash `DE5D44FDE3BDECF4094A2618E042DFBF4146DABFB1B698D6484E4C7B0C9EB324` with dedicated `.sha256` download asset.
  - Successfully synced complete 7-release historical catalog (`v1.5.0`, `v1.4.0`, `v1.3.0`, `v1.2.1`, `v1.2.0`, `v1.1.0`, `v1.0.0`).
- **Release Synchronization Overhaul (`scripts/sync-release.mjs`)**:
  - Fixed sync script to gracefully handle published releases without Windows ZIP archives as `downloadable: false`, `package: null`, and status `Download Unavailable` without skipping or crashing.
  - Preserved release notes, publication dates, and GitHub links for non-downloadable releases.
  - Enforced strict semantic version ordering over GitHub publication timestamps (`1.5.0 > 1.4.0 > 1.3.0 > 1.2.1 > 1.2.0 > 1.1.0 > 1.0.0`).
  - Added release deduplication by version.
- **Dynamic Release Verification & Order Regression Tests**:
  - Refactored `scripts/verify-release.mjs` and `scripts/test-release-order.mjs` to remove hardcoded version `1.2.1` and release count `4`.
  - Added automated test cases for semver vs timestamp anomalies, non-downloadable published release handling, deduplication, and brief changelog highlights.
- **Product Capabilities & Positioning Update**:
  - Updated positioning to "A simpler way to manage everything you present" across Hero, ProductExperience, and WhySwitchCast.
  - Highlighted PowerPoint slide support, live slideshows, webcam feeds, background music playlists, and external display routing.
  - Updated privacy language: "No remote tracking. Local-first performance and diagnostics."
  - Added compact "What's New in v1.5" highlight card in the download area.
- **Interactive Simulator Expansion**:
  - Added PowerPoint Slideshow with Previous / Next slide stepping controls in both dashboard and floating dock.
  - Added simulated Webcam / Camera video source with synthetic preview (zero permissions or hardware capture).
  - Added Background Music view with local playlist preview, track controls, volume, and mini floating dock audio button.
  - Added compact Performance & Telemetry monitor in Settings (labeled DEMO DATA, strictly zero GPU probing).
  - Added Flow 6 to interactive demo test suite (`scripts/test-demo-store.mjs`).
- **Evergreen Social Artwork & SEO Updates**:
  - Updated Open Graph artwork badge to `Free • Standalone` (version-independent) and regenerated `public/og-switchcast.png`.
  - Updated `SoftwareApplication` JSON-LD schema, sitemap generator, and SEO metadata to reflect v1.5.0.

---

## [1.9.0] — 2026-10-10

### Added (Production SEO & Open Graph Overhaul)
- **Centralized SEO Architecture (`src/config/seo.ts`)**:
  - Centralized production origin (`https://switchcast.wasmer.app`), default title, description, and canonical trailing-slash URL generator.
- **Reproducible 1200x630 Open Graph Generator (`scripts/generate-og.mjs`)**:
  - Implemented automated Sharp-based generator creating a 1200x630 px PNG (`public/og-switchcast-v2.png` and `public/og-switchcast.png`).
  - Optimized file size from 1.48 MB down to 85.1 KB with authentic vector logo, editorial typography, platform pills, and live presenter dock preview.
  - Added safe area padding (>80px) for zero-clipping social link previews.
- **Automated XML Sitemap Integration (`scripts/sitemap-integration.mjs`)**:
  - Added custom Astro build integration generating `dist/sitemap.xml` with all 6 canonical routes.
  - Strictly excluded duplicate version aliases (`/releases/1.2.1/`) from sitemap.
- **Search Engine Canonicalization & Alias Noindex Handling**:
  - Standardized trailing slash URLs across navbar, footer, buttons, and detail pages.
  - Added `<meta name="robots" content="noindex, follow" />` on non-canonical version aliases while preserving bookmarks.
- **Page-Specific Schema.org Structured Data**:
  - Bound authoritative `SoftwareApplication` JSON-LD schema exclusively to homepage (`/`).
  - Added `BreadcrumbList` schema to Release Center (`/releases/`) and release detail pages (`/releases/v1.2.1/`).
- **Google Search Console Readiness**:
  - Deployed verification file `public/google8e150a81a712479d.html` and meta tag `<meta name="google-site-verification" content="google8e150a81a712479d" />`.
  - Documented setup guide in `docs/deployment/SEO.md`.
- **20-Point Automated Verification Suite (`scripts/verify-seo.mjs`)**:
  - Added `npm run seo:verify` covering 179 distinct assertion checks across build outputs.

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
