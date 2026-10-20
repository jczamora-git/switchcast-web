// Central configuration for SwitchCast authentic application screenshots
// Predictable slots for the real Windows application captures in public/screenshots/

export interface ScreenshotSlot {
  id: string;
  title: string;
  category: 'core' | 'sources' | 'output' | 'controls' | 'media' | 'settings';
  description: string;
  filename: string;
  aspectRatio: string;
  recommendedResolution: string;
  whereCaptured: string;
  whereUsed: string;
  fallbackIllustration: string;
  isAvailable: boolean;
}

export const SCREENSHOT_SLOTS: Record<string, ScreenshotSlot> = {
  sources: {
    id: 'sources',
    title: 'Sources Library & Discovery',
    category: 'sources',
    description: 'The authentic SwitchCast Sources Manager window showing running applications (Chrome, Visual Studio, Photoshop, Word) with interactive Queue checkboxes.',
    filename: 'sources.webp',
    aspectRatio: '16:9',
    recommendedResolution: '1920 × 1032',
    whereCaptured: 'SwitchCast MainWindow > Sources tab',
    whereUsed: 'Tutorial 01: Add and queue sources',
    fallbackIllustration: '/illustrations/source-switching.svg',
    isAvailable: true
  },
  presentationOutput: {
    id: 'presentationOutput',
    title: 'Presentation Output Canvas',
    category: 'output',
    description: 'The clean, dedicated SwitchCast Presentation Output window displaying active presentations with zero desktop clutter.',
    filename: 'presentation-output.webp',
    aspectRatio: '16:9',
    recommendedResolution: '1920 × 1032',
    whereCaptured: 'SwitchCast Presentation Output window',
    whereUsed: 'Chapter 02: One window for your entire presentation',
    fallbackIllustration: '/illustrations/single-output.svg',
    isAvailable: true
  },
  presenterDock: {
    id: 'presenterDock',
    title: 'Floating Presenter Companion Dock',
    category: 'controls',
    description: 'The compact, always-on-top Floating Presenter Dock with source switching chevrons, active source dropdown, switching modes (A+L), pause, blackout, and fullscreen.',
    filename: 'presenter-dock.webp',
    aspectRatio: '21:2',
    recommendedResolution: '1248 × 88',
    whereCaptured: 'SwitchCast PresenterDockWindow floating over presentation workspace',
    whereUsed: 'Chapter 04: Everything within reach',
    fallbackIllustration: '/illustrations/presenter-dock.svg',
    isAvailable: true
  },
  powerpoint: {
    id: 'powerpoint',
    title: 'PowerPoint & Media Slides Presentation',
    category: 'media',
    description: 'SwitchCast dedicated presentation engine displaying slides and media with presentation controls.',
    filename: 'powerpoint.webp',
    aspectRatio: '16:9',
    recommendedResolution: '1266 × 713',
    whereCaptured: 'SwitchCast presentation mode showing PowerPoint slide',
    whereUsed: 'Chapter 05: Bring your slides and media together',
    fallbackIllustration: '/illustrations/media-presentation.svg',
    isAvailable: true
  },
  dashboard: {
    id: 'dashboard',
    title: 'Main Dashboard & Source Switching',
    category: 'core',
    description: 'SwitchCast Dashboard showing session status, queued presentation sources, and instant switching controls.',
    filename: 'dashboard.webp',
    aspectRatio: '16:9',
    recommendedResolution: '1920 × 1032',
    whereCaptured: 'SwitchCast MainWindow > Dashboard tab',
    whereUsed: 'Chapter 03: Move between sources without interrupting your audience',
    fallbackIllustration: '/illustrations/presentation-workflow.svg',
    isAvailable: true
  },
  musicPlaylists: {
    id: 'musicPlaylists',
    title: 'Background Music & Playlists',
    category: 'media',
    description: 'Isolated background audio player in SwitchCast showing track queue, walk-in music status, and independent volume slider.',
    filename: 'music-playlists.webp',
    aspectRatio: '16:9',
    recommendedResolution: '1920 × 1032',
    whereCaptured: 'SwitchCast MainWindow > Playlists tab showing walk-in tracks',
    whereUsed: 'Chapter 06: Set the mood with background music',
    fallbackIllustration: '/illustrations/audio-isolation.svg',
    isAvailable: true
  },
  displays: {
    id: 'displays',
    title: 'External Displays & Projector Support',
    category: 'output',
    description: 'Original conceptual diagram illustrating multi-monitor and projector routing support (no external hardware required).',
    filename: 'external-display.svg',
    aspectRatio: '16:10',
    recommendedResolution: '800 × 500',
    whereCaptured: 'Conceptual architecture illustration',
    whereUsed: 'Capability 02: External Displays & Projectors',
    fallbackIllustration: '/illustrations/external-display.svg',
    isAvailable: false
  }
};

export function getScreenshot(id: keyof typeof SCREENSHOT_SLOTS): ScreenshotSlot {
  return SCREENSHOT_SLOTS[id] || SCREENSHOT_SLOTS.sources;
}
