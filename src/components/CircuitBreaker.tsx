import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { calmingStatements } from '../data/calmingStatements';
import type { CalmingStatement } from '../data/calmingStatements';

type Mode = 'guide' | 'grounding' | 'calm-words';

const GROUNDING_STEPS = [
  { count: 5, sense: 'see', prompt: 'Name 5 things you can see', icon: '👁️' },
  { count: 4, sense: 'touch', prompt: 'Name 4 things you can touch', icon: '✋' },
  { count: 3, sense: 'hear', prompt: 'Name 3 things you can hear', icon: '👂' },
  { count: 2, sense: 'smell', prompt: 'Name 2 things you can smell', icon: '👃' },
  { count: 1, sense: 'taste', prompt: 'Name 1 thing you can taste', icon: '👅' },
];

export default function CircuitBreaker() {
  const [mode, setMode] = useState<Mode>('guide');

  return (
    <div class="cb">
      <div class="cb__tabs" role="tablist" aria-label="Circuit breaker mode">
        {([
          { key: 'guide' as Mode, label: 'Guide Me' },
          { key: 'grounding' as Mode, label: 'Grounding' },
          { key: 'calm-words' as Mode, label: 'Calm Words' },
        ]).map((tab) => (
          <button
            key={tab.key}
            class={`cb__tab ${mode === tab.key ? 'cb__tab--active' : ''}`}
            onClick={() => setMode(tab.key)}
            role="tab"
            aria-selected={mode === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div class="cb__content" role="tabpanel">
        {mode === 'guide' && <GuideMe />}
        {mode === 'grounding' && <Grounding />}
        {mode === 'calm-words' && <CalmWords />}
      </div>

      <style>{`
        .cb {
          max-width: 28rem;
          margin: 0 auto;
          padding: 1rem;
        }

        .cb__tabs {
          display: flex;
          gap: 0.25rem;
          background: var(--color-drift-surface);
          border-radius: 9999px;
          padding: 0.25rem;
          margin-bottom: 2rem;
        }

        .cb__tab {
          flex: 1;
          padding: 0.625rem 0.75rem;
          min-height: 40px;
          border: none;
          border-radius: 9999px;
          background: transparent;
          color: var(--color-drift-text-muted);
          font-family: var(--font-drift);
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s, color 0.2s;
        }

        .cb__tab--active {
          background: var(--color-drift-accent);
          color: #fff;
        }

        .cb__tab:hover:not(.cb__tab--active) {
          color: var(--color-drift-text);
        }

        .cb__content {
          min-height: 50vh;
        }
      `}</style>
    </div>
  );
}

/* ---- Guide Me (Decision Tree) ---- */
function GuideMe() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      question: 'What are you feeling right now?',
      options: [
        { label: 'Racing thoughts', next: 1 },
        { label: 'Physical tension', next: 2 },
        { label: 'General anxiety', next: 3 },
      ],
    },
    {
      message: 'Your mind is busy. Let\'s redirect it.',
      suggestion: 'Try the Cognitive Shuffle — it gently occupies your mind with random images until sleep arrives.',
      link: '/shuffle/',
      linkLabel: 'Go to Shuffle',
    },
    {
      message: 'Your body is holding stress. Let\'s release it.',
      suggestion: 'Try Guided Breathing — the 4-7-8 pattern activates your rest-and-digest system.',
      link: '/breathe/',
      linkLabel: 'Go to Breathing',
    },
    {
      message: 'You\'re feeling anxious. That\'s okay — let\'s ground you.',
      suggestion: 'Try the 5-4-3-2-1 grounding exercise. It brings you back to the present moment.',
      action: 'grounding',
    },
  ];

  const current = steps[step];

  return (
    <div class="guide">
      {'question' in current ? (
        <>
          <p class="guide__question">{current.question}</p>
          <div class="guide__options">
            {current.options?.map((opt) => (
              <button
                key={opt.label}
                class="drift-btn drift-btn-ghost guide__option"
                onClick={() => setStep(opt.next)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div class="guide__result">
          <p class="guide__message">{'message' in current ? current.message : ''}</p>
          <p class="guide__suggestion">{'suggestion' in current ? current.suggestion : ''}</p>
          {'link' in current && current.link && (
            <a href={current.link} class="drift-btn drift-btn-primary">
              {'linkLabel' in current ? current.linkLabel : 'Go'}
            </a>
          )}
          <button
            class="drift-btn drift-btn-ghost"
            onClick={() => setStep(0)}
            style={{ marginTop: '0.75rem' }}
          >
            Start over
          </button>
        </div>
      )}

      <style>{`
        .guide {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          text-align: center;
          padding: 2rem 0;
        }

        .guide__question {
          font-size: 1.25rem;
          font-weight: 400;
          color: var(--color-drift-text);
          margin: 0;
        }

        .guide__options {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          width: 100%;
          max-width: 20rem;
        }

        .guide__option {
          width: 100%;
          justify-content: center;
        }

        .guide__result {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .guide__message {
          font-size: 1.125rem;
          font-weight: 400;
          color: var(--color-drift-text);
          margin: 0;
        }

        .guide__suggestion {
          font-size: 0.9375rem;
          color: var(--color-drift-text-muted);
          margin: 0;
          line-height: 1.6;
          max-width: 24rem;
        }
      `}</style>
    </div>
  );
}

/* ---- 5-4-3-2-1 Grounding ---- */
function Grounding() {
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);

  const step = GROUNDING_STEPS[stepIdx];

  const handleNext = () => {
    if (stepIdx < GROUNDING_STEPS.length - 1) {
      setStepIdx(stepIdx + 1);
    } else {
      setDone(true);
    }
  };

  const reset = () => {
    setStepIdx(0);
    setDone(false);
  };

  if (done) {
    return (
      <div class="ground ground--done">
        <p class="ground__done-text">You did it. You're here, you're present, you're safe.</p>
        <button class="drift-btn drift-btn-ghost" onClick={reset}>
          Do it again
        </button>
        <style>{groundingStyles}</style>
      </div>
    );
  }

  return (
    <div class="ground">
      <div class="ground__progress">
        {GROUNDING_STEPS.map((_, i) => (
          <span
            key={i}
            class={`ground__dot ${i === stepIdx ? 'ground__dot--active' : ''} ${i < stepIdx ? 'ground__dot--done' : ''}`}
          />
        ))}
      </div>

      <div class="ground__step" aria-live="polite">
        <span class="ground__icon">{step.icon}</span>
        <p class="ground__prompt">{step.prompt}</p>
        <p class="ground__hint">Take your time. There's no rush.</p>
      </div>

      <button class="drift-btn drift-btn-primary" onClick={handleNext}>
        {stepIdx < GROUNDING_STEPS.length - 1 ? 'Next' : 'Finish'}
      </button>

      <style>{groundingStyles}</style>
    </div>
  );
}

const groundingStyles = `
  .ground {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 2rem 0;
    text-align: center;
  }

  .ground--done {
    justify-content: center;
    min-height: 40vh;
  }

  .ground__progress {
    display: flex;
    gap: 0.5rem;
  }

  .ground__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-drift-surface-raised);
    transition: background-color 0.3s;
  }

  .ground__dot--active {
    background: var(--color-drift-accent);
    transform: scale(1.25);
  }

  .ground__dot--done {
    background: var(--color-drift-accent-glow);
    opacity: 0.5;
  }

  .ground__step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .ground__icon {
    font-size: 2.5rem;
  }

  .ground__prompt {
    font-size: 1.375rem;
    font-weight: 400;
    color: var(--color-drift-text);
    margin: 0;
  }

  .ground__hint {
    font-size: 0.875rem;
    color: var(--color-drift-text-dim);
    font-style: italic;
    margin: 0;
  }

  .ground__done-text {
    font-size: 1.125rem;
    color: var(--color-drift-text);
    line-height: 1.6;
    margin: 0;
  }
`;

/* ---- Calm Words Carousel ---- */
function CalmWords() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(false);
  const timerRef = useRef<number | null>(null);

  const statement = calmingStatements[idx];

  const advance = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      setIdx((prev) => (prev + 1) % calmingStatements.length);
      setFade(false);
    }, 400);
  }, []);

  useEffect(() => {
    timerRef.current = window.setInterval(advance, 8000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [advance]);

  const handleTap = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    advance();
    timerRef.current = window.setInterval(advance, 8000);
  };

  return (
    <div class="calm-words" onClick={handleTap} role="button" aria-label="Tap for next statement" tabIndex={0}>
      <div class="calm-words__display" aria-live="polite">
        <p class={`calm-words__text ${fade ? 'calm-words__text--fading' : ''}`}>
          "{statement.text}"
        </p>
      </div>
      <p class="calm-words__tap-hint">Tap for next</p>

      <style>{`
        .calm-words {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          padding: 2rem;
          cursor: pointer;
          user-select: none;
        }

        .calm-words__display {
          text-align: center;
          max-width: 24rem;
        }

        .calm-words__text {
          font-size: clamp(1.125rem, 4vw, 1.375rem);
          font-weight: 300;
          line-height: 1.7;
          color: var(--color-drift-text);
          font-style: italic;
          margin: 0;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .calm-words__text--fading {
          opacity: 0;
          transform: translateY(4px);
        }

        .calm-words__tap-hint {
          margin-top: 2rem;
          font-size: 0.75rem;
          color: var(--color-drift-text-dim);
        }

        @media (prefers-reduced-motion: reduce) {
          .calm-words__text {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
