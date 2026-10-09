import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const releaseDataPath = path.resolve(__dirname, '../src/data/release.json');

function verifyRelease() {
  console.log('==================================================');
  console.log('SWITCHCAST WEBSITE — RELEASE MANIFEST VERIFICATION');
  console.log('==================================================\n');

  if (!fs.existsSync(releaseDataPath)) {
    console.error('FAIL: src/data/release.json does not exist.');
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(releaseDataPath, 'utf8'));
  } catch (err) {
    console.error(`FAIL: Failed to parse release.json: ${err.message}`);
    process.exit(1);
  }

  const errors = [];
  const requiredFields = [
    'version',
    'releaseTag',
    'releaseDate',
    'filename',
    'downloadUrl',
    'checksumUrl',
    'sha256',
    'releaseNotesUrl',
    'allReleasesUrl',
    'packageSize',
    'platform',
    'architecture',
    'packageType'
  ];

  for (const field of requiredFields) {
    if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
      errors.push(`Missing or invalid required field: "${field}"`);
    }
  }

  if (data.sha256 && data.sha256.length !== 64) {
    errors.push(`SHA-256 checksum must be a 64-character hex string (got ${data.sha256.length} chars).`);
  }

  if (data.downloadUrl && !data.downloadUrl.startsWith('https://github.com/jczamora-git/SwitchCast/releases/')) {
    errors.push(`Download URL must point to official GitHub Releases (got "${data.downloadUrl}").`);
  }

  if (data.filename && !data.filename.endsWith('.zip')) {
    errors.push(`Package filename must be a .zip archive (got "${data.filename}").`);
  }

  if (errors.length > 0) {
    console.error('Verification failed with the following issues:');
    for (const err of errors) {
      console.error(` - ❌ ${err}`);
    }
    process.exit(1);
  }

  console.log('✅ Version:            ' + data.version);
  console.log('✅ Release Tag:        ' + data.releaseTag);
  console.log('✅ Release Date:       ' + data.releaseDate);
  console.log('✅ Package Filename:   ' + data.filename);
  console.log('✅ Package Size:       ' + data.packageSize);
  console.log('✅ Platform:           ' + data.platform + ' [' + data.architecture + ']');
  console.log('✅ Package Type:       ' + data.packageType);
  console.log('✅ SHA-256 Hash:       ' + data.sha256);
  console.log('✅ Download URL:       ' + data.downloadUrl);
  console.log('✅ Checksum URL:       ' + data.checksumUrl);
  console.log('✅ Release Notes URL:  ' + data.releaseNotesUrl);
  console.log('\nSUCCESS: Release manifest is valid and release-ready.\n');
}

verifyRelease();
