import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import { wordBank, shuffleArray } from '../data/wordBank';

const SPEEDS = [
  { label: '3s', ms: 3000 },
  { label: '5s', ms: 5000 },
  { label: '8s', ms: 8000 },
];

export default function CognitiveShuffle() {
  const [words, setWords] = useState<string[]>(() => shuffleArray(wordBank));
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speedIdx, setSpeedIdx] = useState(1); // default 5s
  const [fading, setFading] = useState(false);
  const timerRef = useRef<number | null>(null);

  const currentWord = words[index % words.length];
  const speed = SPEEDS[speedIdx].ms;

  const advanceWord = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setIndex((prev) => {
        const next = prev + 1;
        // reshuffle when we've been through all words
        if (next >= words.length) {
          setWords(shuffleArray(wordBank));
          return 0;
        }
        return next;
      });
      setFading(false);
    }, 300);
  }, [words.length]);

  useEffect(() => {
    if (!playing) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(advanceWord, speed);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, speed, advanceWord]);

  const handleNext = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    advanceWord();
    if (playing) {
      timerRef.current = window.setInterval(advanceWord, speed);
    }
  };

  return (
    <div class="shuffle">
      <div class="shuffle__display" role="timer" aria-live="polite" aria-atomic="true">
        <span class={`shuffle__word ${fading ? 'shuffle__word--fading' : ''}`}>
          {currentWord}
        </span>
        <p class="shuffle__hint">Visualize this in your mind…</p>
      </div>

      <div class="shuffle__controls">
        <button
          class="drift-btn drift-btn-primary shuffle__play"
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          )}
          {playing ? 'Pause' : 'Play'}
        </button>

        <button
          class="drift-btn drift-btn-ghost"
          onClick={handleNext}
          aria-label="Next word"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="5 12 12 5 19 12"/><polyline points="5 19 12 12 19 19"/></svg>
          Next
        </button>
      </div>

      <div class="shuffle__speed" role="radiogroup" aria-label="Word display speed">
        {SPEEDS.map((s, i) => (
          <button
            key={s.label}
            class={`shuffle__speed-btn ${i === speedIdx ? 'shuffle__speed-btn--active' : ''}`}
            onClick={() => setSpeedIdx(i)}
            role="radio"
            aria-checked={i === speedIdx}
          >
            {s.label}
          </button>
        ))}
      </div>

      <style>{`
        .shuffle {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 2.5rem;
          padding: 2rem 1rem;
        }

        .shuffle__display {
          text-align: center;
        }

        .shuffle__word {
          display: block;
          font-size: clamp(2rem, 8vw, 4rem);
          font-weight: 300;
          letter-spacing: 0.04em;
          color: var(--color-drift-text);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .shuffle__word--fading {
          opacity: 0;
          transform: translateY(4px);
        }

        .shuffle__hint {
          margin-top: 1rem;
          font-size: 0.875rem;
          color: var(--color-drift-text-dim);
          font-style: italic;
        }

        .shuffle__controls {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .shuffle__play {
          min-width: 120px;
        }

        .shuffle__speed {
          display: flex;
          gap: 0.25rem;
          background: var(--color-drift-surface);
          border-radius: 9999px;
          padding: 0.25rem;
        }

        .shuffle__speed-btn {
          padding: 0.375rem 1rem;
          min-height: 36px;
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

        .shuffle__speed-btn--active {
          background: var(--color-drift-accent);
          color: #fff;
        }

        .shuffle__speed-btn:hover:not(.shuffle__speed-btn--active) {
          color: var(--color-drift-text);
        }

        @media (prefers-reduced-motion: reduce) {
          .shuffle__word {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
