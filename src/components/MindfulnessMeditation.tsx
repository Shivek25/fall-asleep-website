import { useState, useEffect, useRef } from 'preact/hooks';
import { playChime } from '../lib/audio';

type MeditationMode = 'body-scan' | 'anxiety-pause' | 'zen-timer';

interface BodyZone {
  title: string;
  subtitle: string;
  icon: string;
  focusArea: string;
  guidance: string;
  cue: string;
}

const BODY_ZONES: BodyZone[] = [
  {
    title: 'Forehead & Jaw',
    subtitle: 'Step 1 of 7',
    icon: '✨',
    focusArea: 'Head, Eyes, Facial Muscles',
    guidance: 'Notice any subtle tension behind your eyes and brow. Let your jaw unhinge slightly. Allow your tongue to drop softly to the floor of your mouth.',
    cue: 'Unclench your jaw and soften your forehead.',
  },
  {
    title: 'Neck & Shoulders',
    subtitle: 'Step 2 of 7',
    icon: '🌿',
    focusArea: 'Trapezius & Upper Back',
    guidance: 'Feel your shoulders naturally dropping away from your ears. Release whatever heavy responsibilities you carried today. Let gravity take over.',
    cue: 'Drop your shoulders down. Let your neck rest.',
  },
  {
    title: 'Arms & Hands',
    subtitle: 'Step 3 of 7',
    icon: '✋',
    focusArea: 'Biceps, Forearms, Fingers',
    guidance: 'Notice the weight of your arms resting against the bed or mattress. Allow your palms to uncurl naturally. There is nothing you need to hold right now.',
    cue: 'Relax your palms. Let your fingers soften.',
  },
  {
    title: 'Chest & Breathing',
    subtitle: 'Step 4 of 7',
    icon: '🫁',
    focusArea: 'Heart Center & Ribcage',
    guidance: 'Watch the effortless rise and fall of your chest. You do not need to force deep breaths: simply witness your heart rate gently steadying.',
    cue: 'Feel your chest soften with each natural exhale.',
  },
  {
    title: 'Belly & Core',
    subtitle: 'Step 5 of 7',
    icon: '🌊',
    focusArea: 'Abdomen & Solar Plexus',
    guidance: 'We often hold stress tight in our core without realizing it. Fully release your abdominal muscles. Let your belly soften like warm water.',
    cue: 'Let your belly expand freely without holding back.',
  },
  {
    title: 'Hips & Legs',
    subtitle: 'Step 6 of 7',
    icon: '🌱',
    focusArea: 'Thighs, Knees, Calves',
    guidance: 'Feel the heavy sensation of your legs sinking deeply into the mattress. Allow the large muscles of your thighs and calves to completely power down.',
    cue: 'Feel your legs become pleasantly heavy and warm.',
  },
  {
    title: 'Feet & Whole Body',
    subtitle: 'Step 7 of 7',
    icon: '🌙',
    focusArea: 'Toes, Soles & Total Stillness',
    guidance: 'Sense warmth flowing down into your soles and toes. Now expand your awareness to your entire resting body. You are safe, supported, and completely at peace.',
    cue: 'Your whole body is rested, calm, and ready for sleep.',
  },
];

const ANXIETY_STEPS = [
  {
    title: '1. Acknowledge & Validate',
    tag: 'Notice',
    icon: '💭',
    prompt: 'Say to yourself: "I am noticing feelings of overwhelm or stress right now. This is simply an active nervous system doing its job. It is safe for me to slow down."',
    tip: 'Do not fight the emotion. Welcoming it removes its power.',
  },
  {
    title: '2. Physical Anchor',
    tag: 'Ground',
    icon: '⚓',
    prompt: 'Bring 100% of your focus to one tangible sensation: the cool air touching your upper lip, or the heavy contact of your head against the pillow.',
    tip: 'Whenever your thoughts drift, gently bring them back to this single physical anchor.',
  },
  {
    title: '3. The Passing Clouds',
    tag: 'Release',
    icon: '☁️',
    prompt: 'Picture your racing thoughts as puffy clouds or passing cars. You are standing peacefully on the sidewalk. You don\'t need to chase them or board them.',
    tip: 'Let thoughts arrive, and let them leave without answering them.',
  },
  {
    title: '4. Soften & Surrender',
    tag: 'Peace',
    icon: '🕊️',
    prompt: 'Take one smooth breath in... and as you exhale slowly, silently repeat: "There is nothing more I need to solve tonight. I give myself full permission to rest."',
    tip: 'Repeat this gentle permission statement whenever your mind seeks control.',
  },
];

const ZEN_AFFIRMATIONS = [
  'Inhale calm, exhale tension.',
  'Right here, right now, all is well.',
  'Your mind is settling like clear water.',
  'There is nothing you need to accomplish tonight.',
  'Soft body, quiet thoughts, deep rest.',
];

export default function MindfulnessMeditation() {
  const [mode, setMode] = useState<MeditationMode>('body-scan');

  return (
    <div class="meditation-root">
      {/* Mode Selector Tabs */}
      <div class="med-tabs" role="tablist" aria-label="Mindfulness Mode">
        <button
          type="button"
          class={`med-tab ${mode === 'body-scan' ? 'med-tab--active' : ''}`}
          onClick={() => setMode('body-scan')}
          role="tab"
          aria-selected={mode === 'body-scan'}
        >
          <span>🧘</span> Body Scan
        </button>
        <button
          type="button"
          class={`med-tab ${mode === 'anxiety-pause' ? 'med-tab--active' : ''}`}
          onClick={() => setMode('anxiety-pause')}
          role="tab"
          aria-selected={mode === 'anxiety-pause'}
        >
          <span>🛡️</span> Anxiety Pause
        </button>
        <button
          type="button"
          class={`med-tab ${mode === 'zen-timer' ? 'med-tab--active' : ''}`}
          onClick={() => setMode('zen-timer')}
          role="tab"
          aria-selected={mode === 'zen-timer'}
        >
          <span>⏱️</span> Zen Timer
        </button>
      </div>

      <div class="med-content">
        {mode === 'body-scan' && <BodyScanView />}
        {mode === 'anxiety-pause' && <AnxietyPauseView />}
        {mode === 'zen-timer' && <ZenTimerView />}
      </div>

      <style>{`
        .meditation-root {
          max-width: 32rem;
          margin: 0 auto;
        }

        .med-tabs {
          display: flex;
          gap: 0.375rem;
          background: var(--color-drift-surface);
          border-radius: 9999px;
          padding: 0.25rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .med-tab {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          padding: 0.625rem 0.5rem;
          min-height: 42px;
          border: none;
          border-radius: 9999px;
          background: transparent;
          color: var(--color-drift-text-muted);
          font-family: var(--font-drift);
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .med-tab:hover:not(.med-tab--active) {
          color: var(--color-drift-text);
          background: rgba(255, 255, 255, 0.04);
        }

        .med-tab--active {
          background: var(--color-drift-accent);
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(110, 139, 239, 0.35);
        }

        .med-content {
          min-height: 480px;
        }

        @media (max-width: 420px) {
          .med-tab {
            font-size: 0.75rem;
            padding: 0.5rem 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}

/* =========================================================================
   1. BODY SCAN COMPONENT
   ========================================================================= */
function BodyScanView() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [timeLeft, setTimeLeft] = useState(35);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const zone = BODY_ZONES[currentIdx];
  const isComplete = currentIdx >= BODY_ZONES.length;

  const nextStep = () => {
    if (currentIdx < BODY_ZONES.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setTimeLeft(35);
      if (soundEnabled) {
        playChime(396, 0.5, 0.12);
      }
    } else {
      setCurrentIdx(BODY_ZONES.length); // complete
      if (soundEnabled) {
        playChime(528, 1.0, 0.15);
      }
      setAutoPlay(false);
    }
  };

  const prevStep = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setTimeLeft(35);
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setTimeLeft(35);
    setAutoPlay(false);
  };

  // Auto-advance 1-second countdown timer (35 seconds per zone)
  useEffect(() => {
    let interval: number | null = null;
    if (autoPlay && currentIdx < BODY_ZONES.length) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            nextStep();
            return 35;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoPlay, currentIdx, soundEnabled]);

  return (
    <div class="bodyscan-card drift-card">
      {!isComplete ? (
        <>
          {/* Progress header */}
          <div class="bodyscan__progress-bar">
            <div
              class="bodyscan__progress-fill"
              style={{ width: `${((currentIdx + 1) / BODY_ZONES.length) * 100}%` }}
            />
          </div>

          <div class="bodyscan__header">
            <span class="bodyscan__step-badge">{zone.subtitle}</span>
            <div class="bodyscan__controls-row">
              <button
                type="button"
                class={`bodyscan__toggle-btn ${soundEnabled ? 'bodyscan__toggle-btn--on' : ''}`}
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
                aria-label="Toggle chime sounds"
              >
                {soundEnabled ? '🔔 Chimes On' : '🔕 Chimes Off'}
              </button>
              <button
                type="button"
                class={`bodyscan__toggle-btn ${autoPlay ? 'bodyscan__toggle-btn--on' : ''}`}
                onClick={() => {
                  if (!autoPlay) {
                    setTimeLeft(35);
                    setAutoPlay(true);
                  } else {
                    setAutoPlay(false);
                  }
                }}
                title={autoPlay ? 'Pause auto pacing' : 'Auto pace (35s per zone)'}
                aria-label="Toggle auto pace"
              >
                {autoPlay ? `⏸️ Pause (${timeLeft}s)` : '▶️ Auto-Pace'}
              </button>
            </div>
          </div>

          {/* Visual Focus Glowing Orb */}
          <div class="bodyscan__orb-container">
            <div class="bodyscan__glow-ring"></div>
            <div class="bodyscan__orb">
              <span class="bodyscan__icon" aria-hidden="true">{zone.icon}</span>
            </div>
            <span class="bodyscan__target-label">{zone.focusArea}</span>
          </div>

          {/* Body Zone Title & Guidance */}
          <div class="bodyscan__text-content">
            <h2 class="bodyscan__title">{zone.title}</h2>
            <p class="bodyscan__guidance">{zone.guidance}</p>
            <div class="bodyscan__cue-box">
              <span class="bodyscan__cue-text">"{zone.cue}"</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div class="bodyscan__nav">
            <button
              type="button"
              class="drift-btn drift-btn--secondary"
              onClick={prevStep}
              disabled={currentIdx === 0}
            >
              Previous
            </button>
            <button
              type="button"
              class="drift-btn drift-btn--primary"
              onClick={nextStep}
            >
              {currentIdx === BODY_ZONES.length - 1 ? 'Finish Scan ✨' : 'Release & Continue →'}
            </button>
          </div>
        </>
      ) : (
        <div class="bodyscan__complete">
          <div class="bodyscan__complete-icon">🌙</div>
          <h2 class="bodyscan__complete-title">Body Scan Complete</h2>
          <p class="bodyscan__complete-desc">
            Your body has released physical tension from head to toe. Lie back, breathe gently, and allow sleep to naturally take over.
          </p>
          <div class="bodyscan__complete-actions">
            <button type="button" class="drift-btn drift-btn--secondary" onClick={restart}>
              Repeat Scan
            </button>
            <a href="/breathe/" class="drift-btn drift-btn--primary">
              Continue to Guided Breathing →
            </a>
          </div>
        </div>
      )}

      <style>{`
        .bodyscan-card {
          padding: 1.5rem;
          background: var(--color-drift-surface);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-drift-lg);
          box-shadow: var(--shadow-drift-card);
        }

        .bodyscan__progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          margin-bottom: 1.25rem;
          overflow: hidden;
        }

        .bodyscan__progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-drift-accent), #a78bfa);
          transition: width 0.4s ease;
        }

        .bodyscan__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .bodyscan__step-badge {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-drift-accent);
          background: rgba(110, 139, 239, 0.15);
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
        }

        .bodyscan__controls-row {
          display: flex;
          gap: 0.375rem;
        }

        .bodyscan__toggle-btn {
          font-size: 0.6875rem;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(15, 23, 42, 0.6);
          color: var(--color-drift-text-dim);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .bodyscan__toggle-btn:hover {
          color: var(--color-drift-text);
        }

        .bodyscan__toggle-btn--on {
          border-color: rgba(110, 139, 239, 0.4);
          color: var(--color-drift-text);
          background: rgba(110, 139, 239, 0.15);
        }

        .bodyscan__orb-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 1.5rem 0;
        }

        .bodyscan__orb {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(167, 139, 250, 0.35) 0%, rgba(110, 139, 239, 0.1) 70%);
          border: 2px solid rgba(167, 139, 250, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 24px rgba(167, 139, 250, 0.3);
          animation: orb-pulse 4s ease-in-out infinite alternate;
        }

        @keyframes orb-pulse {
          0% { transform: scale(0.96); box-shadow: 0 0 16px rgba(110, 139, 239, 0.2); }
          100% { transform: scale(1.04); box-shadow: 0 0 32px rgba(167, 139, 250, 0.45); }
        }

        .bodyscan__icon {
          font-size: 2rem;
        }

        .bodyscan__target-label {
          margin-top: 0.75rem;
          font-size: 0.75rem;
          color: var(--color-drift-text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .bodyscan__text-content {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .bodyscan__title {
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--color-drift-text);
          margin: 0 0 0.5rem;
        }

        .bodyscan__guidance {
          font-size: 0.9375rem;
          line-height: 1.6;
          color: var(--color-drift-text-muted);
          margin: 0 0 1rem;
        }

        .bodyscan__cue-box {
          background: rgba(15, 23, 42, 0.5);
          border: 1px dashed rgba(167, 139, 250, 0.3);
          border-radius: var(--radius-drift-md);
          padding: 0.75rem 1rem;
          margin-top: 0.5rem;
        }

        .bodyscan__cue-text {
          font-size: 0.875rem;
          color: #c4b5fd;
          font-weight: 500;
          font-style: italic;
        }

        .bodyscan__nav {
          display: flex;
          gap: 0.75rem;
        }

        .bodyscan__nav button {
          flex: 1;
        }

        .bodyscan__complete {
          text-align: center;
          padding: 2rem 1rem;
        }

        .bodyscan__complete-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          animation: float 3s ease-in-out infinite alternate;
        }

        @keyframes float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }

        .bodyscan__complete-title {
          font-size: 1.5rem;
          color: var(--color-drift-text);
          margin: 0 0 0.75rem;
        }

        .bodyscan__complete-desc {
          font-size: 0.9375rem;
          color: var(--color-drift-text-muted);
          line-height: 1.6;
          margin: 0 0 1.5rem;
        }

        .bodyscan__complete-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
      `}</style>
    </div>
  );
}

/* =========================================================================
   2. ANXIETY DE-ESCALATION / MINDFUL PAUSE COMPONENT
   ========================================================================= */
function AnxietyPauseView() {
  const [stepIdx, setStepIdx] = useState(0);

  const step = ANXIETY_STEPS[stepIdx];

  return (
    <div class="anxiety-card drift-card">
      <div class="anxiety__stepper" role="tablist" aria-label="Steps">
        {ANXIETY_STEPS.map((s, idx) => (
          <button
            key={idx}
            type="button"
            class={`anxiety__step-pill ${stepIdx === idx ? 'anxiety__step-pill--active' : ''} ${stepIdx > idx ? 'anxiety__step-pill--done' : ''}`}
            onClick={() => setStepIdx(idx)}
            aria-selected={stepIdx === idx}
          >
            {s.tag}
          </button>
        ))}
      </div>

      <div class="anxiety__body">
        <div class="anxiety__icon-box">
          <span class="anxiety__icon" aria-hidden="true">{step.icon}</span>
        </div>

        <h2 class="anxiety__title">{step.title}</h2>
        <p class="anxiety__prompt">{step.prompt}</p>

        <div class="anxiety__tip-box">
          <span class="anxiety__tip-icon">💡</span>
          <span class="anxiety__tip-text">{step.tip}</span>
        </div>
      </div>

      <div class="anxiety__actions">
        <button
          type="button"
          class="drift-btn drift-btn--secondary"
          onClick={() => setStepIdx((prev) => Math.max(0, prev - 1))}
          disabled={stepIdx === 0}
        >
          Previous
        </button>

        {stepIdx < ANXIETY_STEPS.length - 1 ? (
          <button
            type="button"
            class="drift-btn drift-btn--primary"
            onClick={() => {
              setStepIdx((prev) => prev + 1);
              playChime(432, 0.4, 0.1);
            }}
          >
            Next Step →
          </button>
        ) : (
          <button
            type="button"
            class="drift-btn drift-btn--primary"
            onClick={() => {
              setStepIdx(0);
              playChime(528, 0.8, 0.15);
            }}
          >
            Restart Reset 🌿
          </button>
        )}
      </div>

      <style>{`
        .anxiety-card {
          padding: 1.5rem;
          background: var(--color-drift-surface);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-drift-lg);
          box-shadow: var(--shadow-drift-card);
        }

        .anxiety__stepper {
          display: flex;
          gap: 0.375rem;
          margin-bottom: 1.5rem;
        }

        .anxiety__step-pill {
          flex: 1;
          padding: 0.5rem 0.25rem;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(15, 23, 42, 0.5);
          color: var(--color-drift-text-dim);
          font-family: var(--font-drift);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .anxiety__step-pill--active {
          background: rgba(110, 139, 239, 0.2);
          border-color: var(--color-drift-accent);
          color: var(--color-drift-text);
          font-weight: 600;
        }

        .anxiety__step-pill--done {
          border-color: rgba(94, 168, 122, 0.4);
          color: #86efac;
        }

        .anxiety__body {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .anxiety__icon-box {
          margin-bottom: 0.75rem;
        }

        .anxiety__icon {
          font-size: 2.25rem;
        }

        .anxiety__title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-drift-text);
          margin: 0 0 0.75rem;
        }

        .anxiety__prompt {
          font-size: 0.9375rem;
          line-height: 1.65;
          color: var(--color-drift-text-muted);
          margin: 0 0 1.25rem;
          text-align: left;
          background: rgba(15, 23, 42, 0.4);
          padding: 1rem;
          border-radius: var(--radius-drift-md);
          border-left: 3px solid var(--color-drift-accent);
        }

        .anxiety__tip-box {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          background: rgba(212, 164, 74, 0.1);
          border: 1px solid rgba(212, 164, 74, 0.2);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-drift-md);
          text-align: left;
        }

        .anxiety__tip-icon {
          font-size: 0.875rem;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .anxiety__tip-text {
          font-size: 0.8125rem;
          color: #fde68a;
          line-height: 1.4;
        }

        .anxiety__actions {
          display: flex;
          gap: 0.75rem;
        }

        .anxiety__actions button {
          flex: 1;
        }
      `}</style>
    </div>
  );
}

/* =========================================================================
   3. ZEN MEDITATION TIMER COMPONENT
   ========================================================================= */
function ZenTimerView() {
  const [selectedDuration, setSelectedDuration] = useState(300); // 5 mins in secs
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [affirmationIdx, setAffirmationIdx] = useState(0);

  const timerRef = useRef<number | null>(null);

  // Affirmation cycle every 40 seconds
  useEffect(() => {
    let affInterval: number;
    if (isActive) {
      affInterval = window.setInterval(() => {
        setAffirmationIdx((prev) => (prev + 1) % ZEN_AFFIRMATIONS.length);
      }, 40000);
    }
    return () => clearInterval(affInterval);
  }, [isActive]);

  // Main countdown timer
  useEffect(() => {
    if (isActive && secondsRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            playChime(528, 1.5, 0.2);
            return 0;
          }
          // Halfway chime
          if (prev === Math.floor(selectedDuration / 2)) {
            playChime(432, 0.6, 0.12);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, secondsRemaining, selectedDuration]);

  const handleSelectDuration = (dur: number) => {
    setIsActive(false);
    setSelectedDuration(dur);
    setSecondsRemaining(dur);
  };

  const handleToggleTimer = () => {
    if (!isActive) {
      if (secondsRemaining === 0) {
        setSecondsRemaining(selectedDuration);
      }
      setIsActive(true);
      playChime(396, 0.8, 0.15);
    } else {
      setIsActive(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsRemaining(selectedDuration);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div class="zen-card drift-card">
      {/* Preset Duration Buttons */}
      <div class="zen__durations">
        {[
          { label: '3 min', val: 180 },
          { label: '5 min', val: 300 },
          { label: '10 min', val: 600 },
          { label: '15 min', val: 900 },
        ].map((d) => (
          <button
            key={d.val}
            type="button"
            class={`zen__dur-btn ${selectedDuration === d.val ? 'zen__dur-btn--active' : ''}`}
            onClick={() => handleSelectDuration(d.val)}
            disabled={isActive}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Gentle Breathing / Visualizer Orb */}
      <div class="zen__orb-stage">
        <div class={`zen__breath-circle ${isActive ? 'zen__breath-circle--active' : ''}`}>
          <div class="zen__time-display">{formatTime(secondsRemaining)}</div>
          <span class="zen__time-status">
            {isActive ? 'Mindful Breathing' : secondsRemaining === 0 ? 'Complete' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Calming Affirmation */}
      <div class="zen__affirmation-box">
        <p class="zen__affirmation">"{ZEN_AFFIRMATIONS[affirmationIdx]}"</p>
      </div>

      {/* Action Buttons */}
      <div class="zen__actions">
        <button
          type="button"
          class="drift-btn drift-btn--secondary"
          onClick={handleReset}
          disabled={!isActive && secondsRemaining === selectedDuration}
        >
          Reset
        </button>
        <button
          type="button"
          class={`drift-btn ${isActive ? 'drift-btn--danger' : 'drift-btn--primary'}`}
          onClick={handleToggleTimer}
        >
          {isActive ? 'Pause Meditation' : secondsRemaining === 0 ? 'Start Again' : 'Begin Meditation'}
        </button>
      </div>

      <style>{`
        .zen-card {
          padding: 1.5rem;
          background: var(--color-drift-surface);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-drift-lg);
          box-shadow: var(--shadow-drift-card);
          text-align: center;
        }

        .zen__durations {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .zen__dur-btn {
          padding: 0.375rem 0.875rem;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(15, 23, 42, 0.5);
          color: var(--color-drift-text-dim);
          font-family: var(--font-drift);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .zen__dur-btn:hover:not(:disabled) {
          color: var(--color-drift-text);
          background: rgba(30, 41, 59, 0.8);
        }

        .zen__dur-btn--active {
          background: var(--color-drift-accent);
          color: #fff;
          border-color: var(--color-drift-accent);
        }

        .zen__dur-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .zen__orb-stage {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 0 2rem;
        }

        .zen__breath-circle {
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(110, 139, 239, 0.2) 0%, rgba(15, 23, 42, 0.8) 75%);
          border: 2px solid rgba(110, 139, 239, 0.35);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(110, 139, 239, 0.15);
          transition: transform 0.3s ease;
        }

        .zen__breath-circle--active {
          animation: zen-breathe 10s ease-in-out infinite;
        }

        @keyframes zen-breathe {
          0%, 100% {
            transform: scale(0.92);
            box-shadow: 0 0 15px rgba(110, 139, 239, 0.15);
            border-color: rgba(110, 139, 239, 0.3);
          }
          40%, 60% {
            transform: scale(1.1);
            box-shadow: 0 0 35px rgba(167, 139, 250, 0.4);
            border-color: rgba(167, 139, 250, 0.6);
          }
        }

        .zen__time-display {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--color-drift-text);
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }

        .zen__time-status {
          font-size: 0.75rem;
          color: var(--color-drift-accent);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 0.25rem;
        }

        .zen__affirmation-box {
          min-height: 48px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .zen__affirmation {
          font-size: 0.875rem;
          color: var(--color-drift-text-muted);
          font-style: italic;
          margin: 0;
          line-height: 1.5;
        }

        .zen__actions {
          display: flex;
          gap: 0.75rem;
        }

        .zen__actions button {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
