/**
 * Web Audio API utility for generating soft tones.
 * No external audio files needed — everything is synthesized in-browser.
 */

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/**
 * Play a soft sine-wave chime.
 * @param frequency - Hz (default 396 — soothing low tone)
 * @param duration - seconds (default 0.6)
 * @param volume - 0-1 (default 0.15 — very quiet for bedtime)
 */
export function playChime(
  frequency: number = 396,
  duration: number = 0.6,
  volume: number = 0.15
): void {
  try {
    const ctx = getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Gentle fade-in and fade-out
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available — fail silently
  }
}

/**
 * Play a breathing transition chime.
 * Different frequencies for inhale/hold/exhale transitions.
 */
export function playBreathingCue(phase: 'inhale' | 'hold' | 'exhale'): void {
  const freqs: Record<string, number> = {
    inhale: 528,
    hold: 396,
    exhale: 264,
  };
  playChime(freqs[phase], 0.4, 0.1);
}

/**
 * Try to trigger haptic vibration (mobile only).
 * @param pattern - vibration pattern in ms
 */
export function vibrate(pattern: number | number[] = 50): void {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Not supported — fail silently
  }
}
