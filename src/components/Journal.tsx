import { useState, useEffect, useCallback } from 'preact/hooks';
import { getItem, setItem } from '../lib/storage';

interface VaultEntry {
  id: string;
  text: string;
  timestamp: number;
}

const STORAGE_KEYS = {
  current: 'journal-current',
  vault: 'journal-vault',
};

export default function Journal() {
  const [text, setText] = useState(() => getItem<string>(STORAGE_KEYS.current, ''));
  const [vault, setVault] = useState<VaultEntry[]>(() =>
    getItem<VaultEntry[]>(STORAGE_KEYS.vault, [])
  );
  const [showVault, setShowVault] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [saved, setSaved] = useState(false);

  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      setItem(STORAGE_KEYS.current, text);
    }, 500);
    return () => clearTimeout(timer);
  }, [text]);

  const handleClearMind = useCallback(() => {
    if (!text.trim()) return;

    const entry: VaultEntry = {
      id: crypto.randomUUID?.() || Date.now().toString(36),
      text: text.trim(),
      timestamp: Date.now(),
    };

    const newVault = [entry, ...vault];
    setVault(newVault);
    setItem(STORAGE_KEYS.vault, newVault);
    setText('');
    setItem(STORAGE_KEYS.current, '');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [text, vault]);

  const deleteEntry = (id: string) => {
    const newVault = vault.filter((e) => e.id !== id);
    setVault(newVault);
    setItem(STORAGE_KEYS.vault, newVault);
  };

  const clearAllVault = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    setVault([]);
    setItem(STORAGE_KEYS.vault, []);
    setConfirmClear(false);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div class="journal">
      <div class="journal__privacy">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span>Everything stays on this device. Nothing leaves your browser.</span>
      </div>

      <div class="journal__editor">
        <textarea
          class="journal__textarea"
          value={text}
          onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
          placeholder="What's on your mind? Write it down and let it go..."
          aria-label="Write your thoughts"
          spellcheck={false}
        />
        <div class="journal__footer">
          <span class="journal__count">{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
        </div>
      </div>

      <div class="journal__actions">
        <button
          class="drift-btn drift-btn-primary"
          onClick={handleClearMind}
          disabled={!text.trim()}
        >
          {saved ? '✓ Saved to Vault' : 'Clear Mind'}
        </button>
        <button
          class="drift-btn drift-btn-ghost"
          onClick={() => setShowVault(!showVault)}
        >
          {showVault ? 'Hide Vault' : `Vault (${vault.length})`}
        </button>
      </div>

      {showVault && (
        <div class="journal__vault">
          <div class="journal__vault-header">
            <h3>Your Vault</h3>
            {vault.length > 0 && (
              <button
                class="journal__clear-all"
                onClick={clearAllVault}
              >
                {confirmClear ? 'Tap again to confirm' : 'Clear All'}
              </button>
            )}
          </div>
          {vault.length === 0 ? (
            <p class="journal__vault-empty">
              Your vault is empty. Write something and tap "Clear Mind" to save it here.
            </p>
          ) : (
            <ul class="journal__vault-list">
              {vault.map((entry) => (
                <li key={entry.id} class="journal__vault-entry">
                  <div class="journal__vault-meta">
                    <time>
                      {new Date(entry.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                    <button
                      class="journal__vault-delete"
                      onClick={() => deleteEntry(entry.id)}
                      aria-label="Delete entry"
                    >
                      ×
                    </button>
                  </div>
                  <p class="journal__vault-text">{entry.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <style>{`
        .journal {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 1rem;
          max-width: 40rem;
          margin: 0 auto;
        }

        .journal__privacy {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          background: var(--color-drift-surface);
          border-radius: var(--radius-drift-sm);
          font-size: 0.75rem;
          color: var(--color-drift-text-muted);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .journal__editor {
          position: relative;
        }

        .journal__textarea {
          width: 100%;
          min-height: 40vh;
          padding: 1.25rem;
          background: var(--color-drift-surface);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-drift-md);
          color: var(--color-drift-text);
          font-family: var(--font-drift);
          font-size: 1rem;
          line-height: 1.7;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s;
        }

        .journal__textarea:focus {
          border-color: var(--color-drift-accent);
        }

        .journal__textarea::placeholder {
          color: var(--color-drift-text-dim);
        }

        .journal__footer {
          display: flex;
          justify-content: flex-end;
          padding: 0.375rem 0.5rem;
        }

        .journal__count {
          font-size: 0.75rem;
          color: var(--color-drift-text-dim);
        }

        .journal__actions {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .journal__vault {
          background: var(--color-drift-surface);
          border-radius: var(--radius-drift-md);
          padding: 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .journal__vault-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .journal__vault-header h3 {
          font-size: 0.9375rem;
          font-weight: 600;
          margin: 0;
          color: var(--color-drift-text);
        }

        .journal__clear-all {
          background: none;
          border: none;
          font-family: var(--font-drift);
          font-size: 0.75rem;
          color: var(--color-drift-danger);
          cursor: pointer;
          padding: 0.25rem 0.5rem;
        }

        .journal__vault-empty {
          font-size: 0.875rem;
          color: var(--color-drift-text-dim);
          text-align: center;
          padding: 1rem 0;
        }

        .journal__vault-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .journal__vault-entry {
          background: var(--color-drift-surface-raised);
          border-radius: var(--radius-drift-sm);
          padding: 0.875rem;
        }

        .journal__vault-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .journal__vault-meta time {
          font-size: 0.6875rem;
          color: var(--color-drift-text-dim);
        }

        .journal__vault-delete {
          background: none;
          border: none;
          color: var(--color-drift-text-dim);
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.25rem;
          line-height: 1;
          min-width: 32px;
          min-height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .journal__vault-delete:hover {
          color: var(--color-drift-danger);
        }

        .journal__vault-text {
          font-size: 0.875rem;
          color: var(--color-drift-text-muted);
          line-height: 1.6;
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}
