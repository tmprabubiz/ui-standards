# FE-MEDIA · Audio, video, images and capture

Load when the app plays, shows, records or captures audio, video or images.

## FE-MEDIA-01 · Media preview list

**Purpose:** Let users sample many audio or video items in a list, with one item playing at a time and honest state everywhere.
**Triggers:** play button in list, audio list, recordings list, track list, video list, preview, sample, podcast episodes, now playing, mini player
**Applies when:** a list or grid of media items each has its own play control.
**Composes:** FE-COLL-02, FE-MEDIA-02, FE-SEL-01, BE-FILE-02, BE-FILE-03

**Required**
- R1 Only one item plays at a time: starting one pauses or stops any other, including players elsewhere in the app; nothing autoplays on load, scroll or hover (CORE F7).
- R2 Each item's control is named for the item ("Play Intro.mp3"); it changes to Pause for long-form playback or Stop for a short preview, with state shown as icon plus text, not colour alone.
- R3 Each row shows its duration; the active row shows position and a keyboard-operable seek slider with time as text (WAI-ARIA APG Slider).
- R4 Playing state comes from one source and is reflected everywhere the item appears (row, mini player, detail); re-sorting, filtering or paging the list never resets playback or shows the wrong state.
- R5 A failed item shows an error with Retry on that row and does not block others; loading shows a state, never silence (CORE F4); the list loads metadata only until play is pressed.
- R6 When an item ends it returns to idle; the next item starts only if the user turned on "play next".

**Conditional**
- C1 IF the playing item is deleted or filtered out THEN playback stops and the control resets.
- C2 IF the tab is hidden or the screen locks THEN audio may continue and operating-system media controls show title and Play or Pause (Media Session); video pauses.
- C3 IF a queue or playlist exists THEN the current track is marked and "play next" is an explicit setting.
- C4 IF thumbnails or waveforms animate THEN they are static under reduced motion (CORE F7).
- C5 IF items are short previews THEN the active control says Stop and returns the item to idle; long-form playback uses Pause so the owner can resume.

**Suggest**
- S1 A mini player that stays visible across screens — lets people keep listening while they browse.
- S2 Remember the position of each item — lets people resume where they stopped.
- S3 Playback speed — helps with long speech.

**Approval**
- A1 Automatically playing the next item after one ends — it can surprise people and use data.

**Backend contract**
- The list returns duration, type and a time-limited playable address (BE-FILE-02) once the media is ready (BE-FILE-03); the media address supports range requests for seeking.

**Acceptance**
- [ ] Given item A is playing, when the user presses Play on item B, then A pauses and only B plays.
- [ ] Given the page loads, when it renders, then no media plays and no sound starts.
- [ ] Given item A is playing, when the user changes the list sort order, then A keeps playing and its row still shows playing.
- [ ] Given item A fails to load, when the error shows, then A has a Retry and other items remain playable.

**Exceptions**
- A page with a single media item uses FE-MEDIA-02 only.

**Source:** WCAG 2.2 SC 1.4.2 Audio Control, 4.1.2 (standard); WAI-ARIA APG Slider pattern; HTML media elements and Media Session specification (standard); Spotify, SoundCloud (convention)

## FE-MEDIA-02 · Audio and video player

**Purpose:** Provide a full player with controls, captions and keyboard shortcuts that everyone can operate.
**Triggers:** audio player, video player, play, pause, seek, volume, fullscreen, captions, subtitles, transcript, playback speed, buffering
**Applies when:** the app plays a single audio or video item with controls.
**Composes:** FE-MEDIA-01, FE-FEED-04, BE-FILE-02, BE-FILE-03

**Required**
- R1 All controls (play or pause, seek, volume and mute, fullscreen and captions for video) are keyboard operable, named, and show visible focus (WCAG 2.2 SC 2.1.1, 4.1.2; CORE F1).
- R2 The seek bar is a slider whose value reads as text ("1:05 of 3:20") and works by pointer and keyboard.
- R3 Shortcuts work while the player has focus and are listed in a help control: Space or K play and pause, Left and Right 5 seconds, J and L 10 seconds, Up and Down volume, M mute, F fullscreen, C captions, Home and End to start and end (SC 2.1.4: only active when the player is focused).
- R4 Nothing plays with sound on load (CORE F7); volume and mute are remembered; buffering shows an indicator; a load error shows Retry and a download link (CORE F4).
- R5 Video with speech has captions the user can switch on and off, and audio-only content has a transcript where the owner provides one (SC 1.2.1, 1.2.2); the caption toggle shows its state.
- R6 Controls stay visible while focused and appear on tap for touch users; control targets are large enough for fingers.

**Conditional**
- C1 IF the item is long THEN resume from the last position with "Resume from 12:30" and "Start over".
- C2 IF the browser cannot play the format THEN say so and offer a download.
- C3 IF fullscreen or picture-in-picture is used THEN Escape exits and focus returns to the control used.
- C4 IF the video is user-supplied THEN a poster frame shows before play and it does not autoplay.

**Suggest**
- S1 Playback speed — helps people who listen faster or slower.
- S2 Preview thumbnails while scrubbing video — makes finding a moment easier.
- S3 A download button for the original file, shown to its owner — lets people keep a copy.

**Approval**
- A1 Letting people other than the owner download the original (for example a shared editor) — raises copyright and permission questions.

**Backend contract**
- Media is served from access-controlled addresses with range requests (BE-FILE-02) in browser-playable formats (BE-FILE-03); caption files are stored with the media.

**Acceptance**
- [ ] Given a keyboard user focuses the player, when they press Space, then playback toggles and the control label updates.
- [ ] Given the player at 1:05 of 3:20, when a screen reader reads the seek slider, then it announces "1:05 of 3:20".
- [ ] Given a video with captions, when the user presses C, then captions switch on and the toggle shows it.
- [ ] Given the media fails to load, when the error shows, then Retry and a download link are offered.

**Exceptions**
- Short decorative looping video without sound may play automatically only if it can be paused and obeys reduced motion.

**Source:** WCAG 2.2 SC 1.2.1, 1.2.2, 1.4.2, 2.1.1, 2.1.4 (standard); WAI-ARIA APG Media Seek Slider; HTML media elements (standard); YouTube keyboard shortcuts (convention)

## FE-MEDIA-03 · Image gallery and lightbox

**Purpose:** Browse images as a grid and view each one larger with easy navigation and zoom.
**Triggers:** gallery, photos, image grid, lightbox, zoom, slideshow, thumbnails, carousel, image viewer, alt text, album
**Applies when:** users view several images or open images larger.
**Composes:** FE-COLL-02, FE-COLL-05, FE-FEED-02, FE-FEED-03, BE-FILE-02, BE-FILE-03

**Required**
- R1 Thumbnails are links or buttons named after the image's description or title; the grid reflows (FE-COLL-02) and reserves space so loading causes no layout jump.
- R2 Every meaningful image has a text alternative and decorative ones have none (WCAG 2.2 SC 1.1.1); for user-uploaded images the app asks for a description or falls back to the caption or file name, never the word "image".
- R3 The lightbox is a modal dialog (FE-FEED-03): focus moves in and is trapped, Escape closes it, and focus returns to the thumbnail used.
- R4 Previous and Next buttons and the Left and Right arrow keys move between images; a position such as "3 of 24" is shown as text; swiping works on touch.
- R5 Images load progressively with a placeholder, the full-size file loads on demand, and a failed image shows a placeholder with Retry (CORE F4).
- R6 Zoom works by pinch, double-tap or Plus and Minus buttons; page zoom is not blocked; a zoomed image can be moved with arrow keys.

**Conditional**
- C1 IF images have captions or metadata THEN title, caption and date show in the lightbox.
- C2 IF delete or download exists in the lightbox THEN the controls are named for the image and delete follows FE-FEED-02.
- C3 IF there are many images THEN they load in increments (FE-COLL-05) and the lightbox keeps loading as the user advances.
- C4 IF a slideshow exists THEN it is off by default and has a visible Pause control (WCAG 2.2 SC 2.2.2, CORE F7).

**Suggest**
- S1 A slideshow mode with pause — gives a relaxed way to view an album.
- S2 Download the original — lets people keep full quality.
- S3 Preload the next image — makes browsing feel instant.

**Approval**
- A1 Keeping or showing photo location data (GPS) found in image files — it can reveal where people live.

**Backend contract**
- Images are served as resized versions (thumbnail, display, original) (BE-FILE-03) through access-checked addresses (BE-FILE-02); the description and caption are stored with the item; location metadata is removed from shared images.

**Acceptance**
- [ ] Given a thumbnail grid, when the user opens an image, then a lightbox appears with focus inside it.
- [ ] Given the lightbox is open, when the user presses the Right arrow, then the next image shows and the position text updates.
- [ ] Given the lightbox is open, when the user presses Escape, then it closes and focus returns to the opened thumbnail.
- [ ] Given an image fails to load, when the grid renders, then a placeholder with Retry shows and other images are unaffected.

**Exceptions**
- A single hero image does not need gallery navigation; still provide a text alternative.

**Source:** WCAG 2.2 SC 1.1.1, 2.1.2, 2.2.2 (standard); WAI-ARIA APG Dialog (Modal) and Carousel patterns (standard); W3C WAI Images tutorial (standard); Google Photos (convention)

## FE-MEDIA-04 · Recording and capture

**Purpose:** Record from the microphone, camera or screen with clear permission steps, visible recording state and no lost recordings.
**Triggers:** record, microphone, camera, voice recording, webcam, screen capture, permission denied, allow microphone, capture video, record audio
**Applies when:** the app captures audio, video, photos or the screen from the user's device.
**Composes:** FE-FORM-04, FE-FEED-02, FE-FEED-04, FE-FORM-05, BE-FILE-01, BE-FILE-03, BE-FILE-04

**Required**
- R1 Permission is requested only after the user chooses Record, preceded by a one-line reason ("To record, we need your microphone"), never on page load; capture needs a secure connection (HTTPS).
- R2 Each permission state has its own message: waiting for the browser prompt, granted, denied (with steps to re-enable it for the current browser and a fallback such as uploading a file), no device found, device busy or failed, and unsupported browser.
- R3 While capturing, a clear indicator shows it is live: a red dot plus the word "Recording" and elapsed time, not colour alone; a level meter shows audio; start and stop are announced politely.
- R4 Controls are Record, Pause and Resume where supported, and Stop; after stopping the user can play back, Re-record or Discard (confirmed when long, FE-FEED-02), and Save; nothing is uploaded or kept until the user confirms.
- R5 Recordings are protected from loss: interrupted work is held locally or navigating away warns (CORE F8); the microphone and camera are released when stopped, on error, and when leaving the screen.
- R6 Maximum length or size is shown with a countdown near the limit; reaching it stops cleanly, keeps what was recorded and says so.
- R7 When several devices exist the user can choose one and the choice is remembered; video capture shows a preview before starting.

**Conditional**
- C1 IF video is captured THEN the preview may be mirrored but the saved video is not, and both orientations work.
- C2 IF the screen is captured THEN the user sees what is shared, and ending sharing from the browser's own control ends the recording cleanly.
- C3 IF the recording is uploaded THEN FE-FORM-04 upload rules and FE-FEED-04 progress apply.
- C4 IF the device is a phone THEN also offer the system's own capture through a file chooser as a fallback.

**Suggest**
- S1 A microphone test before recording — avoids wasted takes with a muted device.
- S2 A 3-2-1 countdown before starting — gives people time to get ready.
- S3 Trim the start and end after recording — fixes small mistakes without re-recording.

**Approval**
- A1 Recording that includes other people's voices or faces — consent rules may apply.
- A2 Saving recordings to the server before the user confirms — it stores private content they may reject.

**Backend contract**
- The upload accepts the recording with type, size and duration limits (BE-FILE-01); long recordings upload in resumable parts (BE-FILE-04); processing converts to a standard format and reads duration (BE-FILE-03).

**Acceptance**
- [ ] Given the page loads, when it renders, then no permission prompt appears until the user presses Record.
- [ ] Given the user denies the microphone, when the app detects it, then a message explains how to re-enable it and offers an upload instead.
- [ ] Given recording is live, when the user looks at the screen, then a "Recording" label with elapsed time is visible.
- [ ] Given the user stops and presses Discard, when confirmed, then the recording is removed and the microphone is released.

**Exceptions**
- Apps that only let users upload existing files need no capture flow.

**Source:** W3C MediaStream Recording, Media Capture and Streams, Permissions API and HTML Media Capture (standard); WCAG 2.2 SC 4.1.3, 1.4.1 (standard); Apple HIG Privacy and requesting permission (convention)
