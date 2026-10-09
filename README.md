# SwitchCast Official Website

Official marketing website, feature showcase, and Windows application download portal for **SwitchCast** — Windows Screen Sharing & Presentation Management Software.

Developed by **John Christopher King Zamora** under **Jeizi Productions**.

---

## 🚀 Technology Stack

- **Framework**: [Astro](https://astro.build) (Static SSG)
- **Language**: TypeScript
- **Styles**: Vanilla CSS with custom Fluent/Dark design tokens
- **Scripts**: Minimal Vanilla JavaScript
- **Output**: Static `dist/` folder ready for CDN / edge hosting (e.g. Wasmer)

---

## 🛠️ Development & Commands

```bash
# Start local development server
npm run dev

# Run Astro TypeScript and lint checks
npm run check

# Verify release manifest contract
npm run release:verify

# Sync latest published release from GitHub
npm run release:sync

# Build static production bundle into dist/
npm run build

# Preview production build locally
npm run preview

# Print offline harness health status
npm run harness:status
```

---

## 📦 Release Integration

The website is static-first. Release metadata is tracked in `src/data/release.json` and statically injected into the HTML during build time.

- **Current Published Release**: `v1.2.0` (October 10, 2026)
- **Verified Package**: `SwitchCast-v1.2.0-win-x64.zip` (63.7 MB)
- **Verified SHA-256**: `BB8AD7EB346F6372E28FF6F5442072D5D4294F573AE175D73B83333C4C82790D`

---

## 📄 License & Attribution

© 2026 John Christopher King Zamora. All rights reserved.
Studio: [Jeizi Productions](https://jeiziproductions.com)
