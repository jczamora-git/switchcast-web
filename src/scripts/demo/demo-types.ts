export type SourceCategory = 'windows' | 'displays' | 'media';
export type SwitchingMode = 'LiveOnly' | 'ActiveLive' | 'ActiveOnly';
export type PresentationStatus = 'Not Started' | 'Presenting' | 'Paused' | 'Blackout' | 'Stopped';
export type ActiveTab = 'dashboard' | 'sources' | 'settings';

export interface DemoSource {
  id: string;
  name: string;
  category: SourceCategory;
  subtitle: string;
  glyph: string;
  previewType: 'browser' | 'slides' | 'code' | 'display' | 'video' | 'image';
  isQueued: boolean;
  metadata?: {
    processName?: string;
    resolution?: string;
    duration?: string;
    fileSize?: string;
  };
}

export interface ExplanationItem {
  title: string;
  description: string;
  tag?: string;
  glyph?: string;
}

export interface DemoState {
  activeTab: ActiveTab;
  sourceCategory: SourceCategory;
  searchQuery: string;
  sources: DemoSource[];
  queuedSourceIds: string[];
  activeSourceId: string | null;
  activeDesktopSourceId: string | null;
  presentationStatus: PresentationStatus;
  outputOpen: boolean;
  dockVisible: boolean;
  dockFullscreen: boolean;
  isPaused: boolean;
  isBlackout: boolean;
  switchingMode: SwitchingMode;
  
  // Media Playback simulation (for video source)
  videoPlaying: boolean;
  videoPosition: number; // in seconds
  videoDuration: number; // in seconds
  volume: number; // 0 - 100
  isMuted: boolean;

  // Guided workflow progress
  hasQueuedSource: boolean;
  hasOpenedOutput: boolean;
  hasStartedPresenting: boolean;
  hasSwitchedSource: boolean;

  // Explanation
  explanation: ExplanationItem;
}
