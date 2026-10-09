import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compareSemverDesc } from './sync-release.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const releasesDataPath = path.resolve(__dirname, '../src/data/releases.json');
const singleReleaseDataPath = path.resolve(__dirname, '../src/data/release.json');

function testReleaseOrder() {
  console.log('==================================================');
  console.log('SWITCHCAST RELEASE ORDER — REGRESSION TEST');
  console.log('==================================================\n');

  // TEST A: Unit test semantic comparison vs timestamp anomaly
  console.log('TEST 1: Semantic version comparator sorts correctly despite publication order...');
  
  // Simulate releases where v1.1.0 was published AFTER v1.2.0
  const mockReleases = [
    { version: '1.1.0', publishedAt: '2026-10-09T19:43:36Z' }, // Later timestamp
    { version: '1.0.0', publishedAt: '2026-10-09T05:22:39Z' },
    { version: '1.2.0', publishedAt: '2026-10-09T16:17:06Z' }  // Earlier timestamp
  ];

  mockReleases.sort((a, b) => compareSemverDesc(a.version, b.version));

  assert.equal(mockReleases[0].version, '1.2.0', 'Highest semantic version must be first (v1.2.0)');
  assert.equal(mockReleases[1].version, '1.1.0', 'Middle semantic version must be second (v1.1.0)');
  assert.equal(mockReleases[2].version, '1.0.0', 'Lowest semantic version must be third (v1.0.0)');
  console.log('  ✓ Mock comparator correctly selected v1.2.0 > v1.1.0 > v1.0.0 despite timestamp ordering.\n');

  // TEST B: Actual manifest content verification
  console.log('TEST 2: Verifying active src/data/releases.json manifest...');
  const activeReleases = JSON.parse(fs.readFileSync(releasesDataPath, 'utf8'));

  assert.equal(activeReleases.length, 4, 'Expected exactly 4 releases in manifest');
  assert.equal(activeReleases[0].version, '1.2.1', 'First entry must be v1.2.1');
  assert.equal(activeReleases[0].isLatest, true, 'v1.2.1 must have isLatest: true');
  assert.equal(activeReleases[0].status, 'Latest Release', 'v1.2.1 status must be Latest Release');
  assert.equal(activeReleases[0].package.name, 'SwitchCast-v1.2.1-win-x64.zip');

  assert.equal(activeReleases[1].version, '1.2.0', 'Second entry must be v1.2.0');
  assert.equal(activeReleases[1].isLatest, false, 'v1.2.0 must have isLatest: false');
  assert.equal(activeReleases[1].status, 'Previous Release', 'v1.2.0 status must be Previous Release');
  assert.equal(activeReleases[1].package.name, 'SwitchCast-v1.2.0-win-x64.zip');

  assert.equal(activeReleases[2].version, '1.1.0', 'Third entry must be v1.1.0');
  assert.equal(activeReleases[2].isLatest, false, 'v1.1.0 must have isLatest: false');
  assert.equal(activeReleases[2].published, true, 'v1.1.0 must be published');
  assert.equal(activeReleases[2].downloadable, true, 'v1.1.0 must be downloadable');
  assert.equal(activeReleases[2].status, 'Previous Release', 'v1.1.0 status must be Previous Release');
  assert.ok(activeReleases[2].package?.downloadUrl, 'v1.1.0 must have a download URL');
  assert.equal(activeReleases[2].package.name, 'SwitchCast-v1.1.0-win-x64.zip');

  assert.equal(activeReleases[3].version, '1.0.0', 'Fourth entry must be v1.0.0');
  assert.equal(activeReleases[3].isLatest, false, 'v1.0.0 must have isLatest: false');
  assert.equal(activeReleases[3].published, true, 'v1.0.0 must be published');
  assert.equal(activeReleases[3].downloadable, true, 'v1.0.0 must be downloadable');
  assert.equal(activeReleases[3].status, 'Initial Release', 'v1.0.0 status must be Initial Release');
  console.log('  ✓ Manifest correctly structured with v1.2.1 as Latest, v1.2.0 & v1.1.0 as Previous, and v1.0.0 as Initial.\n');

  // TEST C: Single release manifest (release.json) must be v1.2.1
  console.log('TEST 3: Verifying active src/data/release.json manifest...');
  const latestManifest = JSON.parse(fs.readFileSync(singleReleaseDataPath, 'utf8'));
  assert.equal(latestManifest.version, '1.2.1', 'Single release manifest version must be 1.2.1');
  assert.equal(latestManifest.releaseTag, 'v1.2.1', 'Single release tag must be v1.2.1');
  assert.equal(latestManifest.filename, 'SwitchCast-v1.2.1-win-x64.zip');
  console.log('  ✓ Single release manifest strictly pinned to v1.2.1.\n');

  // TEST D: Verify brief changelogs are present
  console.log('TEST 4: Verifying brief changelog highlights...');
  for (const rel of activeReleases) {
    assert.ok(Array.isArray(rel.highlights), `Release ${rel.tag} must have highlights array`);
    assert.ok(rel.highlights.length >= 3 && rel.highlights.length <= 5, `Release ${rel.tag} highlights should have 3-5 items (found ${rel.highlights.length})`);
    console.log(`  ✓ ${rel.tag} has ${rel.highlights.length} concise highlights.`);
  }

  console.log('\n==================================================');
  console.log('SUCCESS: ALL RELEASE ORDER & METADATA TESTS PASSED');
  console.log('==================================================');
}

testReleaseOrder();
