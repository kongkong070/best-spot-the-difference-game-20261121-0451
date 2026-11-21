// audio.js — tiny synthesized sounds via WebAudio. No audio files:
// every effect is an oscillator, so the game loads nothing over the
// network and works offline.

let audioCtx = null;

export function ensureAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      audioCtx = null;
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, startIn, duration, type = 'sine', volume = 0.12) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = ctx.currentTime + startIn;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

// A bright two-note chime when a difference is found.
export function playFound() {
  tone(660, 0, 0.16, 'sine', 0.14);
  tone(990, 0.09, 0.24, 'sine', 0.14);
}

// A low buzz for a wrong click.
export function playWrong() {
  tone(160, 0, 0.22, 'square', 0.06);
}

// A rising arpeggio for finishing a level.
export function playWin() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.12));
}

// A soft tick when a hint is used.
export function playHint() {
  tone(880, 0, 0.1, 'sine', 0.08);
  tone(1175, 0.08, 0.14, 'sine', 0.08);
}
