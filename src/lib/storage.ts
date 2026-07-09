/**
 * localStorage wrapper with typed get/set and JSON serialization.
 * All Drift data stays on the device — nothing leaves the browser.
 */

const PREFIX = 'drift-';

export function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — fail silently in bedtime context
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // fail silently
  }
}

export function isStorageAvailable(): boolean {
  try {
    const test = '__drift_test__';
    localStorage.setItem(test, '1');
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
