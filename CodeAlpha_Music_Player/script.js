/**
 * Task-4: Music Player
 * Audio control, playlist, progress bar, volume, and autoplay.
 */

const PLAYLIST = [
  {
    title: "Midnight Drive",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    gradient: ["#7c6cf0", "#4a3f9f"],
  },
  {
    title: "Neon Horizon",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    gradient: ["#6c9cf0", "#3f5f9f"],
  },
  {
    title: "Golden Hour",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    gradient: ["#f0a86c", "#9f6f3f"],
  },
  {
    title: "Starlit Echo",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    gradient: ["#6cf0b8", "#3f9f7a"],
  },
  {
    title: "Velvet Sky",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    gradient: ["#f06cc4", "#9f3f7a"],
  },
];

const audio = document.getElementById("audio");
const albumArt = document.getElementById("albumArt");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const progressBar = document.getElementById("progressBar");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const muteBtn = document.getElementById("muteBtn");
const volumeBar = document.getElementById("volumeBar");
const volumeValue = document.getElementById("volumeValue");
const autoplayToggle = document.getElementById("autoplayToggle");
const playlistEl = document.getElementById("playlist");
const playlistCount = document.getElementById("playlistCount");
const playerEl = document.querySelector(".player");

const albumArtGlow = document.getElementById("albumArtGlow");

let currentIndex = 0;
let isSeeking = false;
let lastVolume = 80;
let isMuted = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function setAlbumGradient(gradient) {
  albumArt.style.background = `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`;
  albumArtGlow.style.setProperty("--track-glow", `radial-gradient(circle, ${gradient[0]}55 0%, transparent 70%)`);
}

function updatePlayPauseUI(isPlaying) {
  playPauseBtn.classList.toggle("is-playing", isPlaying);
  playPauseBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
  playPauseBtn.setAttribute("aria-pressed", String(isPlaying));
  playerEl.classList.toggle("is-playing", isPlaying);
}

function updateMuteUI() {
  isMuted = audio.muted;
  muteBtn.classList.toggle("is-muted", isMuted);
  muteBtn.setAttribute("aria-label", isMuted ? "Unmute" : "Mute");
  muteBtn.setAttribute("aria-pressed", String(isMuted));
  volumeValue.textContent = isMuted ? "0%" : `${Math.round(audio.volume * 100)}%`;
}

function renderPlaylist() {
  playlistCount.textContent = `${PLAYLIST.length} track${PLAYLIST.length === 1 ? "" : "s"}`;
  playlistEl.innerHTML = PLAYLIST.map((track, index) => `
    <li
      class="playlist-item${index === currentIndex ? " active" : ""}"
      data-index="${index}"
      role="button"
      tabindex="0"
      aria-label="Play ${track.title} by ${track.artist}"
    >
      <div class="playlist-item-art" style="background: linear-gradient(135deg, ${track.gradient[0]} 0%, ${track.gradient[1]} 100%)">♪</div>
      <div class="playlist-item-info">
        <div class="playlist-item-title">${track.title}</div>
        <div class="playlist-item-artist">${track.artist}</div>
      </div>
      <span class="playlist-item-duration" data-duration-index="${index}">—</span>
    </li>
  `).join("");
}

function highlightActiveTrack() {
  playlistEl.querySelectorAll(".playlist-item").forEach((item, index) => {
    item.classList.toggle("active", index === currentIndex);
  });
}

function loadTrack(index, autoplay = false) {
  currentIndex = index;
  const track = PLAYLIST[currentIndex];

  audio.src = track.src;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  setAlbumGradient(track.gradient);
  highlightActiveTrack();

  progressBar.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";

  if (autoplay) {
    audio.play().catch(() => updatePlayPauseUI(false));
  } else {
    updatePlayPauseUI(false);
  }
}

function togglePlayPause() {
  if (audio.paused) {
    audio.play().catch(() => updatePlayPauseUI(false));
  } else {
    audio.pause();
  }
}

function playPrevious() {
  const nextIndex = currentIndex === 0 ? PLAYLIST.length - 1 : currentIndex - 1;
  loadTrack(nextIndex, !audio.paused);
}

function playNext() {
  const nextIndex = currentIndex === PLAYLIST.length - 1 ? 0 : currentIndex + 1;
  loadTrack(nextIndex, !audio.paused || autoplayToggle.checked);
}

function setVolume(value) {
  const clamped = Math.max(0, Math.min(100, value));
  volumeBar.value = clamped;
  audio.volume = clamped / 100;

  if (clamped > 0) {
    lastVolume = clamped;
    audio.muted = false;
  }

  updateMuteUI();
}

function toggleMute() {
  if (isMuted) {
    audio.muted = false;
    audio.volume = (lastVolume || Number(volumeBar.value) || 80) / 100;
    volumeBar.value = lastVolume || 80;
  } else {
    lastVolume = Number(volumeBar.value) || lastVolume || 80;
    audio.muted = true;
  }

  updateMuteUI();
}

function preloadDurations() {
  PLAYLIST.forEach((track, index) => {
    const temp = new Audio();
    temp.preload = "metadata";
    temp.src = track.src;
    temp.addEventListener("loadedmetadata", () => {
      const el = playlistEl.querySelector(`[data-duration-index="${index}"]`);
      if (el) el.textContent = formatTime(temp.duration);
    });
  });
}

function init() {
  renderPlaylist();
  setVolume(Number(volumeBar.value));
  loadTrack(0, false);
  preloadDurations();

  playPauseBtn.addEventListener("click", togglePlayPause);
  prevBtn.addEventListener("click", playPrevious);
  nextBtn.addEventListener("click", playNext);
  muteBtn.addEventListener("click", toggleMute);

  volumeBar.addEventListener("input", (e) => setVolume(Number(e.target.value)));

  progressBar.addEventListener("input", () => {
    isSeeking = true;
    const time = (progressBar.value / 100) * audio.duration;
    currentTimeEl.textContent = formatTime(time);
  });

  progressBar.addEventListener("change", () => {
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
    isSeeking = false;
  });

  audio.addEventListener("play", () => updatePlayPauseUI(true));
  audio.addEventListener("pause", () => updatePlayPauseUI(false));

  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    if (isSeeking || !Number.isFinite(audio.duration)) return;
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("ended", () => {
    if (autoplayToggle.checked) {
      playNext();
    } else {
      updatePlayPauseUI(false);
      progressBar.value = 0;
      currentTimeEl.textContent = "0:00";
    }
  });

  playlistEl.addEventListener("click", (e) => {
    const item = e.target.closest(".playlist-item");
    if (!item) return;
    const index = Number(item.dataset.index);
    if (index === currentIndex) {
      togglePlayPause();
    } else {
      loadTrack(index, true);
    }
  });

  playlistEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const item = e.target.closest(".playlist-item");
    if (!item) return;
    e.preventDefault();
    item.click();
  });

  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input")) return;

    switch (e.key) {
      case " ":
        e.preventDefault();
        togglePlayPause();
        break;
      case "ArrowLeft":
        playPrevious();
        break;
      case "ArrowRight":
        playNext();
        break;
      case "m":
      case "M":
        toggleMute();
        break;
      default:
        break;
    }
  });
}

init();
