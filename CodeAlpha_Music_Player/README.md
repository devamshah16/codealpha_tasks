# Task-4: Music Player

A music player built with HTML, CSS, and JavaScript featuring full audio controls and a playlist.

## Features

- **Playback controls** — Play, pause, next, and previous track
- **Track info** — Displays song title, artist, and duration
- **Progress bar** — Seekable scrubber with current time and total duration
- **Volume control** — Slider with mute toggle and percentage display
- **Playlist** — Click any track to play; active track is highlighted
- **Autoplay** — Toggle to automatically play the next song when one ends
- **Keyboard shortcuts** — Space, arrow keys, and mute shortcut
- **Styling** — Dark theme matching Task-1 & Task-2, responsive layout

## How to run

Open `index.html` in a web browser.

Or use a local server:

```bash
cd Task-4
npx serve .
```

> **Note:** Tracks stream from SoundHelix demo MP3s and require an internet connection.

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / pause |
| `←` | Previous track |
| `→` | Next track |
| `M` | Mute / unmute |

## Files

| File | Purpose |
|------|---------|
| `index.html` | Player layout, controls, and playlist structure |
| `styles.css` | Layout, theming, and responsive design |
| `script.js` | Audio logic, playlist, progress, volume, and autoplay |
