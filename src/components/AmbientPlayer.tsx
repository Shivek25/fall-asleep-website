import { useState, useEffect, useRef } from 'preact/hooks';
import { ambientEngine, SOUNDSCAPES, type SoundscapeType } from '../lib/ambientAudio';

export default function AmbientPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SoundscapeType>('sleep-583079');
  const [volume, setVolume] = useState(0.35);
  const panelRef = useRef<HTMLDivElement>(null);

  // Initialize and sync with engine state
  useEffect(() => {
    // Restore saved volume if present
    try {
      const savedVol = localStorage.getItem('fallasleep_ambient_vol');
      if (savedVol !== null) {
        const parsed = parseFloat(savedVol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          setVolume(parsed);
          ambientEngine.setVolume(parsed);
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    const unsubscribe = ambientEngine.subscribe(() => {
      const state = ambientEngine.getState();
      setIsPlaying(state.isPlaying);
      setCurrentTrack(state.currentTrack);
      setVolume(state.volume);
    });

    return () => unsubscribe();
  }, []);

  // Handle click outside to close panel
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTogglePlay = (e: MouseEvent) => {
    e.stopPropagation();
    ambientEngine.toggle();
  };

  const handleSelectTrack = (trackId: SoundscapeType) => {
    ambientEngine.setTrack(trackId);
    if (!isPlaying) {
      ambientEngine.play(trackId);
    }
  };

  const handleVolumeChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const val = parseFloat(target.value);
    setVolume(val);
    ambientEngine.setVolume(val);
    try {
      localStorage.setItem('fallasleep_ambient_vol', val.toString());
    } catch {
      // Ignore
    }
  };

  const currentOption = SOUNDSCAPES.find((s) => s.id === currentTrack) || SOUNDSCAPES[0];

  return (
    <div class="ambient-widget" ref={panelRef}>
      {/* Floating Header Pill Button */}
      <div class="ambient-pill-wrapper">
        <div
          class={`ambient-pill ${isPlaying ? 'ambient-pill--active' : ''}`}
          role="region"
          aria-label="Background sound controls"
        >
          <button
            type="button"
            class="ambient-pill__play-btn"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause ambient music' : 'Play ambient music'}
            title={isPlaying ? 'Pause ambient music' : 'Play ambient music'}
          >
            {isPlaying ? (
              <span class="ambient-waves" aria-hidden="true">
                <span class="bar bar-1"></span>
                <span class="bar bar-2"></span>
                <span class="bar bar-3"></span>
              </span>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          <button
            type="button"
            class="ambient-pill__menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-label="Ambient Background Music Settings"
            title="Soundscape Settings"
          >
            <span class="ambient-pill__label">
              {isPlaying ? currentOption.label : 'Calm Music'}
            </span>

            <svg
              class={`ambient-pill__chevron ${isOpen ? 'ambient-pill__chevron--open' : ''}`}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expandable Micro Control Panel */}
      {isOpen && (
        <div class="ambient-panel" role="dialog" aria-label="Ambient Audio Controls">
          <div class="ambient-panel__header">
            <div class="ambient-panel__title-group">
              <span class="ambient-panel__icon" aria-hidden="true">🎧</span>
              <span class="ambient-panel__title">Bedtime Music & Sounds</span>
            </div>
            <button
              type="button"
              class="ambient-panel__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close sound panel"
            >
              ✕
            </button>
          </div>

          <p class="ambient-panel__subtitle">Peaceful royalty-free music for calm & deep rest</p>

          <div class="ambient-panel__tracks" role="radiogroup" aria-label="Select ambient sound">
            {SOUNDSCAPES.map((s) => {
              const isSelected = currentTrack === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  class={`ambient-track-card ${isSelected ? 'ambient-track-card--selected' : ''}`}
                  onClick={() => handleSelectTrack(s.id)}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <span class="ambient-track-card__icon">{s.icon}</span>
                  <div class="ambient-track-card__text">
                    <span class="ambient-track-card__label">{s.label}</span>
                    <span class="ambient-track-card__desc">{s.description}</span>
                  </div>
                  {isSelected && isPlaying && (
                    <span class="ambient-track-card__status">Playing</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Master Controls & Volume */}
          <div class="ambient-panel__controls">
            <div class="ambient-panel__action-row">
              <button
                type="button"
                class={`ambient-btn ${isPlaying ? 'ambient-btn--stop' : 'ambient-btn--play'}`}
                onClick={handleTogglePlay}
              >
                {isPlaying ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    <span>Pause Sound</span>
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    <span>Play {currentOption.label}</span>
                  </>
                )}
              </button>
            </div>

            <div class="ambient-volume">
              <span class="ambient-volume__label" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={volume}
                onInput={handleVolumeChange}
                aria-label="Sound volume"
                class="ambient-volume__slider"
              />
              <span class="ambient-volume__value">{Math.round(volume * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ambient-widget {
          position: fixed;
          top: max(1rem, env(safe-area-inset-top, 1rem));
          right: max(1rem, env(safe-area-inset-right, 1rem));
          z-index: 95;
          font-family: var(--font-drift);
        }

        .ambient-pill-wrapper {
          display: flex;
          justify-content: flex-end;
        }

        .ambient-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem 0.375rem 0.375rem;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          color: var(--color-drift-text-muted);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        .ambient-pill:hover {
          color: var(--color-drift-text);
          border-color: rgba(110, 139, 239, 0.4);
          background: rgba(30, 41, 59, 0.95);
        }

        .ambient-pill--active {
          border-color: rgba(110, 139, 239, 0.6);
          color: var(--color-drift-text);
          box-shadow: 0 0 18px rgba(110, 139, 239, 0.25);
        }

        .ambient-pill__play-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.625rem;
          height: 1.625rem;
          border-radius: 9999px;
          border: none;
          background: var(--color-drift-accent);
          color: #fff;
          cursor: pointer;
          transition: transform 0.15s ease, background-color 0.2s ease;
          padding: 0;
        }

        .ambient-pill__play-btn:hover {
          transform: scale(1.08);
          background: var(--color-drift-accent-glow);
        }

        .ambient-pill__menu-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          background: transparent;
          border: none;
          color: inherit;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          cursor: pointer;
          padding: 0 0.25rem 0 0;
        }

        .ambient-pill__label {
          letter-spacing: 0.02em;
          user-select: none;
          white-space: nowrap;
        }

        .ambient-pill__chevron {
          color: var(--color-drift-text-dim);
          transition: transform 0.2s ease;
        }

        .ambient-pill__chevron--open {
          transform: rotate(180deg);
        }

        /* Equalizer Bar Animation */
        .ambient-waves {
          display: flex;
          align-items: center;
          gap: 2px;
          height: 10px;
        }

        .ambient-waves .bar {
          width: 2px;
          background: #fff;
          border-radius: 1px;
          animation: wave-jump 1s ease-in-out infinite alternate;
        }

        .ambient-waves .bar-1 { height: 4px; animation-delay: 0.1s; }
        .ambient-waves .bar-2 { height: 9px; animation-delay: 0.3s; }
        .ambient-waves .bar-3 { height: 6px; animation-delay: 0.2s; }

        @keyframes wave-jump {
          0% { height: 3px; }
          100% { height: 10px; }
        }

        /* Dropdown Panel */
        .ambient-panel {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          width: 18.5rem;
          background: rgba(15, 23, 42, 0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 1rem;
          padding: 1.125rem;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6);
          animation: panel-appear 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes panel-appear {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .ambient-panel__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .ambient-panel__title-group {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .ambient-panel__icon {
          font-size: 0.9375rem;
        }

        .ambient-panel__title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-drift-text);
        }

        .ambient-panel__close {
          background: transparent;
          border: none;
          color: var(--color-drift-text-dim);
          font-size: 0.8125rem;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          line-height: 1;
        }

        .ambient-panel__close:hover {
          color: var(--color-drift-text);
        }

        .ambient-panel__subtitle {
          font-size: 0.6875rem;
          color: var(--color-drift-text-dim);
          margin: 0 0 0.875rem 0;
        }

        .ambient-panel__tracks {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          margin-bottom: 1rem;
        }

        .ambient-track-card {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.5rem 0.625rem;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 0.625rem;
          color: var(--color-drift-text-muted);
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
          width: 100%;
        }

        .ambient-track-card:hover {
          background: rgba(51, 65, 85, 0.6);
          color: var(--color-drift-text);
        }

        .ambient-track-card--selected {
          background: rgba(110, 139, 239, 0.15);
          border-color: rgba(110, 139, 239, 0.45);
          color: var(--color-drift-text);
        }

        .ambient-track-card__icon {
          font-size: 1.125rem;
          flex-shrink: 0;
        }

        .ambient-track-card__text {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .ambient-track-card__label {
          font-size: 0.78125rem;
          font-weight: 500;
          color: var(--color-drift-text);
        }

        .ambient-track-card__desc {
          font-size: 0.65625rem;
          color: var(--color-drift-text-dim);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ambient-track-card__status {
          font-size: 0.625rem;
          font-weight: 600;
          color: var(--color-drift-accent);
          background: rgba(110, 139, 239, 0.2);
          padding: 0.125rem 0.375rem;
          border-radius: 9999px;
        }

        .ambient-panel__controls {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 0.75rem;
        }

        .ambient-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          width: 100%;
          padding: 0.5rem;
          border-radius: 0.5rem;
          border: none;
          font-family: var(--font-drift);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.1s ease;
        }

        .ambient-btn--play {
          background: var(--color-drift-accent);
          color: #fff;
        }

        .ambient-btn--play:hover {
          background: var(--color-drift-accent-glow);
        }

        .ambient-btn--stop {
          background: rgba(212, 90, 90, 0.2);
          color: #fca5a5;
          border: 1px solid rgba(212, 90, 90, 0.35);
        }

        .ambient-btn--stop:hover {
          background: rgba(212, 90, 90, 0.3);
        }

        .ambient-volume {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ambient-volume__label {
          color: var(--color-drift-text-dim);
          display: flex;
          align-items: center;
        }

        .ambient-volume__slider {
          flex: 1;
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.15);
          outline: none;
        }

        .ambient-volume__slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--color-drift-accent);
          cursor: pointer;
          box-shadow: 0 0 6px rgba(110, 139, 239, 0.6);
        }

        .ambient-volume__slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--color-drift-accent);
          cursor: pointer;
          border: none;
        }

        .ambient-volume__value {
          font-size: 0.6875rem;
          color: var(--color-drift-text-dim);
          min-width: 1.75rem;
          text-align: right;
          font-variant-numeric: tabular-nums;
        }

        @media (max-width: 480px) {
          .ambient-panel {
            width: calc(100vw - 2rem);
            right: 0;
          }
        }
      `}</style>
    </div>
  );
}
