import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import { playBreathingCue, vibrate } from '../lib/audio';

interface BreathingPattern {
  name: string;
  label: string;
  inhale: number;
  hold: number;
  exhale: number;
}

const PATTERNS: BreathingPattern[] = [
  { name: '4-7-8', label: '4-7-8 Relaxing', inhale: 4, hold: 7, exhale: 8 },
  { name: 'box', label: 'Box Breathing', inhale: 4, hold: 4, exhale: 4 },
  { name: 'calm', label: '4-4-6 Calming', inhale: 4, hold: 4, exhale: 6 },
];

type Phase = 'inhale' | 'hold' | 'exhale' | 'idle';

const PHASE_LABELS: Record<Phase, string> = {
  inhale: 'Breathe in…',
  hold: 'Hold…',
  exhale: 'Breathe out…',
  idle: 'Ready when you are',
};

const PHASE_COLORS: Record<Phase, string> = {
  inhale: 'var(--color-drift-orb-inhale)',
  hold: 'var(--color-drift-orb-hold)',
  exhale: 'var(--color-drift-orb-exhale)',
  idle: 'var(--color-drift-text-dim)',
};

export default function BreathingExercise() {
  const [patternIdx, setPatternIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const phaseRef = useRef<Phase>('idle');
  const countdownRef = useRef(0);
  const patternRef = useRef(PATTERNS[0]);

  const pattern = PATTERNS[patternIdx];

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const triggerFeedback = useCallback(
    (p: Phase) => {
      if (audioEnabled && p !== 'idle') playBreathingCue(p);
      if (hapticEnabled) vibrate(p === 'inhale' ? [30, 20, 30] : 40);
    },
    [audioEnabled, hapticEnabled]
  );

  const startPhase = useCallback(
    (p: Phase, dur: number) => {
      phaseRef.current = p;
      countdownRef.current = dur;
      setPhase(p);
      setCountdown(dur);
      triggerFeedback(p);
    },
    [triggerFeedback]
  );

  const tick = useCallback(() => {
    countdownRef.current -= 1;
    setCountdown(countdownRef.current);

    if (countdownRef.current <= 0) {
      const pat = patternRef.current;
      if (phaseRef.current === 'inhale') {
        startPhase('hold', pat.hold);
      } else if (phaseRef.current === 'hold') {
        startPhase('exhale', pat.exhale);
      } else if (phaseRef.current === 'exhale') {
        setCycles((c) => c + 1);
        startPhase('inhale', pat.inhale);
      }
    }
  }, [startPhase]);

  const start = useCallback(() => {
    patternRef.current = PATTERNS[patternIdx];
    setRunning(true);
    setCycles(0);
    startPhase('inhale', PATTERNS[patternIdx].inhale);
    clearTimer();
    intervalRef.current = window.setInterval(tick, 1000);
  }, [patternIdx, startPhase, tick]);

  const stop = useCallback(() => {
    setRunning(false);
    setPhase('idle');
    setCountdown(0);
    clearTimer();
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  // Calculate orb scale for animation
  const orbScale = (() => {
    if (phase === 'idle') return 0.6;
    if (phase === 'inhale') {
      const progress = 1 - countdown / pattern.inhale;
      return 0.6 + 0.4 * progress;
    }
    if (phase === 'hold') return 1;
    if (phase === 'exhale') {
      const progress = 1 - countdown / pattern.exhale;
      return 1 - 0.4 * progress;
    }
    return 0.6;
  })();

  return (
    <div class="breathe">
      <div class="breathe__orb-container">
        <div
          class="breathe__orb"
          style={{
            transform: `scale(${orbScale})`,
            background: `radial-gradient(circle, ${PHASE_COLORS[phase]}40 0%, ${PHASE_COLORS[phase]}10 70%, transparent 100%)`,
            boxShadow: `0 0 ${running ? 40 : 20}px ${PHASE_COLORS[phase]}30`,
          }}
          role="img"
          aria-label={`Breathing orb: ${PHASE_LABELS[phase]}`}
        >
          <div class="breathe__orb-inner" style={{
            background: `radial-gradient(circle, ${PHASE_COLORS[phase]}60 0%, transparent 70%)`,
          }} />
        </div>
      </div>

      <div class="breathe__info" aria-live="assertive" aria-atomic="true">
        <p class="breathe__phase">{PHASE_LABELS[phase]}</p>
        {running && <p class="breathe__countdown">{countdown}</p>}
        {running && (
          <p class="breathe__cycles">
            Cycle {cycles + 1}
          </p>
        )}
      </div>

      <div class="breathe__controls">
        <button
          class={`drift-btn ${running ? 'drift-btn-ghost' : 'drift-btn-primary'}`}
          onClick={running ? stop : start}
        >
          {running ? 'Stop' : 'Begin'}
        </button>
      </div>

      <div class="breathe__settings">
        <div class="breathe__pattern-selector" role="radiogroup" aria-label="Breathing pattern">
          {PATTERNS.map((p, i) => (
            <button
              key={p.name}
              class={`breathe__pattern-btn ${i === patternIdx ? 'breathe__pattern-btn--active' : ''}`}
              onClick={() => { if (!running) setPatternIdx(i); }}
              disabled={running}
              role="radio"
              aria-checked={i === patternIdx}
            >
              <span class="breathe__pattern-name">{p.label}</span>
              <span class="breathe__pattern-timing">{p.inhale}-{p.hold}-{p.exhale}</span>
            </button>
          ))}
        </div>

        <div class="breathe__toggles">
          <label class="breathe__toggle">
            <input
              type="checkbox"
              checked={audioEnabled}
              onChange={() => setAudioEnabled(!audioEnabled)}
            />
            <span>Sound cues</span>
          </label>
          <label class="breathe__toggle">
            <input
              type="checkbox"
              checked={hapticEnabled}
              onChange={() => setHapticEnabled(!hapticEnabled)}
            />
            <span>Vibration</span>
          </label>
        </div>
      </div>

      <style>{`
        .breathe {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          padding: 2rem 1rem;
          min-height: 60vh;
        }

        .breathe__orb-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 200px;
          height: 200px;
          margin: 1rem 0;
        }

        .breathe__orb {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 1s ease-in-out, background 0.8s ease, box-shadow 1s ease;
        }

        .breathe__orb-inner {
          width: 60%;
          height: 60%;
          border-radius: 50%;
          transition: background 0.8s ease;
        }

        .breathe__info {
          text-align: center;
          min-height: 5rem;
        }

        .breathe__phase {
          font-size: 1.25rem;
          font-weight: 300;
          color: var(--color-drift-text);
          margin: 0 0 0.25rem;
          letter-spacing: 0.02em;
        }

        .breathe__countdown {
          font-size: 2.5rem;
          font-weight: 200;
          color: var(--color-drift-text-muted);
          margin: 0;
          font-variant-numeric: tabular-nums;
        }

        .breathe__cycles {
          font-size: 0.75rem;
          color: var(--color-drift-text-dim);
          margin: 0.5rem 0 0;
        }

        .breathe__controls {
          display: flex;
          gap: 0.75rem;
        }

        .breathe__settings {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          max-width: 24rem;
        }

        .breathe__pattern-selector {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .breathe__pattern-btn {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          min-height: 44px;
          background: var(--color-drift-surface);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: var(--radius-drift-sm);
          color: var(--color-drift-text-muted);
          font-family: var(--font-drift);
          font-size: 0.875rem;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }

        .breathe__pattern-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .breathe__pattern-btn--active {
          border-color: var(--color-drift-accent);
          color: var(--color-drift-text);
        }

        .breathe__pattern-name {
          font-weight: 500;
        }

        .breathe__pattern-timing {
          font-size: 0.75rem;
          color: var(--color-drift-text-dim);
          font-variant-numeric: tabular-nums;
        }

        .breathe__toggles {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
        }

        .breathe__toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: var(--color-drift-text-muted);
          cursor: pointer;
        }

        .breathe__toggle input {
          accent-color: var(--color-drift-accent);
          width: 16px;
          height: 16px;
        }

        @media (prefers-reduced-motion: reduce) {
          .breathe__orb {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
