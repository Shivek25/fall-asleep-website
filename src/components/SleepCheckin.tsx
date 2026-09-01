import { useState, useMemo } from 'preact/hooks';
import { getItem, setItem } from '../lib/storage';
import TrendChart from './TrendChart.tsx';

interface CheckinEntry {
  date: string; // YYYY-MM-DD
  bedtime: string;
  quality: number; // 1-5
  wakeFeel: string;
}

const BEDTIMES = [
  { label: 'Before 10pm', value: 'before-10' },
  { label: '10-11pm', value: '10-11' },
  { label: '11pm-12am', value: '11-12' },
  { label: 'After midnight', value: 'after-midnight' },
];

const WAKE_FEELS = [
  { label: 'Rested', value: 'rested', emoji: '😊' },
  { label: 'Okay', value: 'okay', emoji: '😐' },
  { label: 'Tired', value: 'tired', emoji: '😴' },
  { label: 'Exhausted', value: 'exhausted', emoji: '😩' },
];

const STORAGE_KEY = 'checkin-log';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function SleepCheckin() {
  const [log, setLog] = useState<CheckinEntry[]>(() =>
    getItem<CheckinEntry[]>(STORAGE_KEY, [])
  );
  const [bedtime, setBedtime] = useState('');
  const [quality, setQuality] = useState(0);
  const [wakeFeel, setWakeFeel] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [view, setView] = useState<'form' | 'history'>('form');
  const [historyRange, setHistoryRange] = useState(7);

  const alreadyLoggedToday = log.some((e) => e.date === todayStr());

  const handleSubmit = () => {
    if (!bedtime || !quality || !wakeFeel) return;

    const entry: CheckinEntry = {
      date: todayStr(),
      bedtime,
      quality,
      wakeFeel,
    };

    // Replace if already logged today, otherwise append
    const newLog = log.filter((e) => e.date !== todayStr());
    newLog.push(entry);
    newLog.sort((a, b) => a.date.localeCompare(b.date));

    setLog(newLog);
    setItem(STORAGE_KEY, newLog);
    setSubmitted(true);
    setTimeout(() => setView('history'), 1500);
  };

  const recentLog = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - historyRange);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return log.filter((e) => e.date >= cutoffStr);
  }, [log, historyRange]);

  return (
    <div class="checkin">
      <div class="checkin__toggle">
        <button
          class={`checkin__toggle-btn ${view === 'form' ? 'checkin__toggle-btn--active' : ''}`}
          onClick={() => setView('form')}
        >
          Check-in
        </button>
        <button
          class={`checkin__toggle-btn ${view === 'history' ? 'checkin__toggle-btn--active' : ''}`}
          onClick={() => setView('history')}
        >
          History ({log.length})
        </button>
      </div>

      {view === 'form' && (
        <div class="checkin__form">
          {submitted ? (
            <div class="checkin__success">
              <span class="checkin__success-icon">✓</span>
              <p>Logged! Sweet dreams.</p>
            </div>
          ) : (
            <>
              {alreadyLoggedToday && (
                <p class="checkin__already">You've already checked in today. Submitting will update it.</p>
              )}

              {/* Bedtime */}
              <fieldset class="checkin__field">
                <legend>When did you go to bed?</legend>
                <div class="checkin__options">
                  {BEDTIMES.map((b) => (
                    <button
                      key={b.value}
                      class={`checkin__option ${bedtime === b.value ? 'checkin__option--selected' : ''}`}
                      onClick={() => setBedtime(b.value)}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Quality */}
              <fieldset class="checkin__field">
                <legend>How was your sleep? (1-5)</legend>
                <div class="checkin__stars" role="radiogroup" aria-label="Sleep quality">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      class={`checkin__star ${quality >= n ? 'checkin__star--filled' : ''}`}
                      onClick={() => setQuality(n)}
                      role="radio"
                      aria-checked={quality === n}
                      aria-label={`${n} out of 5`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Wake feeling */}
              <fieldset class="checkin__field">
                <legend>How do you feel?</legend>
                <div class="checkin__options">
                  {WAKE_FEELS.map((w) => (
                    <button
                      key={w.value}
                      class={`checkin__option checkin__option--emoji ${wakeFeel === w.value ? 'checkin__option--selected' : ''}`}
                      onClick={() => setWakeFeel(w.value)}
                    >
                      <span class="checkin__emoji">{w.emoji}</span>
                      <span>{w.label}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <button
                class="drift-btn drift-btn-primary checkin__submit"
                onClick={handleSubmit}
                disabled={!bedtime || !quality || !wakeFeel}
              >
                Log Sleep
              </button>
            </>
          )}
        </div>
      )}

      {view === 'history' && (
        <div class="checkin__history">
          <div class="checkin__range-selector">
            {[7, 14, 30].map((n) => (
              <button
                key={n}
                class={`checkin__range-btn ${historyRange === n ? 'checkin__range-btn--active' : ''}`}
                onClick={() => setHistoryRange(n)}
              >
                {n}d
              </button>
            ))}
          </div>

          {recentLog.length > 0 ? (
            <>
              <TrendChart data={recentLog.map((e) => ({ date: e.date, value: e.quality }))} />
              <ul class="checkin__list">
                {[...recentLog].reverse().map((entry) => (
                  <li key={entry.date} class="checkin__entry">
                    <div class="checkin__entry-date">
                      {new Date(entry.date + 'T12:00:00').toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div class="checkin__entry-detail">
                      <span>{'★'.repeat(entry.quality)}{'☆'.repeat(5 - entry.quality)}</span>
                      <span class="checkin__entry-feel">
                        {WAKE_FEELS.find((w) => w.value === entry.wakeFeel)?.emoji || ''}
                        {' '}
                        {WAKE_FEELS.find((w) => w.value === entry.wakeFeel)?.label || entry.wakeFeel}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p class="checkin__empty">No check-ins yet for this period. Start logging your sleep!</p>
          )}
        </div>
      )}

      <style>{`
        .checkin {
          max-width: 28rem;
          margin: 0 auto;
          padding: 1rem;
        }

        .checkin__toggle {
          display: flex;
          gap: 0.25rem;
          background: var(--color-drift-surface);
          border-radius: 9999px;
          padding: 0.25rem;
          margin-bottom: 1.5rem;
        }

        .checkin__toggle-btn {
          flex: 1;
          padding: 0.625rem;
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

        .checkin__toggle-btn--active {
          background: var(--color-drift-accent);
          color: #fff;
        }

        .checkin__form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .checkin__success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 3rem 1rem;
          text-align: center;
        }

        .checkin__success-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--color-drift-success);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .checkin__success p {
          color: var(--color-drift-text);
          font-size: 1.125rem;
          margin: 0;
        }

        .checkin__already {
          font-size: 0.8125rem;
          color: var(--color-drift-warning);
          text-align: center;
          margin: 0;
        }

        .checkin__field {
          border: none;
          padding: 0;
          margin: 0;
        }

        .checkin__field legend {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--color-drift-text);
          margin-bottom: 0.75rem;
        }

        .checkin__options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .checkin__option {
          flex: 1;
          min-width: 5rem;
          min-height: 44px;
          padding: 0.625rem 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-drift-sm);
          background: var(--color-drift-surface);
          color: var(--color-drift-text-muted);
          font-family: var(--font-drift);
          font-size: 0.8125rem;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
          text-align: center;
        }

        .checkin__option--selected {
          border-color: var(--color-drift-accent);
          color: var(--color-drift-text);
          background: var(--color-drift-accent-soft);
        }

        .checkin__option--emoji {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .checkin__emoji {
          font-size: 1.5rem;
        }

        .checkin__stars {
          display: flex;
          gap: 0.25rem;
          justify-content: center;
        }

        .checkin__star {
          width: 44px;
          height: 44px;
          border: none;
          background: none;
          font-size: 1.75rem;
          color: var(--color-drift-surface-raised);
          cursor: pointer;
          transition: color 0.15s, transform 0.15s;
        }

        .checkin__star--filled {
          color: var(--color-drift-warning);
        }

        .checkin__star:hover {
          transform: scale(1.15);
        }

        .checkin__submit {
          width: 100%;
          margin-top: 0.5rem;
        }

        .checkin__history {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .checkin__range-selector {
          display: flex;
          gap: 0.25rem;
          justify-content: center;
        }

        .checkin__range-btn {
          padding: 0.375rem 1rem;
          min-height: 36px;
          border: none;
          border-radius: 9999px;
          background: var(--color-drift-surface);
          color: var(--color-drift-text-muted);
          font-family: var(--font-drift);
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s, color 0.2s;
        }

        .checkin__range-btn--active {
          background: var(--color-drift-accent);
          color: #fff;
        }

        .checkin__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .checkin__entry {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: var(--color-drift-surface);
          border-radius: var(--radius-drift-sm);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .checkin__entry-date {
          font-size: 0.8125rem;
          color: var(--color-drift-text-muted);
          min-width: 5rem;
        }

        .checkin__entry-detail {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: var(--color-drift-warning);
        }

        .checkin__entry-feel {
          font-size: 0.8125rem;
          color: var(--color-drift-text-muted);
        }

        .checkin__empty {
          text-align: center;
          color: var(--color-drift-text-dim);
          font-size: 0.9375rem;
          padding: 2rem 0;
        }
      `}</style>
    </div>
  );
}
