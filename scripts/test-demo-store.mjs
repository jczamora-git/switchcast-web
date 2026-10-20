import assert from 'node:assert/strict';
import { createServer } from 'vite';

async function runTests() {
  console.log('==================================================');
  console.log('SWITCHCAST INTERACTIVE DEMO — STATE TRANSITION TESTS');
  console.log('==================================================\n');

  // Load TypeScript module using Vite SSR runtime
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  const { DemoStore } = await server.ssrLoadModule('./src/scripts/demo/demo-store.ts');
  const store = new DemoStore();

  try {
    // FLOW 1: Navigation, Queueing, Presentation Start, and Source Switch
    console.log('TEST 1: Navigation & Queueing flow...');
    store.setTab('sources');
    assert.equal(store.getState().activeTab, 'sources');
    assert.equal(store.getState().explanation.tag, 'Sources');

    store.toggleQueueSource('src-browser');
    assert.equal(store.getState().queuedSourceIds.length, 1);
    assert.equal(store.getState().queuedSourceIds[0], 'src-browser');
    assert.equal(store.getState().activeSourceId, 'src-browser');

    store.toggleQueueSource('src-slides');
    assert.equal(store.getState().queuedSourceIds.length, 2);

    store.setTab('dashboard');
    assert.equal(store.getState().activeTab, 'dashboard');

    store.startPresentation();
    assert.equal(store.getState().presentationStatus, 'Presenting');
    assert.equal(store.getState().outputOpen, true);
    assert.equal(store.getState().hasStartedPresenting, true);

    store.switchSource('src-slides');
    assert.equal(store.getState().activeSourceId, 'src-slides');
    assert.equal(store.getState().hasSwitchedSource, true);
    console.log('  ✓ Flow 1 passed successfully.\n');

    // FLOW 2: Presentation Lifecycle (Pause, Resume, Blackout, Restore)
    console.log('TEST 2: Pause and Blackout precedence...');
    store.togglePause();
    assert.equal(store.getState().isPaused, true);
    assert.equal(store.getState().presentationStatus, 'Paused');

    store.togglePause();
    assert.equal(store.getState().isPaused, false);
    assert.equal(store.getState().presentationStatus, 'Presenting');

    store.toggleBlackout();
    assert.equal(store.getState().isBlackout, true);
    assert.equal(store.getState().presentationStatus, 'Blackout');

    // If paused while blacked out
    store.togglePause();
    assert.equal(store.getState().isPaused, true);

    // When blackout lifted, precedence falls back to paused state
    store.toggleBlackout();
    assert.equal(store.getState().isBlackout, false);
    assert.equal(store.getState().presentationStatus, 'Paused');

    // Resume presentation
    store.togglePause();
    assert.equal(store.getState().isPaused, false);
    assert.equal(store.getState().presentationStatus, 'Presenting');
    console.log('  ✓ Flow 2 passed successfully.\n');

    // FLOW 3: Switching Modes (Live Only, Active+Live, Active Only)
    console.log('TEST 3: Switching Modes behavior...');
    store.setSwitchingMode('ActiveOnly');
    assert.equal(store.getState().switchingMode, 'ActiveOnly');

    // In ActiveOnly, switching a source updates activeDesktopSourceId but NOT audience activeSourceId
    store.switchSource('src-browser');
    assert.equal(store.getState().activeDesktopSourceId, 'src-browser');
    assert.equal(store.getState().activeSourceId, 'src-slides', 'Audience output should remain on slides in ActiveOnly mode');

    store.setSwitchingMode('LiveOnly');
    store.switchSource('src-browser');
    assert.equal(store.getState().activeSourceId, 'src-browser');
    console.log('  ✓ Flow 3 passed successfully.\n');

    // FLOW 4: Media playback simulation
    console.log('TEST 4: Media controls consistency...');
    store.toggleQueueSource('src-media-video');
    store.switchSource('src-media-video');
    assert.equal(store.getState().activeSourceId, 'src-media-video');
    assert.equal(store.getState().videoPlaying, true);

    store.seekVideo(10);
    assert.equal(store.getState().videoPosition, 34);

    store.seekVideo(-20);
    assert.equal(store.getState().videoPosition, 14);

    store.setVolume(50);
    assert.equal(store.getState().volume, 50);
    assert.equal(store.getState().isMuted, false);

    store.toggleMute();
    assert.equal(store.getState().isMuted, true);
    console.log('  ✓ Flow 4 passed successfully.\n');

    // FLOW 5: Stop presentation and Reset demo
    console.log('TEST 5: Stop & Reset Demo...');
    store.stopPresentation();
    assert.equal(store.getState().presentationStatus, 'Stopped');
    assert.equal(store.getState().videoPlaying, false);

    store.resetDemo();
    assert.equal(store.getState().activeTab, 'dashboard');
    assert.equal(store.getState().queuedSourceIds.length, 0);
    assert.equal(store.getState().activeSourceId, null);
    assert.equal(store.getState().presentationStatus, 'Not Started');
    assert.equal(store.getState().isPaused, false);
    assert.equal(store.getState().isBlackout, false);
    console.log('  ✓ Flow 5 passed successfully.\n');

    // FLOW 6: PowerPoint slides, Background Music, and Webcam Sources
    console.log('TEST 6: PowerPoint slide navigation, Background Music, and Webcam sources...');
    
    // Test PowerPoint slide navigation
    assert.equal(store.getState().slideIndex, 4);
    store.nextSlide();
    assert.equal(store.getState().slideIndex, 5);
    store.prevSlide();
    assert.equal(store.getState().slideIndex, 4);

    // Test Webcam source discovery
    const webcamSrc = store.getState().sources.find(s => s.id === 'src-webcam');
    assert.ok(webcamSrc, 'Demo camera / USB webcam source must exist in catalog');
    assert.equal(webcamSrc.previewType, 'webcam');

    // Test Background Music Playlists
    store.setTab('music');
    assert.equal(store.getState().activeTab, 'music');
    assert.equal(store.getState().musicPlaying, false);

    store.toggleMusicPlay();
    assert.equal(store.getState().musicPlaying, true);
    assert.equal(store.getState().musicTrackIndex, 0);

    store.nextMusicTrack();
    assert.equal(store.getState().musicTrackIndex, 1);

    store.prevMusicTrack();
    assert.equal(store.getState().musicTrackIndex, 0);

    store.setMusicVolume(50);
    assert.equal(store.getState().musicVolume, 50);

    store.toggleMusicPlay();
    assert.equal(store.getState().musicPlaying, false);
    console.log('  ✓ Flow 6 passed successfully.\n');

    console.log('==================================================');
    console.log('SUCCESS: ALL STATE TRANSITION TESTS PASSED (6 / 6)');
    console.log('==================================================');
  } finally {
    await server.close();
  }
}

runTests().catch(err => {
  console.error('Test failure:', err);
  process.exit(1);
});
