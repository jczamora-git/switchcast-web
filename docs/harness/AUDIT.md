# SWITCHCAST WEBSITE — ARCHITECTURAL AUDIT RECORD

**Document Version:** 1.0.0  
**Audit Date:** 2026-10-10  
**Repository Location:** `c:\Users\JC Zamora\Documents\Jeizi_Programming_Apps\switchcast-web`  
**Application Source Location:** `C:\Users\JC Zamora\source\repos\SwitchCast\SwitchCast\` (**STRICTLY READ-ONLY**)  
**Creator:** John Christopher King Zamora  
**Studio:** Jeizi Productions  

---

## 1. Executive Summary

This website serves as the official production landing page, feature showcase, and distribution portal for the SwitchCast Windows desktop application. The website is developed using Astro (Static Generation), TypeScript, and Vanilla CSS with zero heavy UI frameworks or runtime dependencies.

---

## 2. Verified Product Feature Inventory

Every feature showcased on this website has been directly audited against the local SwitchCast C# and XAML codebase in `C:\Users\JC Zamora\source\repos\SwitchCast\SwitchCast\`.

| Feature | Audit Classification | Evidence in Local Desktop Application Source |
| :--- | :--- | :--- |
| **Application Window Capture** | `IMPLEMENTED` | `Win32WindowDiscoveryService.cs`, `Windows.Graphics.Capture` interop, `PW_RENDERFULLCONTENT` fallback |
| **Physical Monitor Capture** | `IMPLEMENTED` | `Win32MonitorDiscoveryService.cs`, Direct3D 11 swapchain presentation |
| **Direct Image Presentation** | `IMPLEMENTED` | `MediaPresentationService.cs`, PNG/JPG/BMP/GIF direct static rendering with `Uniform` scaling |
| **Direct Video Presentation** | `IMPLEMENTED` | `Windows.Media.Playback.MediaPlayer`, `MediaPlayerElement` hardware-accelerated playback |
| **Direct Video Audio & Volume** | `IMPLEMENTED` | Windows audio endpoints routing, 0–100% volume slider, instant mute toggles on dashboard and dock |
| **Dedicated Presentation Output** | `IMPLEMENTED` | `PresentationWindow.xaml`, Single persistent Win32 HWND, 16:9 canvas |
| **Fullscreen Presentation Mode** | `IMPLEMENTED` | `AppWindowPresenterKind.FullScreen` borderless toggle via dock or `Escape` key |
| **Floating Presenter Companion Dock**| `IMPLEMENTED` | `PresenterDockWindow.xaml`, Windows App SDK `InputNonClientPointerSource` caption dragging |
| **Three Source Switching Modes** | `IMPLEMENTED` | `Live Only` (`L`), `Active + Live` (`A+L`), and `Active Only` (`A`) in `PresentationCoordinator.cs` |
| **Unified Multi-Source Queue** | `IMPLEMENTED` | `IPresentationStateService.cs` authoritative source collection |
| **Global Keyboard Shortcuts** | `IMPLEMENTED` | `Win32HotkeyService.cs` (`Ctrl+Shift+Right/Left`, `Ctrl+Shift+1..5`, `Ctrl+Shift+P/B/S/D/M`) |
| **Freeze-Frame (Pause)** | `IMPLEMENTED` | `PresentationCoordinator.TogglePause()` pausing frame updates |
| **Privacy Blackout Curtain** | `IMPLEMENTED` | `PresentationCoordinator.ToggleBlackout()` 100% opaque black curtain suspending audio and video |
| **True-Color Native Win32 Icons** | `IMPLEMENTED` | `Win32WindowIconService.cs` dynamic 32-bit icon extraction for open windows |
| **Fluent Dark & Light Modes** | `IMPLEMENTED` | Fluent theme dictionaries in `App.xaml` persisted via `ApplicationSettingsService` |
| **100% Offline / Zero Telemetry** | `IMPLEMENTED` | Purely local execution, zero network requests in desktop binary |

---

## 3. Product Asset Provenance

1. **Application Icon (`public/favicon.ico`)**: Authentic 7,667-byte multi-resolution Windows icon copied directly from `C:\Users\JC Zamora\source\repos\SwitchCast\SwitchCast\Assets\SwitchCast.ico`.
2. **Vector SVG Logo (`public/assets/switchcast-logo.svg`)**: Vector rendering representing the layered presentation window and switching arrow motifs.
3. **UI Previews (`src/components/ProductPreview.astro`)**: High-fidelity, code-accurate interactive UI mockups structured identically to the authentic XAML layouts in `DashboardPage.xaml`, `PresenterDockWindow.xaml`, `SourcesPage.xaml`, and `PresentationWindow.xaml`.

---

## 4. Release Integration Architecture

- **Authoritative Manifest Files**:
  - `src/data/releases.json`: Centralized array of all published releases (`v1.2.0`, `v1.0.0`).
  - `src/data/release.json`: Synced latest stable release record (`v1.2.0`) for backward compatibility.
- **Release Center Routes**:
  - Main Catalog: `/releases/` (`src/pages/releases/index.astro`).
  - Version Detail Static Pages: `/releases/[version]/` (`src/pages/releases/[version].astro` generating `/releases/v1.2.0/`, `/releases/1.2.0/`, `/releases/v1.0.0/`, `/releases/1.0.0/`).
- **Binary Hosting & Download URL Ownership**:
  - Official binaries are hosted exclusively on GitHub Releases.
  - Direct download links point directly to GitHub asset URLs (e.g. `https://github.com/jczamora-git/SwitchCast/releases/download/v1.2.0/SwitchCast-v1.2.0-win-x64.zip`).
  - No binary `.zip` files are stored in `public/` or `dist/`.
- **Markdown Notes Rendering**:
  - Pure TypeScript safe renderer (`src/utils/markdown.ts`) formats markdown headings, lists, tables, code blocks, and blockquotes into clean, sanitized HTML with zero client dependencies.
- **Sync Workflow**:
  - `scripts/sync-release.mjs` (`npm run releases:sync`): Fetches published releases from GitHub API, ignores drafts, normalizes sizes/dates, and writes both `releases.json` and `release.json`. If network fails, local manifests are preserved.
- **Validation Script**:
  - `scripts/verify-release.mjs` (`npm run release:verify`): Enforces manifest contract for all releases, validating URLs, package format, and optional SHA-256 integrity.

---

## 5. Design System Tokens

- **Background Deep**: `#08080a` / Primary: `#0d0e12` / Surface: `#181920`
- **Accent**: `#ff7a59` (Authentic SwitchCast Coral) / Accent Hover: `#ff8e72`
- **Text Primary**: `#f4f4f6` / Text Secondary: `#a6a7b3`
- **Status Live**: `#ff3b30` / Success: `#10b981`
- **Typography**: Space Grotesk (Headings), Inter (Body), JetBrains Mono (Technical tags & shortcuts)
- **Accessibility**: Full `prefers-reduced-motion: reduce` compliance across all CSS animations.

---

## 6. SEO & Metadata Configuration

- **Centralized SEO Config**: `src/config/seo.ts` with helper functions for canonical URLs and page metadata.
- **Production Origin**: `https://switchcast.wasmer.app`
- **Canonical Trailing Slash Convention**: Standardized across `/`, `/releases/`, and `/releases/vX.X.X/`.
- **OpenGraph & Twitter Cards**: 1200x630 pixel-perfect social preview (`public/og-switchcast-v2.png` generated via `npm run seo:generate`).
- **Automated XML Sitemap**: Generated via custom Astro integration at `dist/sitemap.xml` with 6 canonical routes.
- **Robots Directives**: `public/robots.txt` referencing `https://switchcast.wasmer.app/sitemap.xml`.
- **Structured Data**: `SoftwareApplication` JSON-LD schema on `/`; `BreadcrumbList` on `/releases/` and release detail pages.
- **Google Search Console**: Verified via `google8e150a81a712479d.html` and HTML meta tag.
- **Automated Audit**: 20-point verification script (`npm run seo:verify`).

---

## 7. Interactive Product Demonstration Architecture

The website features an authentic, fully interactive in-browser simulation of the SwitchCast Windows desktop application (`src/components/demo/InteractiveDemo.astro`):

- **Purpose**: Allows website visitors to experience the core SwitchCast workflow before downloading the application.
- **Architecture**:
  - `src/scripts/demo/demo-types.ts`: TypeScript contracts for simulated sources, presentation states, tabs, switching modes, and explanations.
  - `src/scripts/demo/demo-data.ts`: 7 synthetic demo sources spanning Application Windows (Browser, Slides, Code Editor), Displays & Monitors (Display 1 & 2), and Media Files (Video, Architecture Diagram).
  - `src/scripts/demo/demo-store.ts`: Centralized single source of truth managing tab navigation, queue management, presentation lifecycle (start/stop), source switching, pause, privacy blackout, switching modes (`LiveOnly`, `ActiveLive`, `ActiveOnly`), video transport, and dynamic single explanation state.
  - `src/scripts/demo/demo-controller.ts`: Pure Vanilla DOM event binding, subscriber controller, and mobile view switcher handler (`App`, `Output`, `Dock`).
  - `src/styles/interactive-demo.css`: Dedicated styling replicating the WinUI 3 dark shell, custom title bars, Fluent-styled buttons, floating dock, 16:9 presentation canvas, stable desktop window geometry (`height: 520px` with internal scrolling), stable explanation container (`min-height: 86px`), and mobile responsive layout.
- **Safety & Sandbox Discipline**:
  - Purely synthetic simulation running inside the browser DOM.
  - Does NOT access visitor windows, monitors, cameras, or OS APIs (`getDisplayMedia()` is strictly prohibited).
  - Zero server-side state or external telemetry.

---

## 8. Verification Results

- `npm run check`: Validated with zero diagnostic errors across 24 Astro & TypeScript files.
- `npm run test:demo`: 5/5 interactive simulator state transition flows passed cleanly.
- `npm run test:releases`: Semantic version ordering test passed.
- `npm run release:verify`: Validated with verified SHA-256 and GitHub assets.
- `npm run build`: Static SSG generated into `dist/` (8 pages).
- `npm run harness:status`: Offline health verified.

