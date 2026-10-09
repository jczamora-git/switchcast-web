import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const releaseDataPath = path.resolve(__dirname, '../src/data/release.json');

const REPO_OWNER = 'jczamora-git';
const REPO_NAME = 'SwitchCast';
const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`;

async function syncRelease() {
  console.log(`[SwitchCast Sync] Fetching latest release from ${GITHUB_API_URL}...`);
  
  let existingData = {};
  if (fs.existsSync(releaseDataPath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(releaseDataPath, 'utf8'));
    } catch (e) {
      console.warn('[SwitchCast Sync] Failed to parse existing release.json:', e.message);
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

    const release = await response.json();

    if (release.draft || release.prerelease) {
      console.warn('[SwitchCast Sync] Latest release is marked as draft or prerelease. Retaining existing manifest.');
      return;
    }

    const zipAsset = release.assets?.find(a => a.name.endsWith('.zip') && a.name.includes('win-x64'));
    const shaAsset = release.assets?.find(a => a.name.endsWith('.sha256'));

    if (!zipAsset) {
      throw new Error('No Windows x64 ZIP asset found in latest GitHub release.');
    }

    let sha256 = existingData.sha256 || '';
    if (shaAsset) {
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
        console.warn('[SwitchCast Sync] Could not fetch remote sha256 asset content:', err.message);
      }
    }

    const version = release.tag_name.replace(/^v/, '');
    const releaseDateFormatted = new Date(release.published_at || release.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const sizeMb = (zipAsset.size / (1024 * 1024)).toFixed(1) + ' MB';

    const updatedData = {
      version,
      releaseTag: release.tag_name,
      releaseDate: releaseDateFormatted,
      filename: zipAsset.name,
      downloadUrl: zipAsset.browser_download_url,
      checksumUrl: shaAsset ? shaAsset.browser_download_url : existingData.checksumUrl || '',
      sha256: sha256 || existingData.sha256,
      releaseNotesUrl: release.html_url,
      allReleasesUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases`,
      sourceRepoUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}`,
      packageSize: sizeMb,
      packageSizeBytes: zipAsset.size,
      platform: 'Windows 10 (1809+) & Windows 11',
      architecture: 'x64 (64-bit)',
      packageType: 'Standalone ZIP (Self-Contained)',
      minWindowsVersion: 'Windows 10 Build 17763 (version 1809) or later / Windows 11',
      graphicsRequirement: 'Direct3D 11 compatible GPU or WARP software rasterizer',
      dotnetRequirement: 'Self-Contained .NET 8 (Zero runtime installations required)'
    };

    fs.writeFileSync(releaseDataPath, JSON.stringify(updatedData, null, 2) + '\n', 'utf8');
    console.log(`[SwitchCast Sync] Successfully synced release manifest for v${version} (${sizeMb}).`);
  } catch (error) {
    console.warn(`[SwitchCast Sync] Warning: Unable to sync with GitHub API (${error.message}). Retaining local manifest.`);
  }
}

syncRelease();
