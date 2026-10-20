# SWITCHCAST WEBSITE — HARNESS HANDOFF RECORD

**Document Version:** 3.1.0  
**Updated:** 2026-10-21  
**Harness Task:** SEO & Open Graph Metadata Optimization  

---

## 1. Current Status
- **Status**: SEO and social preview metadata optimized for high SERP click-through and clean, un-truncated previews on Twitter/X, LinkedIn, and Facebook/Messenger. Title under 60 chars, description in target 140–155 chars, and OG description under 125 chars. Single unified editorial storyboard structure intact.
- **Page Structure (`src/pages/index.astro`)**:
  - `Navbar.astro`: Sticky floating glass navigation with aligned narrative order (`Capabilities`, `How It Works`, `Controls`, `Releases`, `Download`) and unified single-container mobile glass overlay with internal header row, close button, backdrop blur, and body scroll locking.
  - `Hero.astro`: Headline *"SHARE ONCE. SWITCH SEAMLESSLY."* with coral gradient, single installer primary CTA, secondary tutorial CTA, and 1px hairline lower grid boundary.
  - `ProductCapabilities.astro`: Continuous 12-column modular editorial grid with shared 1px hairline dividers, asymmetric column spans (8/4, 4/8, 6/6), genuine screenshots, and zero broken images.
  - `TutorialSection.astro`: 6-chapter sequential product storyboard (`Prepare`, `Share`, `Switch`, `Control`, `Present`, `Play`) in a continuous alternating 2-column grid, vertical numbered micro-steps (no isolated cards), authentic v1.5.0 screenshots, and accessible lightbox modal.
  - `PresenterControls.astro`: Compact 3×2 continuous control matrix with hairline dividers, icons, and keyboard shortcuts.
  - `DownloadSection.astro`: Clean, streamlined single editorial container with official Windows Setup EXE CTA, specs, 3-step setup (`Download → Install → Present`), and SHA-256 copy button.
  - `Footer.astro`: Premium editorial footer with creator attribution (`John Christopher King Zamora`, `Jeizi Productions`) and oversized atmospheric `SWITCHCAST` wordmark.
- **Static Output**: Pre-rendered into `dist/` (16 static HTML pages + XML sitemap + robots.txt).
- **Technology Stack**: Astro 7.3.8 (Static SSG), Vanilla CSS, TypeScript, Minimal Vanilla JS, Sharp (build-time WebP optimization). Zero external UI frameworks.

---

## 2. Editorial Storyboard Architecture

### Reusable Editorial Grid Tokens & Shell (`src/styles/global.css`)
- `.editorial-shell`: Continuous perimeter container (`border: 1px solid var(--sc-border-base)`), surface background, minimal corner rounding (`var(--radius-sm)`).
- `.editorial-tag`: Small monospaced uppercase category indicator in coral accent (`#ff7a59`).
- `.editorial-divider`: 1px hairline divider (`var(--sc-border-subtle)`).
- Eliminated stacked SaaS cards, thick borders, nested box wrappers, and arbitrary vertical whitespace gaps.

### Authentic Screenshot Asset Mapping
All 6 authentic v1.5.0 SwitchCast application screenshots are mapped and displayed with both WebP and PNG sources:
1. `public/screenshots/sources.webp` — Sources Manager interface with running app queue checkboxes (*Chapter 01 — Prepare*).
2. `public/screenshots/presentation-output.webp` — Dedicated Presentation Output window (*Chapter 02 — Share*).
3. `public/screenshots/dashboard.webp` — Main Dashboard with session state and switching controls (*Chapter 03 — Switch*).
4. `public/screenshots/presenter-dock.webp` — Floating Presenter Dock with chevrons, pause, and blackout (*Chapter 04 — Control* & *Capability 03*).
5. `public/screenshots/powerpoint.webp` — PowerPoint and media slides presentation engine (*Chapter 05 — Present* & *Capability 05*).
6. `public/screenshots/music-playlists.webp` — Independent background music playlists and volume player (*Chapter 06 — Play* & *Capability 06*).

### Secondary SVG Concept Illustrations (`public/illustrations/`)
Used strictly for conceptual workflows that cannot be captured in a single screenshot:
- `single-output.svg` — 01 One Shared Window routing concept.
- `external-display.svg` — 02 External displays and projector routing diagram (no external monitor required).
- `source-switching.svg` — 04 Source switching pipeline illustration.

---

## 3. Verification & QA Results

| Verification Test | Command | Result | Notes |
| :--- | :--- | :--- | :--- |
| **Diagnostics & Types** | `npm run check` | **PASS (Code 0)** | 0 errors, 0 warnings, 0 hints across 35 files |
| **Release Manifest Contract** | `npm run release:verify` | **PASS (Code 0)** | 7 releases validated, v1.5.0 installer & ZIP hashes verified |
| **Release Order & Regression** | `npm run test:releases` | **PASS (Code 0)** | 6 test suites passed |
| **Interactive Demo State** | `npm run test:demo` | **PASS (Code 0)** | 6/6 demo state transitions passed |
| **Static Production Build** | `npm run build` | **PASS (Code 0)** | 16 static HTML pages generated in 789ms |
| **Automated SEO Audit** | `npm run seo:verify` | **PASS (Code 0)** | 277/277 checks passed, sitemap & OG verified |
| **Offline Harness Health** | `npm run harness:status` | **PASS (Code 0)** | All harness documentation and local links healthy |
| **Browser Subagent Visual QA** | Desktop (1920/1440px) & Mobile (390×844) | **PASS** | Storyboard alternating grid, lightbox modal (ESC dismiss), 3x2 matrix, zero overflow verified |

---

## 4. Source References
- **Local Application Repository (READ-ONLY)**: `C:\Users\JC Zamora\source\repos\SwitchCast\SwitchCast\`
- **GitHub Releases Portal**: `https://github.com/jczamora-git/SwitchCast/releases`
- **Jeizi Productions Studio**: `https://jeiziproductions.com`

---

## 5. Constraints & Prohibitions
- Do NOT push or deploy without prior user local review.
- Do NOT touch or modify files in `C:\Users\JC Zamora\source\repos\SwitchCast\SwitchCast\`.
- Do NOT invent fake screenshot filenames or display broken image tags.
- Do NOT use third-party CSS or JavaScript frameworks (Tailwind, React, Vue, GSAP).
- Do NOT reintroduce nested card wrappers or duplicate explanations across sections.
