import type { DemoSource, DemoState, ExplanationItem } from './demo-types';

export const INITIAL_DEMO_SOURCES: DemoSource[] = [
  {
    id: 'src-browser',
    name: 'Web Browser — Chrome',
    category: 'windows',
    subtitle: 'chrome.exe • SwitchCast Documentation & Release Notes',
    glyph: '🌐',
    previewType: 'browser',
    isQueued: false,
    metadata: {
      processName: 'chrome.exe',
      resolution: '1920 × 1080'
    }
  },
  {
    id: 'src-slides',
    name: 'PowerPoint Slide Deck — Strategy',
    category: 'windows',
    subtitle: 'powerpnt.exe • Q4 Product Strategy & Roadmap Deck',
    glyph: '📊',
    previewType: 'slides',
    isQueued: false,
    metadata: {
      processName: 'powerpnt.exe',
      resolution: '1920 × 1080'
    }
  },
  {
    id: 'src-slideshow',
    name: 'Live PowerPoint Slideshow',
    category: 'windows',
    subtitle: 'powerpnt.exe • Windowed Slideshow Mode',
    glyph: '📽️',
    previewType: 'slideshow',
    isQueued: false,
    metadata: {
      processName: 'powerpnt.exe',
      resolution: '1920 × 1080'
    }
  },
  {
    id: 'src-editor',
    name: 'Code Editor — VS Code',
    category: 'windows',
    subtitle: 'code.exe • SwitchCastEngine.cs',
    glyph: '💻',
    previewType: 'code',
    isQueued: false,
    metadata: {
      processName: 'Code.exe',
      resolution: '1920 × 1080'
    }
  },
  {
    id: 'src-disp-1',
    name: 'Display 1 — Primary Monitor',
    category: 'displays',
    subtitle: '1920 × 1080 @ 144Hz • Intel Iris Graphics',
    glyph: '🖥️',
    previewType: 'display',
    isQueued: false,
    metadata: {
      resolution: '1920 × 1080'
    }
  },
  {
    id: 'src-disp-2',
    name: 'Display 2 — Conference Projector',
    category: 'displays',
    subtitle: '2560 × 1440 @ 60Hz • HDMI External Screen',
    glyph: '🖥️',
    previewType: 'display',
    isQueued: false,
    metadata: {
      resolution: '2560 × 1440'
    }
  },
  {
    id: 'src-webcam',
    name: 'Demo Camera / USB Webcam',
    category: 'displays',
    subtitle: 'Integrated HD Camera • 1080p30 (Simulated)',
    glyph: '📷',
    previewType: 'webcam',
    isQueued: false,
    metadata: {
      resolution: '1920 × 1080'
    }
  },
  {
    id: 'src-media-video',
    name: 'Product Walkthrough (Video)',
    category: 'media',
    subtitle: 'SwitchCast-Overview.mp4 • 1080p • 02:45',
    glyph: '🎬',
    previewType: 'video',
    isQueued: false,
    metadata: {
      duration: '02:45',
      resolution: '1920 × 1080',
      fileSize: '42.8 MB'
    }
  },
  {
    id: 'src-media-image',
    name: 'System Architecture (Image)',
    category: 'media',
    subtitle: 'SwitchCast-Architecture.png • 3840 × 2160',
    glyph: '🖼️',
    previewType: 'image',
    isQueued: false,
    metadata: {
      resolution: '3840 × 2160',
      fileSize: '4.2 MB'
    }
  }
];

export const DEFAULT_EXPLANATION: ExplanationItem = {
  title: 'WHAT THIS DOES',
  description: 'Explore the controls to see how SwitchCast works.',
  tag: 'Product Tour',
  glyph: '💡'
};

export const INITIAL_DEMO_STATE: DemoState = {
  activeTab: 'dashboard',
  sourceCategory: 'windows',
  searchQuery: '',
  sources: JSON.parse(JSON.stringify(INITIAL_DEMO_SOURCES)),
  queuedSourceIds: [],
  activeSourceId: null,
  activeDesktopSourceId: null,
  presentationStatus: 'Not Started',
  outputOpen: true,
  dockVisible: true,
  dockFullscreen: false,
  isPaused: false,
  isBlackout: false,
  switchingMode: 'LiveOnly',
  videoPlaying: false,
  videoPosition: 24,
  videoDuration: 165,
  volume: 85,
  isMuted: false,
  slideIndex: 4,
  slideTotal: 18,
  musicPlaying: false,
  musicTrackIndex: 0,
  musicVolume: 70,
  musicTracks: [
    { title: 'Ambient Presentation Flow', artist: 'Jeizi Studio Sessions', duration: '03:45' },
    { title: 'Tech Keynote Walk-in', artist: 'SwitchCast Audio', duration: '02:50' },
    { title: 'Gentle Acoustic Uplift', artist: 'Conference Lounge', duration: '04:12' }
  ],
  hasQueuedSource: false,
  hasOpenedOutput: true,
  hasStartedPresenting: false,
  hasSwitchedSource: false,
  explanation: DEFAULT_EXPLANATION
};
