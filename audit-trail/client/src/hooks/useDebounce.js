import { useState, useEffect } from 'react';

/**
 * Debounce hook — delays value updates until the user
 * stops typing for the specified delay period.
 * 
 * Used in search to avoid firing API calls on every keystroke.
 * 
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @returns {any} The debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to detect keyboard shortcuts globally.
 * 
 * @param {string} key - The key to listen for (e.g., 'k')
 * @param {boolean} ctrlOrCmd - Whether Ctrl/Cmd must be held
 * @param {Function} callback - Function to call when shortcut is pressed
 */
export function useKeyboardShortcut(key, ctrlOrCmd, callback) {
  useEffect(() => {
    const handler = (e) => {
      const modifier = e.metaKey || e.ctrlKey;
      if (ctrlOrCmd && !modifier) return;
      if (e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, ctrlOrCmd, callback]);
}
