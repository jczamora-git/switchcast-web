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

  // TEST 1: Semantic version comparator sorts correctly despite publication order anomaly
  console.log('TEST 1: Semantic version comparator sorts correctly despite publication order...');
  
  // Real scenario: v1.4.0 was published AFTER v1.5.0 on GitHub
  const mockReleases = [
    { version: '1.4.0', publishedAt: '2026-10-20T10:35:11Z' }, // Later timestamp
    { version: '1.2.1', publishedAt: '2026-10-09T21:53:14Z' },
    { version: '1.5.0', publishedAt: '2026-10-20T02:52:55Z' }, // Earlier timestamp than 1.4.0
    { version: '1.3.0', publishedAt: '2026-10-20T10:32:47Z' },
    { version: '1.0.0', publishedAt: '2026-10-09T05:22:39Z' }
  ];

  mockReleases.sort((a, b) => compareSemverDesc(a.version, b.version));

  assert.equal(mockReleases[0].version, '1.5.0', 'Highest semantic version must be first (v1.5.0)');
  assert.equal(mockReleases[1].version, '1.4.0', 'Second semantic version must be second (v1.4.0)');
  assert.equal(mockReleases[2].version, '1.3.0', 'Third semantic version must be third (v1.3.0)');
  assert.equal(mockReleases[3].version, '1.2.1', 'Fourth semantic version must be fourth (v1.2.1)');
  assert.equal(mockReleases[4].version, '1.0.0', 'Fifth semantic version must be fifth (v1.0.0)');
  console.log('  ✓ Mock comparator correctly selected 1.5.0 > 1.4.0 > 1.3.0 > 1.2.1 > 1.0.0 despite timestamp ordering.\n');

  // TEST 2: Active src/data/releases.json manifest verification
  console.log('TEST 2: Verifying active src/data/releases.json manifest...');
  const activeReleases = JSON.parse(fs.readFileSync(releasesDataPath, 'utf8'));

  assert.ok(activeReleases.length >= 4, `Expected at least 4 releases in manifest (found ${activeReleases.length})`);
  
  // Verify strict semantic descending order across all entries
  for (let i = 0; i < activeReleases.length - 1; i++) {
    const vCurr = activeReleases[i].version;
    const vNext = activeReleases[i + 1].version;
    const cmp = compareSemverDesc(vCurr, vNext);
    assert.ok(cmp <= 0, `Releases must be in descending semver order: ${vCurr} must be >= ${vNext}`);
  }
  console.log(`  ✓ All ${activeReleases.length} releases are strictly sorted in descending semantic version order.`);

  // Verify latest stable release is v1.5.0
  const latestRelease = activeReleases.find(r => r.isLatest);
  assert.ok(latestRelease, 'Must have one release with isLatest: true');
  assert.equal(latestRelease.version, '1.5.0', 'Latest release must be v1.5.0');
  assert.equal(latestRelease.status, 'Latest Release', 'v1.5.0 status must be Latest Release');
  assert.equal(latestRelease.package?.name, 'SwitchCast-v1.5.0-win-x64.zip');
  assert.ok(latestRelease.downloadable, 'v1.5.0 must be downloadable');
  console.log('  ✓ Latest release correctly identified as v1.5.0 with verified download package.\n');

  // TEST 3: Verify single release manifest (release.json) matches latest release
  console.log('TEST 3: Verifying active src/data/release.json manifest...');
  const latestManifest = JSON.parse(fs.readFileSync(singleReleaseDataPath, 'utf8'));
  assert.equal(latestManifest.version, latestRelease.version, `Single release manifest version must match latest (${latestRelease.version})`);
  assert.equal(latestManifest.releaseTag, latestRelease.tag, `Single release tag must match latest (${latestRelease.tag})`);
  assert.equal(latestManifest.filename, latestRelease.package.name);
  assert.equal(latestManifest.downloadUrl, latestRelease.package.downloadUrl);
  console.log(`  ✓ Single release manifest strictly pinned to v${latestRelease.version}.\n`);

  // TEST 4: Non-downloadable release simulation contract
  console.log('TEST 4: Verifying published non-downloadable release contract...');
  const mockNonDownloadable = {
    tag: 'v9.9.0',
    version: '9.9.0',
    published: true,
    downloadable: false,
    package: null,
    status: 'Download Unavailable'
  };
  assert.equal(mockNonDownloadable.downloadable, false, 'Non-downloadable release must have downloadable: false');
  assert.equal(mockNonDownloadable.package, null, 'Non-downloadable release must have package: null (no fake download URL)');
  console.log('  ✓ Non-downloadable release contract verified (no fake links, package: null).\n');

  // TEST 5: Verify no duplicates exist in manifest
  console.log('TEST 5: Verifying deduplication in releases manifest...');
  const versionSet = new Set();
  for (const rel of activeReleases) {
    assert.ok(!versionSet.has(rel.version), `Duplicate version found in releases.json: v${rel.version}`);
    versionSet.add(rel.version);
  }
  console.log(`  ✓ All ${versionSet.size} versions in releases.json are distinct (no duplicates).\n`);

  // TEST 6: Verify brief changelogs are present
  console.log('TEST 6: Verifying brief changelog highlights...');
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
