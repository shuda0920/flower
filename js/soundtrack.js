// --- Soundtrack Player ---
const soundtrackAudio = document.getElementById('soundtrack-audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const currentTimeDisplay = document.querySelector('.current-time');
const totalTimeDisplay = document.querySelector('.total-time');
const vinylRecord = document.querySelector('.vinyl-record');
const trackItems = document.querySelectorAll('.track-item');

// Mock audio duration for demo (since we don't have real audio files)
let isPlaying = false;
let currentTrack = 0;
let mockDuration = 272; // 4:32 in seconds
let mockCurrentTime = 0;
let playInterval;

// Format time helper
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Play/Pause functionality
if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlay);
}

function togglePlay() {
    isPlaying = !isPlaying;

    if (isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        vinylRecord.classList.add('playing');
        startMockPlayback();

        // In production with real audio files, use:
        // soundtrackAudio.play();
    } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        vinylRecord.classList.remove('playing');
        stopMockPlayback();

        // In production with real audio files, use:
        // soundtrackAudio.pause();
    }
}

// Mock playback (simulates audio progress)
function startMockPlayback() {
    playInterval = setInterval(() => {
        if (mockCurrentTime < mockDuration) {
            mockCurrentTime += 0.1;
            updateProgress();
        } else {
            // Song finished, play next track or stop
            mockCurrentTime = 0;
            isPlaying = false;
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            vinylRecord.classList.remove('playing');
            stopMockPlayback();
        }
    }, 100);
}

function stopMockPlayback() {
    if (playInterval) {
        clearInterval(playInterval);
    }
}

function updateProgress() {
    const percentage = (mockCurrentTime / mockDuration) * 100;
    progressFill.style.width = percentage + '%';
    currentTimeDisplay.textContent = formatTime(mockCurrentTime);
}

// Progress bar click to seek
if (progressBar) {
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        mockCurrentTime = percentage * mockDuration;
        updateProgress();

        // In production with real audio files, use:
        // soundtrackAudio.currentTime = percentage * soundtrackAudio.duration;
    });
}

// Track selection
trackItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        // Remove active class from all tracks
        trackItems.forEach(t => t.classList.remove('active'));

        // Add active class to clicked track
        item.classList.add('active');

        // Update current track
        currentTrack = index;

        // Reset and update durations based on track
        const durations = [272, 225, 258]; // 4:32, 3:45, 4:18
        mockDuration = durations[index];
        mockCurrentTime = 0;
        totalTimeDisplay.textContent = formatTime(mockDuration);
        updateProgress();

        // Auto-play new track
        if (!isPlaying) {
            togglePlay();
        }

        // In production, update audio source:
        // const tracks = ['audio/track1.mp3', 'audio/track2.mp3', 'audio/track3.mp3'];
        // soundtrackAudio.src = tracks[index];
        // soundtrackAudio.load();
        // soundtrackAudio.play();
    });
});

// ===== If using real audio files, uncomment these event listeners =====

// soundtrackAudio.addEventListener('timeupdate', () => {
//     const percentage = (soundtrackAudio.currentTime / soundtrackAudio.duration) * 100;
//     progressFill.style.width = percentage + '%';
//     currentTimeDisplay.textContent = formatTime(soundtrackAudio.currentTime);
// });

// soundtrackAudio.addEventListener('loadedmetadata', () => {
//     totalTimeDisplay.textContent = formatTime(soundtrackAudio.duration);
// });

// soundtrackAudio.addEventListener('ended', () => {
//     isPlaying = false;
//     playIcon.classList.remove('hidden');
//     pauseIcon.classList.add('hidden');
//     vinylRecord.classList.remove('playing');
// });

// soundtrackAudio.addEventListener('play', () => {
//     isPlaying = true;
//     playIcon.classList.add('hidden');
//     pauseIcon.classList.remove('hidden');
//     vinylRecord.classList.add('playing');
// });

// soundtrackAudio.addEventListener('pause', () => {
//     isPlaying = false;
//     playIcon.classList.remove('hidden');
//     pauseIcon.classList.add('hidden');
//     vinylRecord.classList.remove('playing');
// });
