import rawReleases from '../data/releases.json';

export interface ReleaseAsset {
  name: string;
  sizeBytes: number;
  sizeFormatted: string;
  downloadUrl: string;
  kind: 'binary' | 'checksum' | 'other';
}

export interface ReleasePackage {
  name: string;
  size: string;
  sizeBytes: number;
  downloadUrl: string;
  platform: string;
  architecture: string;
  type: string;
}

export interface ReleaseChecksum {
  available: boolean;
  filename: string | null;
  downloadUrl: string | null;
  sha256: string | null;
}

export interface Release {
  tag: string;
  version: string;
  name: string;
  publishedAt: string | null;
  releaseDate: string | null;
  isLatest: boolean;
  published: boolean;
  downloadable: boolean;
  prerelease: boolean;
  draft: boolean;
  status: string; // e.g. "Latest Release", "Previous Release", "Initial Release"
  summary: string;
  highlights?: string[];
  githubUrl: string | null;
  package: ReleasePackage | null;
  checksum: ReleaseChecksum | null;
  portablePackage?: ReleasePackage | null;
  portableChecksum?: ReleaseChecksum | null;
  assets: ReleaseAsset[];
  releaseNotes: string;
}

export const releases: Release[] = rawReleases as Release[];

/**
 * Compare two semantic version strings descending (e.g. "1.2.0" > "1.1.0" > "1.0.0").
 */
export function compareSemverDesc(vA: string, vB: string): number {
  const partsA = vA.replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
  const partsB = vB.replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const a = partsA[i] || 0;
    const b = partsB[i] || 0;
    if (a !== b) return b - a;
  }
  return 0;
}

export function getAllReleases(): Release[] {
  // Always return releases sorted semantically descending
  return [...releases].sort((a, b) => compareSemverDesc(a.version, b.version));
}

export function getLatestRelease(): Release {
  // Always select the newest semantic stable release that is published and downloadable
  const stableReleases = getAllReleases().filter(r => !r.draft && !r.prerelease && r.published && r.downloadable);
  if (stableReleases.length > 0) {
    return stableReleases[0]; // Guaranteed highest semver
  }
  return releases[0];
}

export function getPreviousReleases(): Release[] {
  const latest = getLatestRelease();
  return getAllReleases().filter(r => r.version !== latest.version);
}

export function getReleaseByVersion(versionOrTag: string): Release | undefined {
  const normalized = versionOrTag.replace(/^v/, '');
  return releases.find(r => r.version === normalized || r.tag === versionOrTag || r.tag === `v${normalized}`);
}
