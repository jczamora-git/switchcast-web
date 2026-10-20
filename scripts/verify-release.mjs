import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const releasesDataPath = path.resolve(__dirname, '../src/data/releases.json');
const singleReleaseDataPath = path.resolve(__dirname, '../src/data/release.json');

import { compareSemverDesc } from './sync-release.mjs';

function verifyRelease() {
  console.log('==================================================');
  console.log('SWITCHCAST WEBSITE — RELEASE MANIFEST VERIFICATION');
  console.log('==================================================\n');

  const errors = [];

  // 1. Verify src/data/releases.json
  if (!fs.existsSync(releasesDataPath)) {
    console.error('FAIL: src/data/releases.json does not exist.');
    process.exit(1);
  }

  let releasesList;
  try {
    releasesList = JSON.parse(fs.readFileSync(releasesDataPath, 'utf8'));
    if (!Array.isArray(releasesList) || releasesList.length === 0) {
      errors.push('src/data/releases.json must contain a non-empty array of releases.');
    }
  } catch (err) {
    console.error(`FAIL: Failed to parse releases.json: ${err.message}`);
    process.exit(1);
  }

  // Find expected latest release dynamically by semver ordering of stable downloadable releases
  const candidateLatest = [...releasesList]
    .filter(r => r.published && r.downloadable && !r.prerelease && !r.draft)
    .sort((a, b) => compareSemverDesc(a.version, b.version))[0];

  const latestReleases = releasesList.filter(r => r.isLatest);
  if (latestReleases.length !== 1) {
    errors.push(`Expected exactly 1 latest release, found ${latestReleases.length}.`);
  } else if (candidateLatest && latestReleases[0].version !== candidateLatest.version) {
    errors.push(`Expected latest release to be v${candidateLatest.version} by semantic versioning, found v${latestReleases[0].version}.`);
  }

  console.log(`Checking ${releasesList.length} release entries in src/data/releases.json:`);

  for (const rel of releasesList) {
    const prefix = `[${rel.tag || 'unknown'}]`;

    if (!rel.tag || !rel.version) {
      errors.push(`${prefix} Missing tag or version.`);
    }

    if (!rel.summary) {
      errors.push(`${prefix} Missing summary.`);
    }

    if (!rel.releaseNotes) {
      errors.push(`${prefix} Missing releaseNotes.`);
    }

    if (rel.highlights && !Array.isArray(rel.highlights)) {
      errors.push(`${prefix} Highlights must be an array of strings.`);
    }

    // Published downloadable releases contract
    if (rel.published && rel.downloadable) {
      if (!rel.releaseDate) {
        errors.push(`${prefix} Published release missing releaseDate.`);
      }

      if (!rel.package || typeof rel.package !== 'object') {
        errors.push(`${prefix} Published release missing package object.`);
        continue;
      }

      const { name, downloadUrl, size, platform, architecture } = rel.package;
      if (!name || (!name.endsWith('.exe') && !name.endsWith('.zip'))) {
        errors.push(`${prefix} Package name must end with .exe or .zip (got "${name}").`);
      }

      if (!downloadUrl || !downloadUrl.endsWith(name)) {
        errors.push(`${prefix} Package downloadUrl must end with package filename (got "${downloadUrl}").`);
      }

      if (!downloadUrl || !downloadUrl.startsWith('https://github.com/jczamora-git/SwitchCast/releases/download/')) {
        errors.push(`${prefix} Package downloadUrl must point to official GitHub Releases (got "${downloadUrl}").`);
      }

      if (!size) {
        errors.push(`${prefix} Missing package size.`);
      }

      if (!platform || !architecture) {
        errors.push(`${prefix} Missing platform or architecture specification.`);
      }

      // Checksum verification
      if (rel.checksum) {
        if (rel.checksum.available) {
          if (!rel.checksum.sha256 || rel.checksum.sha256.length !== 64) {
            errors.push(`${prefix} Checksum is marked available but sha256 is not 64 hex characters (got "${rel.checksum.sha256}").`);
          }
          if (rel.checksum.downloadUrl && !rel.checksum.downloadUrl.startsWith('https://github.com/jczamora-git/SwitchCast/releases/download/')) {
            errors.push(`${prefix} Checksum downloadUrl must point to official GitHub Releases if provided.`);
          }
          if (rel.checksum.filename) {
            const baseStem = name.replace(/\.(exe|zip)$/i, '');
            if (!rel.checksum.filename.includes(baseStem)) {
              errors.push(`${prefix} Checksum filename "${rel.checksum.filename}" does not match package stem "${baseStem}".`);
            }
          }
        } else {
          // Must be cleanly null or empty without broken link
          if (rel.checksum.downloadUrl || rel.checksum.sha256) {
            errors.push(`${prefix} Checksum is marked unavailable but has dangling URL or hash.`);
          }
        }
      } else {
        errors.push(`${prefix} Missing checksum specification object.`);
      }

      // Portable package verification (if present)
      if (rel.portablePackage) {
        const port = rel.portablePackage;
        if (!port.name || !port.name.endsWith('.zip')) {
          errors.push(`${prefix} Portable package name must end with .zip (got "${port.name}").`);
        }
        if (!port.downloadUrl || !port.downloadUrl.endsWith(port.name)) {
          errors.push(`${prefix} Portable package downloadUrl must end with portable filename.`);
        }
        if (rel.portableChecksum?.available) {
          if (!rel.portableChecksum.sha256 || rel.portableChecksum.sha256.length !== 64) {
            errors.push(`${prefix} Portable checksum sha256 must be 64 hex characters.`);
          }
        }
      }

      const checksumStatus = rel.checksum?.available
        ? `SHA-256 (${rel.checksum.sha256.slice(0, 10)}...${rel.checksum.downloadUrl ? ' with file' : ' digest only'})`
        : 'No checksum asset';
      const portableInfo = rel.portablePackage ? ` + Portable ZIP (${rel.portablePackage.size})` : '';
      console.log(`  ✓ ${rel.tag.padEnd(8)} | ${rel.releaseDate?.padEnd(18) || 'N/A'.padEnd(18)} | ${rel.package.size.padEnd(9)} | Published (${checksumStatus})${portableInfo}`);
    } else if (rel.published && !rel.downloadable) {
      // Published release without binary asset (e.g. historical release notes)
      if (rel.isLatest) {
        errors.push(`${prefix} Non-downloadable release must not be marked as latest release.`);
      }

      if (rel.package && rel.package.downloadUrl) {
        errors.push(`${prefix} Non-downloadable release must not have a downloadable package URL.`);
      }

      if (rel.checksum && rel.checksum.available) {
        errors.push(`${prefix} Non-downloadable release must not advertise available checksum.`);
      }

      console.log(`  ✓ ${rel.tag.padEnd(8)} | ${rel.releaseDate?.padEnd(18) || 'N/A'.padEnd(18)} | No binary | Published (Download Unavailable)`);
    } else {
      // Historical unpublished milestone contract
      if (rel.isLatest) {
        errors.push(`${prefix} Unpublished milestone must not be marked as latest release.`);
      }

      if (rel.downloadable) {
        errors.push(`${prefix} Unpublished milestone must have downloadable: false.`);
      }

      if (rel.package && rel.package.downloadUrl) {
        errors.push(`${prefix} Unpublished milestone must not have a downloadable package URL.`);
      }

      if (rel.checksum && rel.checksum.available) {
        errors.push(`${prefix} Unpublished milestone must not advertise available checksum.`);
      }

      console.log(`  ✓ ${rel.tag.padEnd(8)} | ${rel.releaseDate?.padEnd(18) || 'Milestone'.padEnd(18)} | No binary | Milestone (Unpublished)`);
    }
  }

  // 2. Verify src/data/release.json matches the latest published release (v1.2.0)
  if (!fs.existsSync(singleReleaseDataPath)) {
    errors.push('src/data/release.json does not exist.');
  } else {
    try {
      const singleData = JSON.parse(fs.readFileSync(singleReleaseDataPath, 'utf8'));
      const latest = latestReleases[0];
      if (latest) {
        if (singleData.version !== latest.version) {
          errors.push(`release.json version (${singleData.version}) does not match latest release in releases.json (${latest.version}).`);
        }
        if (singleData.downloadUrl !== latest.package?.downloadUrl) {
          errors.push('release.json downloadUrl does not match latest release in releases.json.');
        }
        if (latest.checksum?.available && singleData.sha256 !== latest.checksum.sha256) {
          errors.push('release.json sha256 does not match latest release in releases.json.');
        }
      }
    } catch (e) {
      errors.push(`Failed to parse release.json: ${e.message}`);
    }
  }

  if (errors.length > 0) {
    console.error('\nVerification failed with the following issues:');
    for (const err of errors) {
      console.error(` - ❌ ${err}`);
    }
    process.exit(1);
  }

  console.log('\nSUCCESS: Release manifests (releases.json and release.json) are valid and synchronized.\n');
}

verifyRelease();
