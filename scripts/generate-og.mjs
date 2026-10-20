import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT_FILE = path.join(rootDir, 'public', 'og-switchcast.png');
const OUTPUT_FILE_V2 = path.join(rootDir, 'public', 'og-switchcast-v2.png');
const LOGO_SVG_PATH = path.join(rootDir, 'public', 'assets', 'switchcast-logo.svg');

async function generateOgImage() {
  console.log(`Generating official 1200x630 Open Graph preview image...`);

  // Read the official vector logo
  const logoSvg = fs.readFileSync(LOGO_SVG_PATH, 'utf-8');
  // Create a 72x72 version of the logo for the badge
  const logoBuffer = await sharp(Buffer.from(logoSvg))
    .resize(68, 68)
    .png()
    .toBuffer();

  const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;

  // Construct SVG template with high-DPI crisp vector definitions
  const svgTemplate = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0b0e" />
      <stop offset="50%" stop-color="#07080a" />
      <stop offset="100%" stop-color="#050507" />
    </linearGradient>

    <!-- Coral / Orange Accent Gradient -->
    <linearGradient id="coralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff7a59" />
      <stop offset="50%" stop-color="#ff5722" />
      <stop offset="100%" stop-color="#e64a19" />
    </linearGradient>

    <!-- Text Highlight Gradient -->
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#e0e3ea" />
    </linearGradient>

    <!-- Accent Text Gradient -->
    <linearGradient id="accentTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff8a65" />
      <stop offset="100%" stop-color="#ff5722" />
    </linearGradient>

    <!-- Card Background Gradient -->
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(26, 29, 36, 0.75)" />
      <stop offset="100%" stop-color="rgba(14, 16, 21, 0.90)" />
    </linearGradient>

    <!-- Ambient Glow Filter -->
    <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="70" result="blur" />
    </filter>

    <!-- Soft Drop Shadow -->
    <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.65" />
    </filter>
  </defs>

  <!-- Deep Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)" />

  <!-- Background Ambient Glows -->
  <circle cx="150" cy="120" r="240" fill="#ff5722" opacity="0.12" filter="url(#glowFilter)" />
  <circle cx="950" cy="320" r="300" fill="#ff7a59" opacity="0.10" filter="url(#glowFilter)" />
  <circle cx="1150" cy="100" r="180" fill="#2979ff" opacity="0.06" filter="url(#glowFilter)" />

  <!-- Subtle Blueprint Tech Grid -->
  <g opacity="0.18">
    ${Array.from({ length: 30 }, (_, i) => `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="${HEIGHT}" stroke="#ffffff" stroke-width="0.75" stroke-dasharray="2,6" />`).join('')}
    ${Array.from({ length: 16 }, (_, i) => `<line x1="0" y1="${i * 40}" x2="${WIDTH}" y2="${i * 40}" stroke="#ffffff" stroke-width="0.75" stroke-dasharray="2,6" />`).join('')}
  </g>

  <!-- Outer Frame Border -->
  <rect x="20" y="20" width="${WIDTH - 40}" height="${HEIGHT - 40}" rx="20" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1.5" />

  <!-- ================= LEFT COLUMN: HERO INFORMATION ================= -->

  <!-- Top Category Pill / Label -->
  <g transform="translate(80, 75)">
    <rect x="0" y="0" width="370" height="34" rx="17" fill="rgba(255, 87, 34, 0.12)" stroke="rgba(255, 87, 34, 0.35)" stroke-width="1.2" />
    <circle cx="18" cy="17" r="4" fill="#ff5722" />
    <text x="32" y="22" fill="#ff8a65" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5">
      SCREEN SHARING &amp; PRESENTATION SOFTWARE
    </text>
  </g>

  <!-- Logo and Brand Name Row -->
  <g transform="translate(80, 135)">
    <!-- App Logo Icon Badge -->
    <rect x="0" y="0" width="76" height="76" rx="18" fill="url(#cardGrad)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.5" filter="url(#shadowFilter)" />
    <image href="${logoBase64}" x="4" y="4" width="68" height="68" />

    <!-- Brand Name -->
    <text x="96" y="54" fill="url(#textGrad)" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="48" font-weight="900" letter-spacing="1">
      SWITCHCAST
    </text>
  </g>

  <!-- Primary Value Headline -->
  <g transform="translate(80, 275)">
    <text x="0" y="0" fill="#ffffff" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="48" font-weight="900" letter-spacing="-0.5" line-height="1.1">
      SHARE ONCE.
    </text>
    <text x="0" y="56" fill="url(#accentTextGrad)" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="48" font-weight="900" letter-spacing="-0.5">
      SWITCH SEAMLESSLY.
    </text>
  </g>

  <!-- Clean Subtitle / Product Mission -->
  <g transform="translate(80, 395)">
    <text x="0" y="0" fill="#9ca3af" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="19" font-weight="500">
      Present different apps, screens, images, and videos
    </text>
    <text x="0" y="28" fill="#9ca3af" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="19" font-weight="500">
      through one constant presentation window.
    </text>
  </g>

  <!-- Bottom Badges / Platform Specifications -->
  <g transform="translate(80, 485)">
    <!-- Windows Platform Pill -->
    <g>
      <rect x="0" y="0" width="168" height="42" rx="10" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.14)" stroke-width="1.2" />
      <!-- Windows 4-Square Icon -->
      <g transform="translate(18, 14)">
        <rect x="0" y="0" width="6" height="6" fill="#00a4ef" />
        <rect x="8" y="0" width="6" height="6" fill="#00a4ef" />
        <rect x="0" y="8" width="6" height="6" fill="#00a4ef" />
        <rect x="8" y="8" width="6" height="6" fill="#00a4ef" />
      </g>
      <text x="40" y="26" fill="#ffffff" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="13" font-weight="700" letter-spacing="1">
        FOR WINDOWS
      </text>
    </g>

    <!-- Version & Standalone Pill -->
    <g transform="translate(182, 0)">
      <rect x="0" y="0" width="154" height="42" rx="10" fill="rgba(255, 87, 34, 0.08)" stroke="rgba(255, 87, 34, 0.25)" stroke-width="1.2" />
      <text x="18" y="26" fill="#ff8a65" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="13" font-weight="700">
        Free • Standalone
      </text>
    </g>

    <!-- Free / Zero Setup Pill -->
    <g transform="translate(350, 0)">
      <rect x="0" y="0" width="150" height="42" rx="10" fill="rgba(16, 185, 129, 0.08)" stroke="rgba(16, 185, 129, 0.25)" stroke-width="1.2" />
      <circle cx="20" cy="21" r="4" fill="#10b981" />
      <text x="32" y="26" fill="#34d399" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="13" font-weight="700">
        No Install Needed
      </text>
    </g>
  </g>

  <!-- ================= RIGHT COLUMN: AUTHENTIC PRODUCT MOCKUP ================= -->

  <g transform="translate(680, 85)" filter="url(#shadowFilter)">
    <!-- Main Presentation Window Outer Shell -->
    <rect x="0" y="0" width="440" height="295" rx="14" fill="#12141a" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5" />

    <!-- Window Titlebar -->
    <path d="M 0 14 Q 0 0 14 0 L 426 0 Q 440 0 440 14 L 440 38 L 0 38 Z" fill="#191c24" />
    <circle cx="22" cy="19" r="5" fill="#ef4444" opacity="0.8" />
    <circle cx="38" cy="19" r="5" fill="#f59e0b" opacity="0.8" />
    <circle cx="54" cy="19" r="5" fill="#10b981" opacity="0.8" />
    <text x="80" y="24" fill="#9ca3af" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="12" font-weight="600">
      SwitchCast Presentation Window — [Live]
    </text>

    <!-- Broadcast Status Pill inside Window -->
    <g transform="translate(325, 9)">
      <rect x="0" y="0" width="100" height="20" rx="10" fill="rgba(239, 68, 68, 0.18)" stroke="rgba(239, 68, 68, 0.4)" stroke-width="1" />
      <circle cx="12" cy="10" r="3.5" fill="#ef4444" />
      <text x="22" y="14" fill="#fca5a5" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="10" font-weight="800" letter-spacing="0.5">
        SHARING
      </text>
    </g>

    <!-- Canvas Inner Display Area -->
    <rect x="14" y="50" width="412" height="230" rx="8" fill="#090a0d" stroke="rgba(255, 255, 255, 0.06)" stroke-width="1" />

    <!-- Graphic inside Presentation Window (Active App Simulation) -->
    <g transform="translate(26, 62)">
      <!-- App Header Mockup -->
      <rect x="0" y="0" width="388" height="24" rx="4" fill="rgba(255, 255, 255, 0.05)" />
      <rect x="12" y="8" width="80" height="8" rx="4" fill="#ff5722" opacity="0.7" />
      <rect x="104" y="8" width="50" height="8" rx="4" fill="#6b7280" opacity="0.4" />
      <rect x="162" y="8" width="60" height="8" rx="4" fill="#6b7280" opacity="0.4" />

      <!-- App Chart / Visual Mockup -->
      <g transform="translate(0, 34)">
        <rect x="0" y="0" width="250" height="150" rx="6" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />
        <!-- Mockup Metrics Bars -->
        <rect x="20" y="110" width="28" height="26" rx="3" fill="#ff7a59" opacity="0.75" />
        <rect x="60" y="85" width="28" height="51" rx="3" fill="#ff5722" opacity="0.85" />
        <rect x="100" y="60" width="28" height="76" rx="3" fill="#ff7a59" opacity="0.75" />
        <rect x="140" y="40" width="28" height="96" rx="3" fill="#ff5722" />
        <rect x="180" y="25" width="28" height="111" rx="3" fill="#ff8a65" />

        <line x1="14" y1="136" x2="236" y2="136" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" />
      </g>

      <!-- Side Metrics Box -->
      <g transform="translate(262, 34)">
        <rect x="0" y="0" width="126" height="70" rx="6" fill="rgba(255, 87, 34, 0.08)" stroke="rgba(255, 87, 34, 0.25)" stroke-width="1" />
        <text x="12" y="24" fill="#9ca3af" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="10" font-weight="600">SEAMLESS FPS</text>
        <text x="12" y="52" fill="#ffffff" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="24" font-weight="900">60 FPS</text>

        <rect x="0" y="80" width="126" height="70" rx="6" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
        <text x="12" y="104" fill="#9ca3af" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="10" font-weight="600">LATENCY</text>
        <text x="12" y="132" fill="#34d399" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="24" font-weight="900">&lt; 15ms</text>
      </g>
    </g>

    <!-- Seamless Switch Indicator Pulse -->
    <g transform="translate(145, 120)">
      <circle cx="75" cy="50" r="46" fill="#ff5722" opacity="0.12" filter="url(#glowFilter)" />
      <rect x="0" y="28" width="150" height="38" rx="19" fill="#1e222d" stroke="#ff5722" stroke-width="1.8" filter="url(#shadowFilter)" />
      <text x="75" y="52" text-anchor="middle" fill="#ffffff" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="12" font-weight="800" letter-spacing="1">
        LIVE CAPTURE
      </text>
    </g>

    <!-- ================= FLOATING PRESENTER DOCK ================= -->
    <g transform="translate(10, 312)" filter="url(#shadowFilter)">
      <!-- Dock Base Container -->
      <rect x="0" y="0" width="420" height="92" rx="14" fill="#161821" stroke="rgba(255, 255, 255, 0.16)" stroke-width="1.5" />

      <!-- Dock Header Label -->
      <g transform="translate(16, 12)">
        <text x="0" y="10" fill="#ff8a65" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="10" font-weight="800" letter-spacing="1.2">
          PRESENTER CONTROL DOCK
        </text>
        <text x="325" y="10" fill="#9ca3af" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="10" font-weight="600">
          Source Switcher
        </text>
      </g>

      <!-- Dock Items Grid (Apps, Displays, Images, Videos) -->
      <g transform="translate(12, 30)">
        <!-- Item 1: Applications (Active) -->
        <g>
          <rect x="0" y="0" width="94" height="48" rx="8" fill="rgba(255, 87, 34, 0.18)" stroke="#ff5722" stroke-width="1.6" />
          <text x="47" y="24" text-anchor="middle" fill="#ffffff" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="12" font-weight="700">App</text>
          <text x="47" y="38" text-anchor="middle" fill="#ff8a65" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="9" font-weight="700">Active</text>
        </g>

        <!-- Item 2: Screens / Displays -->
        <g transform="translate(100, 0)">
          <rect x="0" y="0" width="94" height="48" rx="8" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
          <text x="47" y="24" text-anchor="middle" fill="#d1d5db" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="12" font-weight="600">Monitor</text>
          <text x="47" y="38" text-anchor="middle" fill="#6b7280" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="9" font-weight="500">Ready</text>
        </g>

        <!-- Item 3: Media Images -->
        <g transform="translate(200, 0)">
          <rect x="0" y="0" width="94" height="48" rx="8" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
          <text x="47" y="24" text-anchor="middle" fill="#d1d5db" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="12" font-weight="600">Image</text>
          <text x="47" y="38" text-anchor="middle" fill="#6b7280" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="9" font-weight="500">Queued</text>
        </g>

        <!-- Item 4: Media Videos -->
        <g transform="translate(300, 0)">
          <rect x="0" y="0" width="94" height="48" rx="8" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
          <text x="47" y="24" text-anchor="middle" fill="#d1d5db" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="12" font-weight="600">Video</text>
          <text x="47" y="38" text-anchor="middle" fill="#6b7280" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="9" font-weight="500">Ready</text>
        </g>
      </g>
    </g>
  </g>

  <!-- Bottom Copyright / Domain Notice -->
  <g transform="translate(80, 570)">
    <text x="0" y="0" fill="#6b7280" font-family="'Segoe UI', -apple-system, system-ui, Roboto, sans-serif" font-size="14" font-weight="500">
      https://switchcast.wasmer.app • Developed by John Christopher King Zamora
    </text>
  </g>
</svg>
`;

  // Render SVG to 1200x630 PNG via sharp
  const imageBuffer = await sharp(Buffer.from(svgTemplate))
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      quality: 100
    })
    .toBuffer();

  fs.writeFileSync(OUTPUT_FILE, imageBuffer);
  fs.writeFileSync(OUTPUT_FILE_V2, imageBuffer);

  const outputInfo = await sharp(imageBuffer).metadata();

  console.log(`✓ Successfully generated ${OUTPUT_FILE} and ${OUTPUT_FILE_V2}`);
  console.log(`  Dimensions: ${outputInfo.width}x${outputInfo.height} px`);
  console.log(`  File size:  ${(imageBuffer.length / 1024).toFixed(1)} KB (previously ~1443 KB)`);

  return { ...outputInfo, size: imageBuffer.length };
}

generateOgImage().catch(err => {
  console.error('Failed to generate Open Graph image:', err);
  process.exit(1);
});
