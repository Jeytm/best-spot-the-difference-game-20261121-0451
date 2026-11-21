// audio.js — all sounds are WebAudio tones generated in code. No audio files.

let ctx = null;

function ensureContext() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq, startAt, dur, type, vol) {
  const ac = ensureContext();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(vol, ac.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + dur + 0.05);
}

// A warm two-note chime when a difference is found.
export function playFind() {
  tone(660, 0, 0.16, 'sine', 0.16);
  tone(990, 0.09, 0.24, 'sine', 0.14);
}

// A soft low buzz for a wrong tap.
export function playMiss() {
  tone(160, 0, 0.18, 'triangle', 0.12);
  tone(120, 0.05, 0.2, 'triangle', 0.1);
}

// A short shimmer when a hint is spent.
export function playHint() {
  tone(520, 0, 0.12, 'sine', 0.1);
  tone(780, 0.08, 0.16, 'sine', 0.1);
}

// A rising arpeggio when a scene is cleared.
export function playWin() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.28, 'sine', 0.14));
}

// A low tick when the timer drops under ten seconds.
export function playTick() {
  tone(880, 0, 0.06, 'square', 0.05);
}
