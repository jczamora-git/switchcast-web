# SWITCHCAST WEBSITE — HARNESS HANDOFF RECORD

**Document Version:** 2.4.0  
**Updated:** 2026-10-20  
**Harness Task:** Prioritize Windows Setup Installer EXE as Primary Download  

---

## 1. Current Status
- **Status**: Windows Setup EXE (`SwitchCast-Setup-v1.5.0-x64.exe`, 44.5 MB) Configured as Primary Recommended Download, Portable ZIP Preserved with Separate SHA-256 Hashes, Release Sync & Test Harness Expanded, Browser QA Verified
- **Page Structure**:
  - Landing Page: `/` (`src/pages/index.astro` featuring Floating Glass Navbar, Refined Hero, Real-World Cinematic Product Showcase, Dedicated Hands-on Simulator, Why SwitchCast, Download Section with EXE Primary + Portable ZIP link, and Spacious Editorial Footer)
  - Release Center Catalog: `/releases/` (`src/pages/releases/index.astro` with Dual Action Buttons, Separate Checksums, and BreadcrumbList schema)
  - Dynamic Release Detail Pages: `/releases/[version]/` (canonical routes `/releases/v1.5.0/` with Setup Wizard Guide + Portable ZIP and older versions with Standalone ZIP instructions)
- **Static Output**: Pre-rendered into `dist/` (16 static HTML pages + `dist/sitemap.xml` + `dist/robots.txt` + `dist/google8e150a81a712479d.html`)
- **Framework**: Astro 7.3.8 (Static SSG), Vanilla CSS, TypeScript, Minimal Vanilla JS, Sharp (build-time imaging)
- **Official Version Hierarchy**:
  - `v1.5.0` (Latest Release) — Primary: Setup Installer (`SwitchCast-Setup-v1.5.0-x64.exe`, 44.5 MB, SHA-256: `7D193E6AEAAA...`) | Portable: ZIP (`SwitchCast-v1.5.0-win-x64.zip`, 64.0 MB, SHA-256: `13553770161D...`)
  - `v1.4.0` (Previous Release) — Downloadable (`SwitchCast-v1.4.0-win-x64.zip`, 61.9 MB, SHA-256 with file)
  - `v1.3.0` (Previous Release) — Downloadable (`SwitchCast-v1.3.0-win-x64.zip`, 64.0 MB, SHA-256 with file)
  - `v1.2.1` (Previous Release) — Downloadable (`SwitchCast-v1.2.1-win-x64.zip`, 63.8 MB, SHA-256 with file)
  - `v1.2.0` (Previous Release) — Downloadable (`SwitchCast-v1.2.0-win-x64.zip`, 63.7 MB, SHA-256 with file)
  - `v1.1.0` (Previous Release) — Downloadable (`SwitchCast-v1.1.0-win-x64.zip`, 61.6 MB, SHA-256 digest copy)
  - `v1.0.0` (Initial Release) — Downloadable (`SwitchCast-v1.0.0-win-x64.zip`, 61.5 MB, SHA-256 digest copy)

---

## 2. Experience & Architecture Improvements
- **Premium Floating Glass Navigation (`src/components/Navbar.astro`)**:
  - Centered floating glass pill (`max-width: 1120px`, `top: 0.85rem`) with translucent surface (`rgba(24, 25, 34, 0.78)` to `rgba(14, 15, 21, 0.84)`), 22px backdrop blur, subtle 1px border (`rgba(255, 255, 255, 0.09)`), and inner top-edge light reflection (`inset 0 1px 0 0 rgba(255, 255, 255, 0.14)`).
  - Desktop layout: SwitchCast brand icon and title | `How It Works`, `Try Demo`, `Why SwitchCast`, `Releases` | GitHub repository link + Coral Download button.
  - Mobile layout: Clean pill with logo, animated hamburger toggle, and full-screen dimmed backdrop overlay. Floating glass dropdown card includes numbered routes, GitHub repository link, and full-width Download CTA. Auto-closes on link selection, outside click, and Escape key.
- **Scroll Alignment & Zero Heading Overlap (`src/styles/global.css`)**:
  - Configured `html { scroll-padding-top: 104px; }` and `.section, .hero-section { scroll-margin-top: 104px; }`.
  - Verified via browser subagent that navigating to `#showcase`, `#demo`, `#why-switchcast`, and `#download` keeps headings completely visible below the floating navbar with zero clipping.
- **Real-World Presenter Showcase (`src/components/ProductShowcase.astro`)**:
  - Removed all developer code snippets (`PresentationCoordinator.cs`, `Renderer.cs`, C# methods) and artificial technical telemetry metrics (latency, pipeline reliability percentages, telemetry counters).
  - Centered on a realistic business presentation workflow: **"One Meeting. Multiple Sources. One Shared Window."** (Quarterly Business Review):
    - **01 / PREPARE ("Everything ready"):** Session Manager showing queued business sources (`Quarterly Review.pptx`, `Sales Dashboard — Browser`, `Product Walkthrough.mp4`, `Presenter Camera`) with active/next status pills and staged preview.
    - **02 / SHARE ("Share once"):** Dedicated Presentation Output window displaying an executive keynote slide (`Q4 Business Performance & Revenue Growth`) with growth cards (+38% YoY, 94% Retention, 12,400+ Enterprise Teams) and quarterly growth chart.
    - **03 / SWITCH ("Switch seamlessly"):** Single output window seamlessly cycling through Sales Dashboard, Product Walkthrough video, and Presenter Camera feed without changing screen share.
    - **04 / CONTROL ("Stay in control"):** Front-and-center Floating Presenter Dock with slide stepping (`‹ Slide 4 / 18 ›`), Freeze-Frame Pause, and Blackout curtain demonstration with temporary audience screen curtain.
  - Mobile-first adaptation: Responsive layout focusing on large audience output previews, legible metrics, and tap-friendly scene selector buttons without horizontal overflow.
- **Spacious Editorial Footer & Oversized Wordmark (`src/components/Footer.astro`)**:
  - Rebuilt `src/components/Footer.astro` following Mobbin-inspired editorial principles: deep near-black backdrop (`#050507`), generous negative space (`padding: 5.5rem 0 0`), clean typography, and zero generic SaaS card elements or loud gradients.
  - Multi-column layout:
    - Left brand block: SwitchCast logo & wordmark, descriptor (*"One shared window. Everything you present."*), and creator attribution (*"Created by John Christopher King Zamora / A Jeizi Productions project"*).
    - Right link groups: Product (`How It Works`, `Interactive Demo`, `Download for Windows`), Releases (`Latest Release (v1.5.0)`, `All Versions`, `GitHub Repository`), and Creator (`Jeizi Productions`, `Contact Developer`).
    - Dynamic release versioning: Employs `getLatestRelease()` to dynamically link to `/releases/v${releaseData.version}/`.
  - Oversized typographic wordmark: Decorative `SWITCHCAST` text element (`aria-hidden="true"`, `font-size: clamp(5.5rem, 17.5vw, 18.5rem)`) positioned at the base with tight letter spacing (`-0.035em`) and gentle dark contrast gradient. Contained inside an `overflow: hidden` bounding wrapper with bleed effect; verified zero horizontal document overflow.
  - Dark section transition: Preceding `DownloadSection` features a subtle darkening vertical gradient into `#050507` without arbitrary sticky elements or unnatural scroll overlays.
  - Clean bottom row: Dynamic year copyright (`© 2026 SwitchCast. All rights reserved. • Built by John Christopher King Zamora`) and standalone application indicator.
- **Windows Setup EXE as Recommended Download (`src/components/DownloadSection.astro`, Release Center)**:
  - Pinned `SwitchCast-Setup-v1.5.0-x64.exe` (44.5 MB, 44,451,001 bytes, SHA-256: `7D193E6AEAAA698BE7D9BB944C30C225618A11F19E5E693F23C611A657AA2351`) as the default primary package across all download buttons.
  - Preserved `SwitchCast-v1.5.0-win-x64.zip` (64.0 MB, SHA-256: `13553770161D343C8A116DDF31099FD4D2DB47D819462EE5F5866909649A7FC9`) as an alternate portable download with distinct metadata and independent SHA-256 hash.
  - Updated Quick Setup flow for guided installation (01 Download, 02 Install setup wizard, 03 Present from Start Menu / Desktop).
  - Synchronized `SoftwareApplication` JSON-LD schema on homepage to point to the EXE installer.

---

## 3. Automation & Verification Workflows
- **Diagnostics Check**: `npm run check` (0 errors, 0 warnings across 31 files)
- **Interactive Demo State Tests**: `npm run test:demo` (6/6 flows passed)
- **Release Order Test**: `npm run test:releases` (6 test suites passed)
- **Release Verification**: `npm run release:verify` (7 releases verified)
- **Production Static Build**: `npm run build` (Pre-renders 16 HTML pages and emits XML sitemap via Astro integration in 1.97s)
- **Automated SEO Audit**: `npm run seo:verify` (277-point verification across all HTML, metadata, and assets)
- **Browser Subagent Visual QA**: Completed end-to-end verification of desktop glass navbar, anchor offsets, real-world showcase scenes, and mobile viewport (390×844) with working menu drawer and auto-close.
- **Harness Health**: `npm run harness:status`

---

## 4. Source References
- **Local Application Repository (READ-ONLY)**: `C:\Users\JC Zamora\source\repos\SwitchCast\SwitchCast\`
- **GitHub Releases Portal**: `https://github.com/jczamora-git/SwitchCast/releases`
- **Jeizi Productions Studio**: `https://jeiziproductions.com`

---

## 5. Do Not Repeat
- Do NOT push or deploy immediately; wait for user local visual review.
- Do NOT reintroduce technical developer code editors or benchmark telemetry into the product showcase.
- Do NOT clone Raycast's exact visual composition or macOS chrome. SwitchCast is an authentic Windows application.
- Do NOT remove or dismantle the interactive simulator.
- Do NOT use GitHub `published_at` timestamps to determine the latest software version. Always use semantic version comparison.
- Do NOT fabricate download links, package archives, or checksum files.
- Do NOT download or store Windows ZIP binaries inside the Astro deployment (`public/` or `dist/`).
- Do NOT modify the desktop application repository.
- Do NOT re-add the version badge to the main website top navbar logo.
- Do NOT install forbidden UI libraries (React, Next.js, Vue, Tailwind CSS, GSAP).

---

## 6. Next Action
- Await user local review of the redesigned experience at `http://localhost:4321/`.
