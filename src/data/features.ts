export interface FeatureItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'core' | 'media' | 'dock' | 'performance';
  badge: string;
  iconName: string;
  hotkey?: string;
  status: 'IMPLEMENTED' | 'PARTIAL' | 'PLANNED';
  highlights: string[];
}

export const VERIFIED_FEATURES: FeatureItem[] = [
  {
    id: 'source-switching',
    title: 'Seamless Source Switching',
    tagline: 'Switch instantly between windows, displays, and media.',
    description: 'Switch between active application windows, physical desktop monitors, images, and video files with zero stutter and zero stream renegotiation.',
    category: 'core',
    badge: 'Core Engine',
    iconName: 'switch',
    status: 'IMPLEMENTED',
    highlights: [
      'Latest-request-wins concurrency serialization',
      'Hardware-accelerated Direct3D 11 swapchain pipeline',
      'Zero meeting-share interruptions'
    ]
  },
  {
    id: 'stable-output',
    title: 'One Stable Output Window',
    tagline: 'Share once. Switch indefinitely.',
    description: 'Share a single dedicated 16:9 "SwitchCast Presentation Output" window in Zoom, Microsoft Teams, Google Meet, or OBS. Your audience only sees what you send live.',
    category: 'core',
    badge: 'Presentation Architecture',
    iconName: 'window',
    status: 'IMPLEMENTED',
    highlights: [
      'Persistent Win32 HWND preserves active screen shares',
      'Clean 16:9 letterboxed presentation canvas',
      'Instant toggle between Windowed and Fullscreen modes'
    ]
  },
  {
    id: 'presenter-dock',
    title: 'Floating Presenter Dock',
    tagline: 'Compact, always-on-top companion toolbar.',
    description: 'Control your live session without looking back at the main dashboard. Features native Windows non-client caption dragging, switching mode selector, and video transport controls.',
    category: 'dock',
    badge: 'Presenter UX',
    iconName: 'dock',
    hotkey: 'Ctrl + Shift + D',
    status: 'IMPLEMENTED',
    highlights: [
      'Native Windows App SDK non-client caption dragging',
      'Adaptive video timeline scrubber and live timecode',
      'Instant mute toggle and volume control'
    ]
  },
  {
    id: 'media-presentation',
    title: 'Image & Video Presentation',
    tagline: 'Native hardware-accelerated media files.',
    description: 'Import local image files (PNG, JPG, BMP, GIF) and high-definition videos (MP4, MKV, MOV, WMV, AVI) directly into your queue without transcoding.',
    category: 'media',
    badge: 'New in v1.2.0',
    iconName: 'media',
    status: 'IMPLEMENTED',
    highlights: [
      'Native Windows.Media.Playback.MediaPlayer integration',
      'Direct static image rendering with uniform scaling',
      'No format conversion or rendering lag'
    ]
  },
  {
    id: 'audio-volume',
    title: 'Direct Video Audio & Volume Sync',
    tagline: 'Audible local playback with atomic timeline sync.',
    description: 'Audible local sound connected directly to Windows audio endpoints with dedicated volume slider (0–100%) and instant speaker mute on both dashboard and floating dock.',
    category: 'media',
    badge: 'Audio Engine',
    iconName: 'speaker',
    status: 'IMPLEMENTED',
    highlights: [
      'Atomic audio & video seeking, pause, and resume',
      'Instant audio suppression during blackout or source switch',
      'Persistent volume and mute preferences'
    ]
  },
  {
    id: 'switching-modes',
    title: 'Three Source Switching Modes',
    tagline: 'Tailored control over your presenter desktop.',
    description: 'Choose how switching affects your physical desktop layout with Live Only, Active + Live, or Active Only switching behaviors.',
    category: 'core',
    badge: 'Workflow Modes',
    iconName: 'modes',
    status: 'IMPLEMENTED',
    highlights: [
      'Live Only (L): Updates audience view without changing your focus',
      'Active + Live (A+L): Updates live view and brings app forward',
      'Active Only (A): Privately inspects app before sharing'
    ]
  },
  {
    id: 'privacy-blackout',
    title: 'Freeze-Frame & Privacy Blackout',
    tagline: 'Instant presenter privacy at the touch of a key.',
    description: 'Pause live capture to freeze the audience view while you navigate confidential windows, or trigger a 100% opaque Blackout curtain that immediately blanks output and silences audio.',
    category: 'performance',
    badge: 'Privacy & Safety',
    iconName: 'shield',
    hotkey: 'Ctrl + Shift + P / B',
    status: 'IMPLEMENTED',
    highlights: [
      'Freeze-Frame pauses frame updates cleanly',
      'Blackout suspends rendering and silences video audio',
      'Restoring blackout seamlessly resumes previous playback'
    ]
  },
  {
    id: 'global-hotkeys',
    title: 'System-Wide Global Shortcuts',
    tagline: 'Instant control from any application.',
    description: 'Navigate your entire presentation queue using global hotkeys registered across the Windows OS, even when SwitchCast is minimized or running behind fullscreen slides.',
    category: 'core',
    badge: 'Productivity',
    iconName: 'keyboard',
    hotkey: 'Ctrl + Shift + Arrow / 1-5',
    status: 'IMPLEMENTED',
    highlights: [
      'Next / Previous source cycling across mixed queues',
      'Direct index switching (Ctrl + Shift + 1..5)',
      'Background hotkey registration via Win32 WinHook'
    ]
  },
  {
    id: 'local-privacy',
    title: '100% Offline & Zero Telemetry',
    tagline: 'Your presentations never leave your machine.',
    description: 'SwitchCast operates entirely locally on your Windows device. No cloud accounts, no subscription check-ins, no telemetry, and no background network connections.',
    category: 'performance',
    badge: 'Security',
    iconName: 'lock',
    status: 'IMPLEMENTED',
    highlights: [
      'Fully self-contained Windows x64 executable',
      'Zero external cloud dependencies',
      'Confidential and enterprise ready'
    ]
  }
];

export interface ShortcutItem {
  keys: string;
  action: string;
  description: string;
}

export const SHORTCUTS: ShortcutItem[] = [
  { keys: 'Ctrl + Shift + →', action: 'Next Source', description: 'Switches live output to the next queued source' },
  { keys: 'Ctrl + Shift + ←', action: 'Previous Source', description: 'Switches live output to the previous queued source' },
  { keys: 'Ctrl + Shift + 1..5', action: 'Direct Queue Jump', description: 'Instantly switches to queued source index 1 through 5' },
  { keys: 'Ctrl + Shift + P', action: 'Freeze-Frame (Pause)', description: 'Freezes live video frame or capture feed for audience' },
  { keys: 'Ctrl + Shift + B', action: 'Privacy Blackout', description: 'Blanks output canvas and mutes audio immediately' },
  { keys: 'Ctrl + Shift + S', action: 'Stop Presentation', description: 'Safely ends live session and returns output to standby' },
  { keys: 'Ctrl + Shift + D', action: 'Toggle Presenter Dock', description: 'Shows or hides the floating companion toolbar' },
  { keys: 'Ctrl + Shift + M', action: 'Focus Dashboard', description: 'Restores and foregrounds the main SwitchCast dashboard' }
];

export interface UseCaseItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  sourcesExample: string[];
}

export const USE_CASES: UseCaseItem[] = [
  {
    id: 'software-demo',
    title: 'Software Demonstrations',
    subtitle: 'Developers, Solution Architects & Product Managers',
    description: 'Switch cleanly between your code editor (VS Code, Visual Studio), live terminal console, API client, and browser staging environment without managing multiple screen shares or sharing full desktop notifications.',
    icon: 'terminal',
    sourcesExample: ['VS Code (IDE)', 'Windows Terminal', 'Chrome (Staging)', 'Swagger / Postman']
  },
  {
    id: 'online-teaching',
    title: 'Online Teaching & Lectures',
    subtitle: 'Educators, Trainers & Course Instructors',
    description: 'Seamlessly interleave lecture slides, whiteboard apps, code exercises, instructional diagrams, and video walkthroughs with direct audio sync, keeping students engaged and focused.',
    icon: 'book',
    sourcesExample: ['PowerPoint Deck', 'Direct Video (MP4)', 'Browser (Demo)', 'OneNote (Whiteboard)']
  },
  {
    id: 'executive-meetings',
    title: 'Executive & Client Meetings',
    subtitle: 'Consultants, Executives & Sales Engineers',
    description: 'Present financial models, live dashboards, PDF reports, and product videos in client meetings (Zoom, Teams, Meet) while keeping your presenter notes and private chat tabs invisible.',
    icon: 'briefcase',
    sourcesExample: ['PowerBI Dashboard', 'Financial Model (Excel)', 'Product Deck', 'Intro Video (1080p)']
  },
  {
    id: 'webinars-events',
    title: 'Webinars & Live Streams',
    subtitle: 'Broadcasters, Hosts & Keynote Speakers',
    description: 'Maintain broadcast-grade continuity into OBS, vMix, or meeting bridges with instant Privacy Blackout curtains and Freeze-Frame buffers when unexpected technical issues arise.',
    icon: 'broadcast',
    sourcesExample: ['Keynote Slides', 'Sponsor Video', 'Live Demo Display', 'Guest Presentation Window']
  }
];

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    question: 'What is SwitchCast?',
    answer: 'SwitchCast is a high-performance Windows desktop application designed for presenters, educators, and developers. It allows you to select multiple application windows, physical displays, images, and videos into a presentation queue and switch between them instantly while sharing one stable output window in conferencing tools.'
  },
  {
    question: 'How does SwitchCast work with Zoom, Microsoft Teams, and Google Meet?',
    answer: 'Instead of sharing your entire desktop or repeatedly starting and stopping window shares, you open the SwitchCast Presentation Output window and share that single window in Zoom, Teams, Google Meet, Discord, or OBS. Then, inside SwitchCast or via global hotkeys, you switch which application, display, or media file is projected onto that output window.'
  },
  {
    question: 'Can I present images and video files with audio?',
    answer: 'Yes. SwitchCast v1.2.0 introduces native media presentation supporting PNG, JPG, BMP, GIF images and MP4, MKV, MOV, WMV, AVI videos with hardware-accelerated playback. Video audio plays through your local Windows audio endpoints and can be shared in conferencing apps by enabling "Share system audio".'
  },
  {
    question: 'What is the Floating Presenter Dock?',
    answer: 'The Floating Presenter Dock is an ultra-slim, always-on-top toolbar that floats above your active applications. It allows you to switch sources, toggle between Live Only and Active+Live modes, pause/blackout, adjust video volume, and scrub video timelines with live timecodes without having to bring the main SwitchCast dashboard into view.'
  },
  {
    question: 'Does SwitchCast require an internet connection or account?',
    answer: 'No. SwitchCast is 100% offline and operates locally on your PC. It does not require user accounts, subscription keys, cloud servers, or telemetry tracking.'
  },
  {
    question: 'What are the system requirements for SwitchCast?',
    answer: 'SwitchCast requires Windows 10 64-bit (version 1809 / build 17763 or higher) or Windows 11 64-bit, an x64 processor, and a DirectX 11 compatible graphics card or WARP software fallback. The downloadable package is fully self-contained and does not require separate .NET runtime installation.'
  },
  {
    question: 'How do I install SwitchCast?',
    answer: 'SwitchCast is distributed as a standalone, self-contained ZIP package. Simply download SwitchCast-v1.2.0-win-x64.zip from the official releases, extract the archive to any folder on your PC, and run SwitchCast.exe. No admin installer is required.'
  },
  {
    question: 'How can I verify the downloaded ZIP file authenticity?',
    answer: 'Each release includes an official SHA-256 checksum file (.sha256). You can verify your download in PowerShell by running: Get-FileHash .\\SwitchCast-v1.2.0-win-x64.zip -Algorithm SHA256 and confirming it matches the verified release hash (BB8AD7EB346F6372E28FF6F5442072D5D4294F573AE175D73B83333C4C82790D).'
  },
  {
    question: 'Where can I access the source repository and past releases?',
    answer: 'SwitchCast is maintained by John Christopher King Zamora under Jeizi Productions. Official releases and source repository links are hosted at https://github.com/jczamora-git/SwitchCast.'
  }
];
