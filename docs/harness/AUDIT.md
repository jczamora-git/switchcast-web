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

- **Manifest File**: `src/data/release.json` (Static source of truth).
- **Verified Version**: `v1.2.0` (Published October 10, 2026).
- **Verified Download URL**: `https://github.com/jczamora-git/SwitchCast/releases/download/v1.2.0/SwitchCast-v1.2.0-win-x64.zip`
- **Verified SHA-256 Checksum**: `BB8AD7EB346F6372E28FF6F5442072D5D4294F573AE175D73B83333C4C82790D`
- **Sync Script**: `scripts/sync-release.mjs` (fetches newest release, ignores drafts/prereleases, updates manifest).
- **Validation Script**: `scripts/verify-release.mjs` (verifies required fields, checksum length, and GitHub asset URLs).

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

- **Title**: `SwitchCast — Windows Screen Sharing & Presentation Management Software`
- **Canonical Domain**: `https://switchcast.jeiziproductions.com`
- **OpenGraph & Twitter Cards**: Integrated in `BaseLayout.astro`.
- **Structured Data**: `SoftwareApplication` JSON-LD schema with author, price ($0), OS requirements, and download links.
- **Search Directives**: `public/robots.txt`.

---

## 7. Verification Results

- `npm run check`: Validated with zero diagnostic errors.
- `npm run release:verify`: Validated with verified SHA-256 and GitHub assets.
- `npm run build`: Static SSG generated into `dist/`.
