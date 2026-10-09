import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function getHarnessStatus() {
  console.log('==================================================');
  console.log('SWITCHCAST WEBSITE — HARNESS STATUS');
  console.log('==================================================\n');

  // 1. Git branch & commit info
  let gitBranch = 'unknown';
  let gitStatus = 'clean';
  try {
    gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: rootDir, encoding: 'utf8' }).trim();
    const statusOutput = execSync('git status --porcelain', { cwd: rootDir, encoding: 'utf8' }).trim();
    gitStatus = statusOutput.length > 0 ? `${statusOutput.split('\n').length} modified/untracked files` : 'clean';
  } catch (e) {
    gitBranch = 'git-uninitialized';
  }

  console.log(`Repository Branch:     ${gitBranch}`);
  console.log(`Git Working Tree:      ${gitStatus}`);

  // 2. Release Manifests
  const releasesPath = path.join(rootDir, 'src/data/releases.json');
  const releasePath = path.join(rootDir, 'src/data/release.json');
  if (fs.existsSync(releasesPath)) {
    const allRel = JSON.parse(fs.readFileSync(releasesPath, 'utf8'));
    console.log(`Central Manifest:      src/data/releases.json (${allRel.length} published releases)`);
  }
  if (fs.existsSync(releasePath)) {
    const rel = JSON.parse(fs.readFileSync(releasePath, 'utf8'));
    console.log(`Latest Stable Release: v${rel.version} (${rel.releaseDate})`);
    console.log(`Package Target:        ${rel.filename} (${rel.packageSize})`);
    console.log(`SHA-256 Checksum:      ${rel.sha256}`);
  } else {
    console.log(`Release Version:       [MISSING src/data/release.json]`);
  }

  // 3. Harness Files Status
  const harnessFiles = [
    'AGENTS.md',
    'README.md',
    'docs/harness/AUDIT.md',
    'docs/harness/HANDOFF.md',
    'docs/harness/CHANGELOG.md'
  ];

  console.log('\nHarness Documents:');
  for (const relFile of harnessFiles) {
    const abs = path.join(rootDir, relFile);
    if (fs.existsSync(abs)) {
      const stats = fs.statSync(abs);
      console.log(`  ✓ ${relFile.padEnd(28)} (${stats.size} bytes)`);
    } else {
      console.log(`  ✗ ${relFile.padEnd(28)} [MISSING]`);
    }
  }

  // 4. Source Application Reference
  console.log('\nLocal Source Link:');
  console.log('  C:\\Users\\JC Zamora\\source\\repos\\SwitchCast\\SwitchCast\\ (READ-ONLY)');

  // 5. Verification Commands
  console.log('\nVerification Commands:');
  console.log('  npm run check          (Astro & TypeScript Diagnostics)');
  console.log('  npm run test:demo      (Interactive Demo State Transition Test Suite)');
  console.log('  npm run test:releases  (Semantic Version Ordering Regression Test)');
  console.log('  npm run release:verify (Manifest & Release Contract Check)');
  console.log('  npm run build          (Production Static SSG Build -> dist/)');
  console.log('  npm run harness:status (Offline Harness Health Summary)\n');
}

getHarnessStatus();
