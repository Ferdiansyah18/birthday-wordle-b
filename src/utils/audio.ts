/**
 * Audio utility for generating sound effects using Web Audio API
 * Since we can't include actual audio files, we generate simple tones
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a simple tone
 */
function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.15) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    // Silently fail if audio context is not available
  }
}

/**
 * Key press sound - soft click
 */
export function playKeySound() {
  playTone(800, 0.05, 'sine', 0.08);
}

/**
 * Tile flip sound - satisfying flip
 */
export function playFlipSound() {
  playTone(600, 0.1, 'sine', 0.1);
  setTimeout(() => playTone(900, 0.08, 'sine', 0.08), 50);
}

/**
 * Correct guess sound - happy ascending
 */
export function playCorrectSound() {
  playTone(523, 0.15, 'sine', 0.12);
  setTimeout(() => playTone(659, 0.15, 'sine', 0.12), 100);
  setTimeout(() => playTone(784, 0.2, 'sine', 0.12), 200);
}

/**
 * Error/shake sound
 */
export function playErrorSound() {
  playTone(200, 0.15, 'square', 0.08);
  setTimeout(() => playTone(180, 0.15, 'square', 0.06), 80);
}

/**
 * Victory fanfare - celebratory
 */
export function playVictorySound() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, 'sine', 0.1), i * 150);
  });
}

/**
 * Candle blow out sound
 */
export function playBlowOutSound() {
  playTone(300, 0.3, 'sine', 0.08);
  setTimeout(() => playTone(200, 0.4, 'sine', 0.05), 100);
}

/**
 * Birthday melody - simple happy birthday tune
 */
export function playBirthdayMelody() {
  // Simplified Happy Birthday melody
  const melody = [
    { freq: 264, dur: 0.3 },  // Happy
    { freq: 264, dur: 0.15 }, // Birth-
    { freq: 297, dur: 0.4 },  // -day
    { freq: 264, dur: 0.4 },  // to
    { freq: 352, dur: 0.4 },  // you
    { freq: 330, dur: 0.8 },  // ~
    
    { freq: 264, dur: 0.3 },  // Happy
    { freq: 264, dur: 0.15 }, // Birth-
    { freq: 297, dur: 0.4 },  // -day
    { freq: 264, dur: 0.4 },  // to
    { freq: 396, dur: 0.4 },  // you
    { freq: 352, dur: 0.8 },  // ~
    
    { freq: 264, dur: 0.3 },  // Happy
    { freq: 264, dur: 0.15 }, // Birth-
    { freq: 528, dur: 0.4 },  // -day
    { freq: 440, dur: 0.4 },  // dear
    { freq: 352, dur: 0.4 },  // [name]
    { freq: 330, dur: 0.4 },  // ~
    { freq: 297, dur: 0.8 },  // ~
    
    { freq: 470, dur: 0.3 },  // Happy
    { freq: 470, dur: 0.15 }, // Birth-
    { freq: 440, dur: 0.4 },  // -day
    { freq: 352, dur: 0.4 },  // to
    { freq: 396, dur: 0.4 },  // you
    { freq: 352, dur: 0.8 },  // ~
  ];

  let time = 0;
  melody.forEach((note) => {
    setTimeout(() => {
      playTone(note.freq, note.dur, 'sine', 0.08);
    }, time * 1000);
    time += note.dur + 0.05;
  });
}

/**
 * Envelope open sound
 */
export function playEnvelopeSound() {
  playTone(400, 0.15, 'sine', 0.08);
  setTimeout(() => playTone(500, 0.15, 'sine', 0.1), 80);
  setTimeout(() => playTone(600, 0.2, 'sine', 0.08), 160);
}
