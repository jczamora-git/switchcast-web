import type { ActiveTab, DemoState, ExplanationItem, SourceCategory, SwitchingMode } from './demo-types';
import { INITIAL_DEMO_STATE } from './demo-data';

export class DemoStore {
  private state: DemoState;
  private listeners: Set<(state: DemoState) => void> = new Set();
  private videoInterval: number | null = null;

  constructor() {
    this.state = JSON.parse(JSON.stringify(INITIAL_DEMO_STATE));
  }

  public getState(): DemoState {
    return this.state;
  }

  public subscribe(listener: (state: DemoState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify(explanation?: ExplanationItem): void {
    if (explanation) {
      this.state.explanation = explanation;
    }
    const snapshot = { ...this.state };
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }

  // --- TAB NAVIGATION ---
  public setTab(tab: ActiveTab): void {
    if (this.state.activeTab === tab) return;
    this.state.activeTab = tab;

    let explanation: ExplanationItem | undefined;
    if (tab === 'sources') {
      explanation = {
        title: 'ADD SOURCE',
        description: 'Choose the apps, screens, or media you want to include in your presentation.',
        tag: 'Sources',
        glyph: '📂'
      };
    } else if (tab === 'dashboard') {
      explanation = {
        title: 'DASHBOARD',
        description: 'Manage your presentation queue and control the shared audience window.',
        tag: 'Dashboard',
        glyph: '🎛️'
      };
    } else if (tab === 'settings') {
      explanation = {
        title: 'SETTINGS',
        description: 'Review product details, platform support, and application version.',
        tag: 'Settings',
        glyph: '⚙️'
      };
    }

    this.notify(explanation);
  }

  // --- SOURCES FILTERING ---
  public setSourceCategory(category: SourceCategory): void {
    this.state.sourceCategory = category;
    let desc = 'Add open applications to your presentation lineup.';
    if (category === 'displays') desc = 'Add full monitors and screens to your presentation lineup.';
    if (category === 'media') desc = 'Add local images and videos directly to your lineup.';

    this.notify({
      title: `${category.toUpperCase()} CATEGORY`,
      description: desc,
      tag: 'Category',
      glyph: '🔍'
    });
  }

  public setSearchQuery(query: string): void {
    this.state.searchQuery = query;
    this.notify();
  }

  // --- QUEUE MANAGEMENT ---
  public toggleQueueSource(sourceId: string): void {
    const source = this.state.sources.find(s => s.id === sourceId);
    if (!source) return;

    const isAlreadyQueued = this.state.queuedSourceIds.includes(sourceId);

    if (isAlreadyQueued) {
      // Remove from queue
      this.state.queuedSourceIds = this.state.queuedSourceIds.filter(id => id !== sourceId);
      source.isQueued = false;

      // If active source was removed
      if (this.state.activeSourceId === sourceId) {
        this.state.activeSourceId = this.state.queuedSourceIds[0] || null;
      }

      this.notify({
        title: 'REMOVE SOURCE',
        description: `"${source.name}" was removed from your presentation queue.`,
        tag: 'Queue Updated',
        glyph: '➖'
      });
    } else {
      // Add to queue
      this.state.queuedSourceIds.push(sourceId);
      source.isQueued = true;
      this.state.hasQueuedSource = true;

      // If no active source is set, set this as active
      if (!this.state.activeSourceId) {
        this.state.activeSourceId = sourceId;
        this.state.activeDesktopSourceId = sourceId;
      }

      this.notify({
        title: 'ADD SOURCE',
        description: `"${source.name}" is now queued and ready to switch to live.`,
        tag: 'Queue Updated',
        glyph: '➕'
      });
    }
  }

  // --- PRESENTATION LIFECYCLE ---
  public togglePresentation(): void {
    if (this.state.presentationStatus === 'Not Started' || this.state.presentationStatus === 'Stopped') {
      this.startPresentation();
    } else {
      this.stopPresentation();
    }
  }

  public startPresentation(): void {
    if (this.state.queuedSourceIds.length === 0) {
      this.notify({
        title: 'ADD SOURCE FIRST',
        description: 'Choose at least one application or display before starting your presentation.',
        tag: 'Notice',
        glyph: '⚠️'
      });
      return;
    }

    if (!this.state.activeSourceId) {
      this.state.activeSourceId = this.state.queuedSourceIds[0];
      this.state.activeDesktopSourceId = this.state.queuedSourceIds[0];
    }

    this.state.presentationStatus = 'Presenting';
    this.state.isPaused = false;
    this.state.isBlackout = false;
    this.state.hasStartedPresenting = true;
    this.state.outputOpen = true;

    this.notify({
      title: 'START PRESENTING',
      description: 'Your selected source is now visible in the shared presentation window.',
      tag: 'Live',
      glyph: '🔴'
    });
  }

  public stopPresentation(): void {
    this.state.presentationStatus = 'Stopped';
    this.state.isPaused = false;
    this.state.isBlackout = false;
    this.state.videoPlaying = false;
    this.stopVideoLoop();

    this.notify({
      title: 'STOP PRESENTING',
      description: 'Presentation ended. The output window returns to standby.',
      tag: 'Standby',
      glyph: '⏹️'
    });
  }

  // --- SOURCE SWITCHING ---
  public switchSource(sourceId: string): void {
    if (!this.state.queuedSourceIds.includes(sourceId)) return;
    const prevId = this.state.activeSourceId;
    if (prevId === sourceId) return;

    const source = this.state.sources.find(s => s.id === sourceId);
    if (!source) return;

    // Apply switching mode rules
    if (this.state.switchingMode === 'LiveOnly') {
      this.state.activeSourceId = sourceId;
    } else if (this.state.switchingMode === 'ActiveLive') {
      this.state.activeSourceId = sourceId;
      this.state.activeDesktopSourceId = sourceId;
    } else if (this.state.switchingMode === 'ActiveOnly') {
      this.state.activeDesktopSourceId = sourceId;
    }

    this.state.hasSwitchedSource = true;

    // Check if video source
    if (source.previewType === 'video') {
      this.state.videoPlaying = true;
      this.startVideoLoop();
    } else {
      this.state.videoPlaying = false;
      this.stopVideoLoop();
    }

    this.notify({
      title: 'NEXT SOURCE',
      description: 'Switch what your audience sees without restarting your screen share.',
      tag: 'Switched',
      glyph: '🔀'
    });
  }

  public nextSource(): void {
    if (this.state.queuedSourceIds.length <= 1) return;
    const currentIndex = this.state.queuedSourceIds.indexOf(this.state.activeSourceId || '');
    const nextIndex = (currentIndex + 1) % this.state.queuedSourceIds.length;
    this.switchSource(this.state.queuedSourceIds[nextIndex]);
  }

  public previousSource(): void {
    if (this.state.queuedSourceIds.length <= 1) return;
    const currentIndex = this.state.queuedSourceIds.indexOf(this.state.activeSourceId || '');
    const prevIndex = (currentIndex - 1 + this.state.queuedSourceIds.length) % this.state.queuedSourceIds.length;
    this.switchSource(this.state.queuedSourceIds[prevIndex]);
  }

  // --- CONTROLS: PAUSE & BLACKOUT ---
  public togglePause(): void {
    if (this.state.presentationStatus === 'Not Started' || this.state.presentationStatus === 'Stopped') return;

    this.state.isPaused = !this.state.isPaused;
    if (this.state.isPaused) {
      this.state.presentationStatus = 'Paused';
      this.notify({
        title: 'PAUSE',
        description: 'Freeze the current frame while you prepare your next step.',
        tag: 'Paused',
        glyph: '⏸️'
      });
    } else {
      this.state.presentationStatus = this.state.isBlackout ? 'Blackout' : 'Presenting';
      this.notify({
        title: 'RESUME',
        description: 'Live presentation feed resumed in real time.',
        tag: 'Live',
        glyph: '▶️'
      });
    }
  }

  public toggleBlackout(): void {
    if (this.state.presentationStatus === 'Not Started' || this.state.presentationStatus === 'Stopped') return;

    this.state.isBlackout = !this.state.isBlackout;
    if (this.state.isBlackout) {
      this.state.presentationStatus = 'Blackout';
      this.notify({
        title: 'BLACKOUT',
        description: 'Temporarily hide your presentation without ending the session.',
        tag: 'Privacy',
        glyph: '🕶️'
      });
    } else {
      this.state.presentationStatus = this.state.isPaused ? 'Paused' : 'Presenting';
      this.notify({
        title: 'RESTORE OUTPUT',
        description: 'Privacy curtain removed; output restored to your active source.',
        tag: 'Live',
        glyph: '👁️'
      });
    }
  }

  // --- SWITCHING MODES ---
  public setSwitchingMode(mode: SwitchingMode): void {
    this.state.switchingMode = mode;
    let title = 'LIVE ONLY';
    let desc = 'Switch the audience view while keeping your current workspace in focus.';
    if (mode === 'ActiveLive') {
      title = 'ACTIVE + LIVE';
      desc = 'Switch both your active app and the audience view.';
    } else if (mode === 'ActiveOnly') {
      title = 'ACTIVE ONLY';
      desc = 'Bring an app into focus without changing what your audience sees.';
    }

    this.notify({
      title,
      description: desc,
      tag: 'Switching Mode',
      glyph: '⚡'
    });
  }

  // --- WINDOW & DOCK TOGGLES ---
  public toggleOutputWindow(): void {
    this.state.outputOpen = !this.state.outputOpen;
    this.state.hasOpenedOutput = true;
    this.notify({
      title: 'OUTPUT WINDOW',
      description: 'Show or hide the shared audience-facing presentation window.',
      tag: 'Window Toggle',
      glyph: '🖥️'
    });
  }

  public toggleDock(): void {
    this.state.dockVisible = !this.state.dockVisible;
    this.notify({
      title: 'PRESENTER DOCK',
      description: 'Control your presentation without returning to the main dashboard.',
      tag: 'Dock Toggle',
      glyph: '🎛️'
    });
  }

  public toggleDockFullscreen(): void {
    this.state.dockFullscreen = !this.state.dockFullscreen;
    this.notify({
      title: 'FULLSCREEN',
      description: 'Toggle between windowed output and borderless fullscreen.',
      tag: 'Display Mode',
      glyph: '⛶'
    });
  }

  // --- VIDEO TRANSPORT SIMULATION ---
  public toggleVideoPlay(): void {
    this.state.videoPlaying = !this.state.videoPlaying;
    if (this.state.videoPlaying) {
      this.startVideoLoop();
      this.notify({
        title: 'VIDEO PLAYBACK',
        description: 'Playing video with synchronized local audio output.',
        tag: 'Media Transport',
        glyph: '▶️'
      });
    } else {
      this.stopVideoLoop();
      this.notify({
        title: 'VIDEO PAUSED',
        description: 'Video frame paused on current position.',
        tag: 'Media Transport',
        glyph: '⏸️'
      });
    }
  }

  public restartVideo(): void {
    this.state.videoPosition = 0;
    this.notify({
      title: 'RESTART VIDEO',
      description: 'Timeline rewound to the beginning.',
      tag: 'Media Transport',
      glyph: '⏮️'
    });
  }

  public seekVideo(deltaSeconds: number): void {
    this.state.videoPosition = Math.max(0, Math.min(this.state.videoDuration, this.state.videoPosition + deltaSeconds));
    this.notify({
      title: 'SEEK VIDEO',
      description: `Video timeline jumped to ${this.formatTime(this.state.videoPosition)}.`,
      tag: 'Media Transport',
      glyph: '⏩'
    });
  }

  public toggleMute(): void {
    this.state.isMuted = !this.state.isMuted;
    this.notify({
      title: this.state.isMuted ? 'MUTE AUDIO' : 'UNMUTE AUDIO',
      description: this.state.isMuted ? 'Local media sound muted.' : 'Audible playback restored.',
      tag: 'Audio Control',
      glyph: this.state.isMuted ? '🔇' : '🔊'
    });
  }

  public setVolume(vol: number): void {
    this.state.volume = Math.max(0, Math.min(100, vol));
    this.state.isMuted = false;
    this.notify({
      title: 'VOLUME',
      description: `Audio level set to ${this.state.volume}%.`,
      tag: 'Audio Control',
      glyph: '🔊'
    });
  }

  private startVideoLoop(): void {
    if (this.videoInterval) return;
    const intervalFn = typeof window !== 'undefined' ? window.setInterval : setInterval;
    this.videoInterval = intervalFn(() => {
      if (this.state.videoPlaying && !this.state.isPaused && !this.state.isBlackout) {
        if (this.state.videoPosition >= this.state.videoDuration) {
          this.state.videoPosition = 0;
        } else {
          this.state.videoPosition += 1;
        }
        this.notify();
      }
    }, 1000) as unknown as number;
  }

  private stopVideoLoop(): void {
    if (this.videoInterval) {
      const clearFn = typeof window !== 'undefined' ? window.clearInterval : clearInterval;
      clearFn(this.videoInterval);
      this.videoInterval = null;
    }
  }

  // --- RESET DEMO ---
  public resetDemo(): void {
    this.stopVideoLoop();
    this.state = JSON.parse(JSON.stringify(INITIAL_DEMO_STATE));
    this.notify({
      title: 'WHAT THIS DOES',
      description: 'Explore the controls to see how SwitchCast works.',
      tag: 'Product Tour',
      glyph: '💡'
    });
  }

  public formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
