import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const releasesDataPath = path.resolve(__dirname, '../src/data/releases.json');
const singleReleaseDataPath = path.resolve(__dirname, '../src/data/release.json');

const REPO_OWNER = 'jczamora-git';
const REPO_NAME = 'SwitchCast';
const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases`;

// Official concise user-facing highlights for each version
const OFFICIAL_HIGHLIGHTS = {
  '1.2.1': [
    'Improved image and video source activation across different presentation switching modes.',
    'Enhanced Floating Presenter Dock with direct source removal and smoother window switching.',
    'Fixed Next/Previous navigation across applications, monitors, images, and videos.',
    'Updated Windows application branding and improved presentation button feedback.'
  ],
  '1.2.0': [
    'Added fullscreen presentation output controlled from the Presenter Dock.',
    'Improved video playback controls, seeking, and audio management.',
    'Refined Floating Presenter Dock interactions and window dragging.',
    'Fixed playback timeline stability issues.'
  ],
  '1.1.0': [
    'Added image and video files as presentation sources.',
    'Unified switching between apps, monitors, and media.',
    'Added video playback directly inside the presentation output.',
    'Introduced local audio playback and media controls.'
  ],
  '1.0.0': [
    'Initial Windows release of SwitchCast.',
    'Added application window and monitor capture.',
    'Introduced one stable presentation output window.',
    'Added source switching, floating presenter controls, and keyboard shortcuts.'
  ]
};

const OFFICIAL_SUMMARIES = {
  '1.2.1': 'Improved media source activation across switching modes, enhanced Floating Presenter Dock with direct source removal, fixed mixed-source queue navigation, and updated application branding.',
  '1.2.0': 'Fullscreen presentation output from the Presenter Dock, refined video playback and audio controls, improved dock dragging, and playback timeline stability fixes.',
  '1.1.0': 'Direct local image and video presentation sources, unified switching, native video playback inside presentation output, and local audio playback with media controls.',
  '1.0.0': 'Initial Windows release with hardware-accelerated window and monitor capture, dedicated presentation output window, floating presenter dock, and global keyboard shortcuts.'
};

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${bytes} B`;
}

// Compare semantic versions (e.g. "1.2.0" vs "1.1.0") descending
export function compareSemverDesc(vA, vB) {
  const partsA = vA.replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
  const partsB = vB.replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const a = partsA[i] || 0;
    const b = partsB[i] || 0;
    if (a !== b) return b - a;
  }
  return 0;
}

async function syncReleases() {
  console.log('==================================================');
  console.log('SWITCHCAST WEBSITE — RELEASE METADATA SYNC');
  console.log('==================================================\n');
  console.log(`[SwitchCast Sync] Requesting official releases from ${GITHUB_API_URL}...`);

  // 1. Read existing local releases manifest
  let existingReleases = [];
  if (fs.existsSync(releasesDataPath)) {
    try {
      existingReleases = JSON.parse(fs.readFileSync(releasesDataPath, 'utf8'));
      if (!Array.isArray(existingReleases)) existingReleases = [];
    } catch (e) {
      console.warn('[SwitchCast Sync] Warning: Could not parse existing releases.json:', e.message);
    }
  }

  // Key map by normalized version (e.g. "1.2.0", "1.1.0", "1.0.0")
  const existingMap = new Map();
  for (const rel of existingReleases) {
    const vKey = (rel.version || rel.tag || '').replace(/^v/, '');
    if (vKey) {
      existingMap.set(vKey, rel);
    }
  }

  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        'User-Agent': 'SwitchCast-Website-Sync-Script',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}: ${response.statusText}`);
    }

    const fetchedReleases = await response.json();
    if (!Array.isArray(fetchedReleases)) {
      throw new Error('GitHub API response is not an array.');
    }

    // 2. Filter out drafts from GitHub
    const validReleases = fetchedReleases.filter(r => !r.draft);

    // 3. Process GitHub releases
    const releasesByVersion = new Map();

    for (const r of validReleases) {
      const tag = r.tag_name;
      const version = tag.replace(/^v/, '');
      const existing = existingMap.get(version) || {};

      // Find Windows x64 zip asset
      const zipAsset = r.assets?.find(a => a.name.endsWith('.zip') && a.name.includes('win-x64'));
      if (!zipAsset) {
        console.warn(`[SwitchCast Sync] No Windows x64 ZIP found for release ${tag}. Skipping binary package.`);
        continue;
      }

      // Checksum resolution:
      // A) Separate .sha256 file asset if uploaded
      const shaAsset = r.assets?.find(a => a.name.endsWith('.sha256'));
      let sha256 = existing.checksum?.sha256 || null;
      let shaDownloadUrl = shaAsset ? shaAsset.browser_download_url : null;
      let shaFilename = shaAsset ? shaAsset.name : null;

      if (shaAsset && !sha256) {
        try {
          const shaResponse = await fetch(shaAsset.browser_download_url);
          if (shaResponse.ok) {
            const text = await shaResponse.text();
            const match = text.trim().split(/\s+/)[0];
            if (match && match.length === 64) {
              sha256 = match.toUpperCase();
            }
          }
        } catch (err) {
          console.warn(`[SwitchCast Sync] Could not fetch remote sha256 file for ${tag}:`, err.message);
        }
      }

      // B) API digest fallback if no separate .sha256 asset exists (e.g. v1.1.0)
      if (!sha256 && zipAsset.digest && typeof zipAsset.digest === 'string') {
        const cleanDigest = zipAsset.digest.replace(/^sha256:/i, '').trim();
        if (cleanDigest.length === 64) {
          sha256 = cleanDigest.toUpperCase();
        }
      }

      const releaseDateFormatted = new Date(r.published_at || r.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const packageSize = formatBytes(zipAsset.size);

      // Determine default status label (will be refined after semver sort)
      let status = 'Previous Release';
      if (r.prerelease) {
        status = 'Pre-release';
      } else if (version === '1.0.0') {
        status = 'Initial Release';
      }

      const highlights = OFFICIAL_HIGHLIGHTS[version] || existing.highlights || [];
      const summary = OFFICIAL_SUMMARIES[version] || existing.summary || `Official SwitchCast Windows release ${tag}.`;

      const assets = (r.assets || []).map(a => {
        let kind = 'other';
        if (a.name.endsWith('.zip')) kind = 'binary';
        else if (a.name.endsWith('.sha256')) kind = 'checksum';
        return {
          name: a.name,
          sizeBytes: a.size,
          sizeFormatted: formatBytes(a.size),
          downloadUrl: a.browser_download_url,
          kind
        };
      });

      const releaseRecord = {
        tag: `v${version}`,
        version,
        name: r.name && r.name.trim().length > 0 ? (r.name.startsWith('SwitchCast') ? r.name : `SwitchCast ${r.name}`) : `SwitchCast v${version}`,
        publishedAt: r.published_at || r.created_at,
        releaseDate: releaseDateFormatted,
        isLatest: false,
        published: true,
        downloadable: true,
        prerelease: Boolean(r.prerelease),
        draft: Boolean(r.draft),
        status,
        summary,
        highlights,
        githubUrl: r.html_url || `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/tag/v${version}`,
        package: {
          name: zipAsset.name,
          size: packageSize,
          sizeBytes: zipAsset.size,
          downloadUrl: zipAsset.browser_download_url,
          platform: 'Windows 10 (1809+) & Windows 11',
          architecture: 'x64 (64-bit)',
          type: 'Standalone ZIP (Self-Contained)'
        },
        checksum: {
          available: Boolean(sha256),
          filename: shaFilename,
          downloadUrl: shaDownloadUrl,
          sha256: sha256 || null
        },
        assets,
        releaseNotes: r.body || existing.releaseNotes || `# SwitchCast v${version}\n\nOfficial release for Windows.`
      };

      releasesByVersion.set(version, releaseRecord);
    }

    // 4. Combine all records into an array (deduplicated by version)
    const allReleases = Array.from(releasesByVersion.values());

    // 5. Sort descending by SEMANTIC VERSION (v1.2.0 > v1.1.0 > v1.0.0)
    allReleases.sort((a, b) => compareSemverDesc(a.version, b.version));

    // 6. Assign isLatest: true exclusively to the highest semantic stable release (v1.2.0)
    for (const rel of allReleases) {
      rel.isLatest = false;
    }
    const latestStable = allReleases.find(r => r.published && r.downloadable && !r.prerelease);
    if (latestStable) {
      latestStable.isLatest = true;
      latestStable.status = 'Latest Release';
    }

    // 7. Write centralized releases manifest (src/data/releases.json)
    fs.writeFileSync(releasesDataPath, JSON.stringify(allReleases, null, 2) + '\n', 'utf8');
    console.log(`[SwitchCast Sync] Successfully written ${allReleases.length} releases to src/data/releases.json:`);
    for (const rel of allReleases) {
      console.log(`  - v${rel.version} (${rel.status}) | Package: ${rel.package?.name} (${rel.package?.size})`);
    }

    // 8. Write synchronized latest release manifest (src/data/release.json)
    if (latestStable && latestStable.package) {
      const latestManifest = {
        version: latestStable.version,
        releaseTag: latestStable.tag,
        releaseDate: latestStable.releaseDate,
        filename: latestStable.package.name,
        downloadUrl: latestStable.package.downloadUrl,
        checksumUrl: latestStable.checksum?.downloadUrl || '',
        sha256: latestStable.checksum?.sha256 || '',
        releaseNotesUrl: latestStable.githubUrl || `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/tag/${latestStable.tag}`,
        allReleasesUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases`,
        sourceRepoUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}`,
        packageSize: latestStable.package.size,
        packageSizeBytes: latestStable.package.sizeBytes,
        platform: latestStable.package.platform,
        architecture: latestStable.package.architecture,
        packageType: latestStable.package.type,
        minWindowsVersion: 'Windows 10 Build 17763 (version 1809) or later / Windows 11',
        graphicsRequirement: 'Direct3D 11 compatible GPU or WARP software rasterizer',
        dotnetRequirement: 'Self-Contained .NET 8 (Zero runtime installations required)'
      };

      fs.writeFileSync(singleReleaseDataPath, JSON.stringify(latestManifest, null, 2) + '\n', 'utf8');
      console.log(`[SwitchCast Sync] Successfully synchronized latest release (v${latestStable.version}) in src/data/release.json.`);
    }

    console.log('\nSUCCESS: Release synchronization complete.\n');
  } catch (error) {
    console.error(`[SwitchCast Sync] Error during sync: ${error.message}`);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncReleases();
}
