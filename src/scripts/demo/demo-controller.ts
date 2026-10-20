import { DemoStore } from './demo-store';
import type { DemoState, SourceCategory, SwitchingMode } from './demo-types';

export function initInteractiveDemo(): void {
  const root = document.querySelector<HTMLElement>('.demo-wrapper');
  if (!root) return;

  const store = new DemoStore();

  // --- QUERY DOM ELEMENTS ---
  // View Switcher (mobile/tablet)
  const viewSwitchBtns = root.querySelectorAll<HTMLButtonElement>('.view-switch-btn');
  const panelApp = root.querySelector<HTMLElement>('.demo-panel-app');
  const panelCompanion = root.querySelector<HTMLElement>('.demo-panel-companion');

  // Nav items (Dashboard, Sources, Settings)
  const navItems = root.querySelectorAll<HTMLElement>('.win-nav-item');
  const viewPanels = root.querySelectorAll<HTMLElement>('.view-panel');

  // Status Strip
  const statusEl = root.querySelector<HTMLElement>('#dash-val-status');
  const activeSourceEl = root.querySelector<HTMLElement>('#dash-val-active');
  const queuedCountEl = root.querySelector<HTMLElement>('#dash-val-queued');
  const outputStatusEl = root.querySelector<HTMLElement>('#dash-val-output');

  // Primary Control Bar
  const btnStartPresenting = root.querySelector<HTMLButtonElement>('#btn-start-presenting');
  const sourceSelect = root.querySelector<HTMLSelectElement>('#dash-source-select');
  const btnAddSource = root.querySelector<HTMLButtonElement>('#btn-add-source');
  const btnDashPause = root.querySelector<HTMLButtonElement>('#btn-dash-pause');
  const btnDashBlackout = root.querySelector<HTMLButtonElement>('#btn-dash-blackout');
  const btnToggleOutput = root.querySelector<HTMLButtonElement>('#btn-toggle-output');
  const btnToggleDock = root.querySelector<HTMLButtonElement>('#btn-toggle-dock');

  // Queued sources list & container
  const queueItemsList = root.querySelector<HTMLElement>('#dash-queue-items');
  const queueEmptyState = root.querySelector<HTMLElement>('#dash-queue-empty');

  // Sources tab
  const categoryBtns = root.querySelectorAll<HTMLButtonElement>('.sources-cat-btn');
  const searchInput = root.querySelector<HTMLInputElement>('#sources-search');
  const catalogList = root.querySelector<HTMLElement>('#sources-catalog-list');
  const sourcesQueuedSummary = root.querySelector<HTMLElement>('#sources-queued-summary');
  const btnReturnDash = root.querySelector<HTMLButtonElement>('#btn-return-dash');

  // Output Window
  const outputWindowCard = root.querySelector<HTMLElement>('#output-window-card');
  const outputBarBadge = root.querySelector<HTMLElement>('#output-bar-badge');
  const canvasStandbyView = root.querySelector<HTMLElement>('#canvas-standby');
  const canvasFeeds = root.querySelectorAll<HTMLElement>('.canvas-feed');
  const overlayPaused = root.querySelector<HTMLElement>('#overlay-paused');
  const overlayBlackout = root.querySelector<HTMLElement>('#overlay-blackout');

  // Floating Dock
  const floatingDockCard = root.querySelector<HTMLElement>('#floating-dock-card');
  const dockStatusPill = root.querySelector<HTMLElement>('#dock-status-pill');
  const dockSourceActive = root.querySelector<HTMLElement>('#dock-source-active');
  const btnDockPrev = root.querySelector<HTMLButtonElement>('#btn-dock-prev');
  const btnDockNext = root.querySelector<HTMLButtonElement>('#btn-dock-next');
  const dockModeBtns = root.querySelectorAll<HTMLButtonElement>('.dock-mode-btn');
  const btnDockPause = root.querySelector<HTMLButtonElement>('#btn-dock-pause');
  const btnDockBlackout = root.querySelector<HTMLButtonElement>('#btn-dock-blackout');
  const btnDockStop = root.querySelector<HTMLButtonElement>('#btn-dock-stop');
  const btnDockFullscreen = root.querySelector<HTMLButtonElement>('#btn-dock-fullscreen');

  // Video Transport Row in Dock
  const dockVideoControls = root.querySelector<HTMLElement>('#dock-video-controls');
  const btnVideoPlay = root.querySelector<HTMLButtonElement>('#btn-video-play');
  const btnVideoRestart = root.querySelector<HTMLButtonElement>('#btn-video-restart');
  const btnVideoBack10 = root.querySelector<HTMLButtonElement>('#btn-video-back10');
  const btnVideoFwd10 = root.querySelector<HTMLButtonElement>('#btn-video-fwd10');
  const videoTimecode = root.querySelector<HTMLElement>('#dock-video-timecode');
  const btnVideoMute = root.querySelector<HTMLButtonElement>('#btn-video-mute');
  const videoVolumeSlider = root.querySelector<HTMLInputElement>('#dock-video-volume');
  const videoProgressFill = root.querySelector<HTMLElement>('#mockup-video-fill');
  const videoTimeCurrent = root.querySelector<HTMLElement>('#mockup-video-curr');

  // Slide controls (PowerPoint)
  const dockSlideControls = root.querySelector<HTMLElement>('#dock-slide-controls');
  const btnSlidePrev = root.querySelector<HTMLButtonElement>('#btn-slide-prev');
  const btnSlideNext = root.querySelector<HTMLButtonElement>('#btn-slide-next');
  const dockSlideNum = root.querySelector<HTMLElement>('#dock-slide-num');
  const canvasSlideIndicator = root.querySelector<HTMLElement>('#canvas-slide-indicator');
  const canvasSlideshowIndicator = root.querySelector<HTMLElement>('#canvas-slideshow-indicator');

  // Background Music controls
  const btnDockMusic = root.querySelector<HTMLButtonElement>('#btn-dock-music');
  const btnMusicPlay = root.querySelector<HTMLButtonElement>('#btn-music-play');
  const musicPlayIcon = root.querySelector<HTMLElement>('#music-play-icon');
  const btnMusicPrev = root.querySelector<HTMLButtonElement>('#btn-music-prev');
  const btnMusicNext = root.querySelector<HTMLButtonElement>('#btn-music-next');
  const musicVolSlider = root.querySelector<HTMLInputElement>('#music-vol-slider');
  const musicStatusBadge = root.querySelector<HTMLElement>('#music-status-badge');
  const musicTrackTitle = root.querySelector<HTMLElement>('#music-track-title');
  const musicTracksList = root.querySelector<HTMLElement>('#music-tracks-list');

  // Explanation Card
  const explanationTitle = root.querySelector<HTMLElement>('#explanation-title');
  const explanationTag = root.querySelector<HTMLElement>('#explanation-tag');
  const explanationGlyph = root.querySelector<HTMLElement>('#explanation-glyph');
  const explanationDesc = root.querySelector<HTMLElement>('#explanation-desc');
  const explanationCard = root.querySelector<HTMLElement>('.explanation-card');

  // Guided Workflow Pills
  const guideStep1 = root.querySelector<HTMLElement>('#guide-step-1');
  const guideStep2 = root.querySelector<HTMLElement>('#guide-step-2');
  const guideStep3 = root.querySelector<HTMLElement>('#guide-step-3');
  const guideStep4 = root.querySelector<HTMLElement>('#guide-step-4');

  // Reset Button
  const btnReset = root.querySelector<HTMLButtonElement>('#btn-reset-demo');

  // --- RENDER SUBSCRIBER ---
  store.subscribe((state: DemoState) => {
    // 1. Navigation Tabs
    navItems.forEach(item => {
      const tabName = item.getAttribute('data-tab');
      item.classList.toggle('active', tabName === state.activeTab);
    });

    viewPanels.forEach(panel => {
      const panelName = panel.getAttribute('data-panel');
      panel.classList.toggle('active', panelName === state.activeTab);
    });

    // 2. Status Strip
    if (statusEl) {
      statusEl.textContent = state.presentationStatus;
      statusEl.className = 'status-value';
      if (state.presentationStatus === 'Presenting') statusEl.classList.add('presenting');
      if (state.presentationStatus === 'Paused') statusEl.classList.add('paused');
      if (state.presentationStatus === 'Blackout') statusEl.classList.add('blackout');
    }

    const activeSrc = state.sources.find(s => s.id === state.activeSourceId);
    if (activeSourceEl) {
      activeSourceEl.textContent = activeSrc ? activeSrc.name : '(None)';
    }

    if (queuedCountEl) {
      queuedCountEl.textContent = `${state.queuedSourceIds.length} Source${state.queuedSourceIds.length === 1 ? '' : 's'}`;
    }

    if (outputStatusEl) {
      outputStatusEl.textContent = state.outputOpen ? 'Open (Visible)' : 'Minimized';
    }

    // 3. Primary Control Bar
    if (btnStartPresenting) {
      const isLive = state.presentationStatus === 'Presenting' || state.presentationStatus === 'Paused' || state.presentationStatus === 'Blackout';
      btnStartPresenting.classList.toggle('stop', isLive);
      btnStartPresenting.innerHTML = isLive
        ? '<span>⏹</span> Stop Presenting'
        : '<span>▶</span> Start Presenting';
    }

    if (sourceSelect) {
      sourceSelect.innerHTML = '';
      if (state.queuedSourceIds.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = '-- No Sources Queued --';
        sourceSelect.appendChild(opt);
      } else {
        state.queuedSourceIds.forEach(id => {
          const s = state.sources.find(src => src.id === id);
          if (s) {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = `${s.glyph} ${s.name}`;
            opt.selected = s.id === state.activeSourceId;
            sourceSelect.appendChild(opt);
          }
        });
      }
    }

    const isPresentingActive = state.presentationStatus === 'Presenting' || state.presentationStatus === 'Paused' || state.presentationStatus === 'Blackout';
    if (btnDashPause) {
      btnDashPause.disabled = !isPresentingActive;
      btnDashPause.classList.toggle('active', state.isPaused);
      btnDashPause.innerHTML = state.isPaused
        ? '<span>▶</span> Resume'
        : '<span>⏸</span> Pause';
    }

    if (btnDashBlackout) {
      btnDashBlackout.disabled = !isPresentingActive;
      btnDashBlackout.classList.toggle('active', state.isBlackout);
    }

    if (btnToggleOutput) {
      btnToggleOutput.classList.toggle('active', state.outputOpen);
    }

    if (btnToggleDock) {
      btnToggleDock.classList.toggle('active', state.dockVisible);
    }

    // 4. Queued Sources List on Dashboard
    if (queueItemsList && queueEmptyState) {
      if (state.queuedSourceIds.length === 0) {
        queueItemsList.style.display = 'none';
        queueEmptyState.style.display = 'block';
      } else {
        queueItemsList.style.display = 'flex';
        queueEmptyState.style.display = 'none';
        queueItemsList.innerHTML = '';

        state.queuedSourceIds.forEach((srcId) => {
          const src = state.sources.find(s => s.id === srcId);
          if (!src) return;

          const row = document.createElement('div');
          row.className = `queue-row ${src.id === state.activeSourceId ? 'active-source' : ''}`;
          row.innerHTML = `
            <div class="queue-row-info">
              <span class="queue-row-glyph">${src.glyph}</span>
              <div class="queue-row-text">
                <span class="queue-row-name">${src.name}</span>
                <span class="queue-row-sub">${src.subtitle}</span>
              </div>
            </div>
            <div class="queue-row-actions">
              ${src.id !== state.activeSourceId ? `<button type="button" class="btn-switch-item" data-switch-id="${src.id}">Switch</button>` : `<span class="demo-pill-tag">LIVE</span>`}
              <button type="button" class="btn-remove-item" data-remove-id="${src.id}" title="Remove from Queue">✕</button>
            </div>
          `;
          queueItemsList.appendChild(row);
        });

        // Add switch and remove listeners
        queueItemsList.querySelectorAll<HTMLButtonElement>('.btn-switch-item').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const sid = btn.getAttribute('data-switch-id');
            if (sid) store.switchSource(sid);
          });
        });

        queueItemsList.querySelectorAll<HTMLButtonElement>('.btn-remove-item').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const sid = btn.getAttribute('data-remove-id');
            if (sid) store.toggleQueueSource(sid);
          });
        });
      }
    }

    // 5. Sources Tab
    categoryBtns.forEach(btn => {
      const cat = btn.getAttribute('data-category');
      btn.classList.toggle('active', cat === state.sourceCategory);
    });

    if (sourcesQueuedSummary) {
      sourcesQueuedSummary.textContent = `${state.queuedSourceIds.length} source${state.queuedSourceIds.length === 1 ? '' : 's'} queued for this session`;
    }

    // Re-render catalog items based on category & search
    if (catalogList) {
      const filtered = state.sources.filter(s => {
        const matchesCategory = s.category === state.sourceCategory;
        const matchesSearch = state.searchQuery === '' ||
          s.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          s.subtitle.toLowerCase().includes(state.searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });

      catalogList.innerHTML = '';
      if (filtered.length === 0) {
        catalogList.innerHTML = `<div class="queue-empty-state">No matching sources found in this category.</div>`;
      } else {
        filtered.forEach(src => {
          const isQueued = state.queuedSourceIds.includes(src.id);
          const card = document.createElement('div');
          card.className = 'source-catalog-card';
          card.innerHTML = `
            <div class="source-catalog-info">
              <span class="source-catalog-glyph">${src.glyph}</span>
              <div class="source-catalog-details">
                <span class="source-catalog-title">${src.name}</span>
                <span class="source-catalog-desc">${src.subtitle}</span>
              </div>
            </div>
            <button type="button" class="btn-queue-toggle ${isQueued ? 'queued' : ''}" data-queue-id="${src.id}">
              ${isQueued ? '✓ Queued' : '+ Queue'}
            </button>
          `;
          catalogList.appendChild(card);
        });

        catalogList.querySelectorAll<HTMLButtonElement>('.btn-queue-toggle').forEach(btn => {
          btn.addEventListener('click', () => {
            const qid = btn.getAttribute('data-queue-id');
            if (qid) store.toggleQueueSource(qid);
          });
        });
      }
    }

    // 6. Presentation Output Window
    if (outputWindowCard) {
      outputWindowCard.classList.toggle('hidden', !state.outputOpen);
    }

    if (outputBarBadge) {
      if (isPresentingActive) {
        outputBarBadge.className = 'output-bar-badge live';
        outputBarBadge.innerHTML = '<span class="demo-pill-pulse"></span> Shared Once • Live';
      } else {
        outputBarBadge.className = 'output-bar-badge standby';
        outputBarBadge.textContent = 'Standby • Ready';
      }
    }

    if (canvasStandbyView) {
      canvasStandbyView.style.display = isPresentingActive && activeSrc ? 'none' : 'flex';
    }

    canvasFeeds.forEach(feed => {
      const feedType = feed.getAttribute('data-feed-type');
      if (isPresentingActive && activeSrc && activeSrc.previewType === feedType) {
        feed.classList.add('active');
      } else {
        feed.classList.remove('active');
      }
    });

    if (overlayPaused) {
      overlayPaused.classList.toggle('active', isPresentingActive && state.isPaused && !state.isBlackout);
    }

    if (overlayBlackout) {
      overlayBlackout.classList.toggle('active', isPresentingActive && state.isBlackout);
    }

    // 7. Floating Presenter Dock
    if (floatingDockCard) {
      floatingDockCard.classList.toggle('hidden', !state.dockVisible);
    }

    if (dockStatusPill) {
      if (isPresentingActive) {
        dockStatusPill.className = 'dock-status-pill on-air';
        dockStatusPill.innerHTML = '<span class="demo-pill-pulse"></span> ON AIR';
      } else {
        dockStatusPill.className = 'dock-status-pill standby';
        dockStatusPill.textContent = 'STANDBY';
      }
    }

    if (dockSourceActive) {
      dockSourceActive.textContent = activeSrc ? activeSrc.name : 'No Source';
    }

    if (btnDockPrev && btnDockNext) {
      const canNavigate = state.queuedSourceIds.length > 1;
      btnDockPrev.disabled = !canNavigate;
      btnDockNext.disabled = !canNavigate;
    }

    dockModeBtns.forEach(btn => {
      const mode = btn.getAttribute('data-mode') as SwitchingMode;
      btn.classList.toggle('active', mode === state.switchingMode);
    });

    if (btnDockPause) {
      btnDockPause.disabled = !isPresentingActive;
      btnDockPause.classList.toggle('active', state.isPaused);
      btnDockPause.title = state.isPaused ? 'Resume Presentation' : 'Freeze Presentation Frame';
    }

    if (btnDockBlackout) {
      btnDockBlackout.disabled = !isPresentingActive;
      btnDockBlackout.classList.toggle('active', state.isBlackout);
    }

    if (btnDockStop) {
      btnDockStop.disabled = !isPresentingActive;
    }

    if (btnDockFullscreen) {
      btnDockFullscreen.classList.toggle('active', state.dockFullscreen);
    }

    // Video Transport Row in Dock
    const isVideoActive = isPresentingActive && activeSrc?.previewType === 'video';
    if (dockVideoControls) {
      dockVideoControls.classList.toggle('active', isVideoActive);
    }

    if (btnVideoPlay) {
      btnVideoPlay.innerHTML = state.videoPlaying ? '⏸' : '▶';
    }

    if (videoTimecode) {
      videoTimecode.textContent = `${store.formatTime(state.videoPosition)} / ${store.formatTime(state.videoDuration)}`;
    }

    if (videoVolumeSlider) {
      videoVolumeSlider.value = state.volume.toString();
    }

    if (btnVideoMute) {
      btnVideoMute.innerHTML = state.isMuted ? '🔇' : '🔊';
    }

    if (videoProgressFill) {
      const pct = (state.videoPosition / state.videoDuration) * 100;
      videoProgressFill.style.width = `${pct}%`;
    }

    if (videoTimeCurrent) {
      videoTimeCurrent.textContent = store.formatTime(state.videoPosition);
    }

    // Slide Controls (PowerPoint)
    const isSlideActive = isPresentingActive && (activeSrc?.previewType === 'slides' || activeSrc?.previewType === 'slideshow');
    if (dockSlideControls) {
      dockSlideControls.style.display = isSlideActive ? 'block' : 'none';
    }
    const slideText = `Slide ${state.slideIndex} of ${state.slideTotal}`;
    if (dockSlideNum) dockSlideNum.textContent = slideText;
    if (canvasSlideIndicator) canvasSlideIndicator.textContent = `SLIDE ${state.slideIndex.toString().padStart(2, '0')} / ${state.slideTotal.toString().padStart(2, '0')}`;
    if (canvasSlideshowIndicator) canvasSlideshowIndicator.textContent = `SLIDE ${state.slideIndex.toString().padStart(2, '0')} / ${state.slideTotal.toString().padStart(2, '0')}`;

    // Background Music Controls
    if (btnDockMusic) {
      btnDockMusic.classList.toggle('active', state.musicPlaying);
      btnDockMusic.title = state.musicPlaying ? 'Pause Background Music' : 'Play Background Music';
    }

    if (musicPlayIcon) {
      musicPlayIcon.textContent = state.musicPlaying ? '⏸' : '▶';
    }

    if (musicStatusBadge) {
      musicStatusBadge.textContent = state.musicPlaying ? 'STREAMING LIVE' : 'STANDBY';
      musicStatusBadge.className = `badge-status ${state.musicPlaying ? 'badge-latest' : 'badge-previous'}`;
    }

    const currentTrack = state.musicTracks[state.musicTrackIndex];
    if (musicTrackTitle && currentTrack) {
      musicTrackTitle.textContent = currentTrack.title;
    }

    if (musicVolSlider) {
      musicVolSlider.value = state.musicVolume.toString();
    }

    if (musicTracksList) {
      musicTracksList.innerHTML = '';
      state.musicTracks.forEach((tr, idx) => {
        const isCurrent = idx === state.musicTrackIndex;
        const row = document.createElement('div');
        row.style.cssText = `display: flex; align-items: center; justify-content: space-between; padding: 0.35rem 0.65rem; border-radius: 4px; background: ${isCurrent ? 'rgba(255, 122, 89, 0.12)' : 'rgba(255, 255, 255, 0.03)'}; border: 1px solid ${isCurrent ? 'rgba(255, 122, 89, 0.35)' : 'transparent'}; font-size: 0.78rem; cursor: pointer;`;
        row.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.45rem;">
            <span>${isCurrent && state.musicPlaying ? '🔊' : '🎵'}</span>
            <span style="color: ${isCurrent ? '#ffffff' : 'var(--sc-text-secondary)'}; font-weight: ${isCurrent ? '600' : '400'};">${tr.title}</span>
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--sc-text-tertiary);">${tr.duration}</span>
        `;
        row.addEventListener('click', () => {
          store.selectMusicTrack(idx);
          if (!store.getState().musicPlaying) {
            store.toggleMusicPlay();
          }
        });
        musicTracksList.appendChild(row);
      });
    }

    // 8. Dynamic Explanation Card
    if (explanationTitle) explanationTitle.textContent = state.explanation.title;
    if (explanationTag) explanationTag.textContent = state.explanation.tag || 'Action';
    if (explanationGlyph) explanationGlyph.textContent = state.explanation.glyph || '💡';
    if (explanationDesc) {
      explanationDesc.textContent = state.explanation.description;
      if (explanationCard) {
        explanationCard.style.borderColor = 'rgba(255, 122, 89, 0.6)';
        setTimeout(() => {
          if (explanationCard) explanationCard.style.borderColor = 'var(--sc-border-base)';
        }, 500);
      }
    }

    // 9. Guided Workflow Step Indicators
    if (guideStep1) guideStep1.classList.toggle('completed', state.hasQueuedSource);
    if (guideStep2) guideStep2.classList.toggle('completed', state.hasOpenedOutput);
    if (guideStep3) guideStep3.classList.toggle('completed', state.hasStartedPresenting);
    if (guideStep4) guideStep4.classList.toggle('completed', state.hasSwitchedSource);
  });

  // --- ATTACH EVENT LISTENERS ---
  // Nav clicks
  navItems.forEach(item => {
    const btn = item.querySelector<HTMLButtonElement>('button');
    if (btn) {
      btn.addEventListener('click', () => {
        const tab = item.getAttribute('data-tab');
        if (tab === 'dashboard' || tab === 'sources' || tab === 'music' || tab === 'settings') {
          store.setTab(tab);
        }
      });
    }
  });

  // Slide buttons
  if (btnSlidePrev) {
    btnSlidePrev.addEventListener('click', () => store.prevSlide());
  }
  if (btnSlideNext) {
    btnSlideNext.addEventListener('click', () => store.nextSlide());
  }

  // Background Music buttons
  if (btnDockMusic) {
    btnDockMusic.addEventListener('click', () => store.toggleMusicPlay());
  }
  if (btnMusicPlay) {
    btnMusicPlay.addEventListener('click', () => store.toggleMusicPlay());
  }
  if (btnMusicPrev) {
    btnMusicPrev.addEventListener('click', () => store.prevMusicTrack());
  }
  if (btnMusicNext) {
    btnMusicNext.addEventListener('click', () => store.nextMusicTrack());
  }
  if (musicVolSlider) {
    musicVolSlider.addEventListener('input', () => store.setMusicVolume(parseInt(musicVolSlider.value, 10)));
  }

  // Category buttons
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category') as SourceCategory;
      if (cat) store.setSourceCategory(cat);
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      store.setSearchQuery(searchInput.value);
    });
  }

  // Dashboard primary actions
  if (btnStartPresenting) {
    btnStartPresenting.addEventListener('click', () => {
      store.togglePresentation();
    });
  }

  if (sourceSelect) {
    sourceSelect.addEventListener('change', () => {
      if (sourceSelect.value) {
        store.switchSource(sourceSelect.value);
      }
    });
  }

  if (btnAddSource) {
    btnAddSource.addEventListener('click', () => {
      store.setTab('sources');
    });
  }

  if (btnDashPause) {
    btnDashPause.addEventListener('click', () => {
      store.togglePause();
    });
  }

  if (btnDashBlackout) {
    btnDashBlackout.addEventListener('click', () => {
      store.toggleBlackout();
    });
  }

  if (btnToggleOutput) {
    btnToggleOutput.addEventListener('click', () => {
      store.toggleOutputWindow();
    });
  }

  if (btnToggleDock) {
    btnToggleDock.addEventListener('click', () => {
      store.toggleDock();
    });
  }

  if (btnReturnDash) {
    btnReturnDash.addEventListener('click', () => {
      store.setTab('dashboard');
    });
  }

  // Floating dock actions
  if (btnDockPrev) {
    btnDockPrev.addEventListener('click', () => {
      store.previousSource();
    });
  }

  if (btnDockNext) {
    btnDockNext.addEventListener('click', () => {
      store.nextSource();
    });
  }

  dockModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode') as SwitchingMode;
      if (mode) store.setSwitchingMode(mode);
    });
  });

  if (btnDockPause) {
    btnDockPause.addEventListener('click', () => {
      store.togglePause();
    });
  }

  if (btnDockBlackout) {
    btnDockBlackout.addEventListener('click', () => {
      store.toggleBlackout();
    });
  }

  if (btnDockStop) {
    btnDockStop.addEventListener('click', () => {
      store.stopPresentation();
    });
  }

  if (btnDockFullscreen) {
    btnDockFullscreen.addEventListener('click', () => {
      store.toggleDockFullscreen();
    });
  }

  // Video Transport
  if (btnVideoPlay) {
    btnVideoPlay.addEventListener('click', () => {
      store.toggleVideoPlay();
    });
  }

  if (btnVideoRestart) {
    btnVideoRestart.addEventListener('click', () => {
      store.restartVideo();
    });
  }

  if (btnVideoBack10) {
    btnVideoBack10.addEventListener('click', () => {
      store.seekVideo(-10);
    });
  }

  if (btnVideoFwd10) {
    btnVideoFwd10.addEventListener('click', () => {
      store.seekVideo(10);
    });
  }

  if (btnVideoMute) {
    btnVideoMute.addEventListener('click', () => {
      store.toggleMute();
    });
  }

  if (videoVolumeSlider) {
    videoVolumeSlider.addEventListener('input', () => {
      store.setVolume(parseInt(videoVolumeSlider.value, 10));
    });
  }

  // Reset Demo
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      store.resetDemo();
    });
  }

  // Mobile View Switcher
  viewSwitchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      viewSwitchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (view === 'app') {
        panelApp?.classList.remove('view-hidden');
        panelCompanion?.classList.add('view-hidden');
      } else if (view === 'output') {
        panelApp?.classList.add('view-hidden');
        panelCompanion?.classList.remove('view-hidden');
        if (outputWindowCard) outputWindowCard.style.display = 'flex';
        if (floatingDockCard) floatingDockCard.style.display = 'none';
      } else if (view === 'dock') {
        panelApp?.classList.add('view-hidden');
        panelCompanion?.classList.remove('view-hidden');
        if (outputWindowCard) outputWindowCard.style.display = 'none';
        if (floatingDockCard) floatingDockCard.style.display = 'flex';
      }
    });
  });
}
