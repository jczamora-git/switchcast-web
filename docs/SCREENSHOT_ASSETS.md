# SWITCHCAST — AUTHENTIC APPLICATION SCREENSHOT SPECIFICATION

**Document Version:** 2.0.0  
**Target Application:** SwitchCast for Windows v1.5.0  
**Storage Directory:** `public/screenshots/`  
**Configuration File:** `src/data/tutorial-assets.ts`  
**Purpose:** Guide and inventory for authentic, high-resolution screenshots of the real SwitchCast Windows desktop application used across the website tutorials and capabilities grid.

---

## 1. Principles & Hardware Constraints

1. **Authentic Assets Only**: Never use AI-generated UI mockups, third-party stock photos, or non-Windows chrome.
2. **Standard Theme**: Windows Fluent Dark mode (default) with standard DPI scaling.
3. **No External Hardware Requirement**: The user does not have an external monitor or projector. No physical external display screenshots are required or fabricated.
4. **Conceptual Diagrams for Hardware Features**: Multi-monitor and projector routing support is presented via an original conceptual SVG diagram (`/illustrations/external-display.svg`), never disguised as a fake hardware screenshot.
5. **Standby State Accuracy**: The Standby state is depicted accurately as an initialization state ready to stream, never misrepresented as an active live broadcast.
6. **Output Format**: Lossless WebP derivatives generated alongside source PNGs for fast page loads and crisp UI text.

---

## 2. Screenshot Inventory & Utilization

| Filename | WebP Derivative | Component Captured | Aspect Ratio & Resolution | Where Used on Website | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sources.png` | `sources.webp` (63.5 KB) | **Sources Manager**: Active applications catalog (Chrome, Visual Studio, Photoshop, Word) with interactive Queue checkboxes and category dropdown | 16:9 (1920 × 1032) | **Tutorial 01: Add and queue sources** | **ACTIVE** |
| `powerpoint.png` | `powerpoint.webp` (60.6 KB) | **Dedicated Presentation Output**: Clean 16:9 canvas rendering active keynote presentation slides with zero desktop clutter | 16:9 (1266 × 713) | **Tutorial 02: Open your presentation output** & **Tutorial 05** | **ACTIVE** |
| `presenter-dock.png` | `presenter-dock.webp` (12.2 KB) | **Floating Presenter Dock**: Always-on-top companion dock with `<` `>` chevrons, active source dropdown, switching mode selector (A+L), pause, blackout, and fullscreen | 21:2 (1248 × 88) | **Tutorial 03: Control from the Floating Presenter Dock** | **ACTIVE** |
| `presentation-output.png`| `presentation-output.webp` (68.3 KB) | **Multi-Component Composite**: Sources Manager + Floating Presenter Dock + Presentation Output window working together in unified session | 16:9 (1920 × 1032) | **Tutorial 04: Switch between sources** | **ACTIVE** |
| `dashboard.png` | `dashboard.webp` (32.3 KB) | **Main Dashboard**: Session overview, status indicators, queued sources list, and primary control bar | 16:9 (1920 × 1032) | **Product Overview & Documentation** | **ACTIVE** |
| `music-playlists.png` | `music-playlists.webp` (23.9 KB) | **Music & Playlists**: Dedicated walk-in background music manager with track list, scrub bar, and isolated volume slider | 16:9 (1920 × 1032) | **Capability 06: Background Music Isolation** | **ACTIVE** |

---

## 3. Web Performance & Optimization Pipeline

Each screenshot is processed with `sharp` into an optimized WebP derivative:
- **Quality**: 88 with effort level 4
- **Average Size Reduction**: ~95% bandwidth savings (from 1.25 MB to ~63 KB)
- **Container**: `picture` element with WebP `source` and PNG fallback
- **Scaling**: Strict `object-fit: contain` with preserved aspect ratios preventing distortion
- **Lightbox**: Click-to-enlarge modal allows pixel-level inspection of UI text on high-DPI displays
