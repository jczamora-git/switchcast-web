# SWITCHCAST OFFICIAL WEBSITE — AGENT HARNESS INSTRUCTIONS

## 1. Purpose & Identity
This codebase is the standalone official website and Windows application download portal for **SwitchCast**, a high-performance Windows screen sharing and presentation management tool created by **John Christopher King Zamora** under **Jeizi Productions**.

---

## 2. Core Operational Rules

### Rule 1: Read-Only Application Source
- **Local Application Path**: `C:\Users\JC Zamora\source\repos\SwitchCast\SwitchCast\`
- **Access Level**: **STRICTLY READ-ONLY**. Never modify, delete, or commit files in the desktop app repository.
- Use the local desktop application repository only to verify features, architectural contracts, and release metadata.

### Rule 2: GitHub API Discipline
- **Public URL**: `https://github.com/jczamora-git/SwitchCast/releases`
- **Permitted Access**: Query GitHub Releases strictly to verify binary assets (`.zip`), checksums (`.sha256`), and release tags.
- Do not use GitHub to search or read application source code.
- Do not embed access tokens or credentials in frontend code.

### Rule 3: Technology Constraints
- **Stack**: Astro (Static Output), TypeScript, Vanilla CSS, Minimal Vanilla JS.
- **Strictly Prohibited**: React, Next.js, Vue, Svelte, Tailwind CSS, Bootstrap, GSAP, Framer Motion.
- Build output target: `dist/`.

---

## 3. Agent Execution Workflow

When tasked with maintaining or updating this website:

1. **Read Status & Handoff**:
   - Inspect [docs/harness/HANDOFF.md](file:///c:/Users/JC%20Zamora/Documents/Jeizi_Programming_Apps/switchcast-web/docs/harness/HANDOFF.md)
   - Run `npm run harness:status`
2. **Inspect Relevant Code Only**:
   - Check only files directly related to the user request.
   - Do not perform full repository rescans.
3. **Implement Changes**:
   - Make targeted, backward-compatible edits.
4. **Execute Verification Sequentially**:
   - `npm run check` (Astro typecheck & diagnostics)
   - `npm run release:verify` (Release manifest contract validation)
   - `npm run build` (Static generation build)
5. **Update Documentation**:
   - Update [docs/harness/CHANGELOG.md](file:///c:/Users/JC%20Zamora/Documents/Jeizi_Programming_Apps/switchcast-web/docs/harness/CHANGELOG.md)
   - Update [docs/harness/HANDOFF.md](file:///c:/Users/JC%20Zamora/Documents/Jeizi_Programming_Apps/switchcast-web/docs/harness/HANDOFF.md)

---

## 4. Verification Commands

```bash
# Diagnostic & Types Check
npm run check

# Release Manifest Verification
npm run release:verify

# Static Build
npm run build

# Offline Harness Health Status
npm run harness:status
```
