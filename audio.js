
// =================================================================
// AUDIO MANAGEMENT - Casino Ambiance and Sound Effects
// =================================================================

// Note: Using real audio files from a CDN or local source is recommended.
// These are placeholder functions. I will add web audio API placeholders to simulate sounds.

// Create an AudioContext
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// --- Sound Effect Functions ---

function playSound(type, duration = 0.5, frequency = 440) {
    if (!audioCtx) return;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    let waveType = 'sine';
    let startFreq = frequency;
    let endFreq = frequency;
    let startGain = 0.3;
    let endGain = 0.001;

    switch (type) {
        case 'click':
            waveType = 'triangle';
            startFreq = 600;
            endFreq = 600;
            duration = 0.1;
            break;
        case 'spin':
            waveType = 'sawtooth';
            startFreq = 200;
            endFreq = 800;
            duration = 0.4;
            startGain = 0.2;
            break;
        case 'win':
            waveType = 'triangle';
            startFreq = 523.25; // C5
            endFreq = 1046.50; // C6
            duration = 0.8;
            startGain = 0.4;
            break;
        case 'lose':
            waveType = 'square';
            startFreq = 220;
            endFreq = 110;
            duration = 1.0;
            startGain = 0.2;
            break;
    }

    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + duration);

    gainNode.gain.setValueAtTime(startGain, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(endGain, audioCtx.currentTime + duration);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}


// --- Global Sound Functions ---
// These can be called from main.js

function playClickSound() {
    playSound('click');
}

function playSpinSound() {
    playSound('spin');
}

function playWinSound() {
    playSound('win', 1.0);
}

function playLoseSound() {
    playSound('lose', 1.2);
}

