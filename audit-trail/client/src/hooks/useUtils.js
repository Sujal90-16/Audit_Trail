import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage — Persist state in localStorage with JSON serialization.
 *
 * @param {string} key - localStorage key
 * @param {*} initialValue - Default value if key doesn't exist
 * @returns {[value, setValue]} - State and setter tuple
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn(`Failed to save to localStorage: ${key}`);
    }
  }, [key, value]);

  return [value, setValue];
}

/**
 * useMediaQuery — Reactive CSS media query hook.
 *
 * @param {string} query - CSS media query string
 * @returns {boolean} - Whether the query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * useKeyPress — Detect when a specific key is pressed.
 *
 * @param {string} targetKey - Key to listen for
 * @param {Function} handler - Callback on key press
 * @param {Object} options - { ctrl, shift, meta, preventDefault }
 */
export function useKeyPress(targetKey, handler, options = {}) {
  useEffect(() => {
    const listener = (e) => {
      if (options.ctrl && !e.ctrlKey && !e.metaKey) return;
      if (options.shift && !e.shiftKey) return;
      if (e.key === targetKey) {
        if (options.preventDefault) e.preventDefault();
        handler(e);
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [targetKey, handler, options]);
}

/**
 * useClickOutside — Detect clicks outside a ref element.
 *
 * @param {React.RefObject} ref - Element ref to monitor
 * @param {Function} handler - Callback when click occurs outside
 */
export function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(e);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

/**
 * useEventSource — Mock SSE hook for real-time event stream.
 * Simulates periodic events from the event store.
 *
 * @param {boolean} enabled - Whether to listen (default: true)
 * @param {number} interval - Polling interval ms (default: 10000)
 * @returns {{ lastEvent, eventCount, isConnected }}
 */
export function useEventSource(enabled = true, interval = 10000) {
  const [lastEvent, setLastEvent] = useState(null);
  const [eventCount, setEventCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    setIsConnected(true);
    const types = ['CONTAINER_CREATED', 'LOADED_ON_SHIP', 'ARRIVED_AT_PORT', 'TEMPERATURE_SPIKE', 'DELIVERED'];

    const timer = setInterval(() => {
      const event = {
        id: `evt-${Date.now()}`,
        type: types[Math.floor(Math.random() * types.length)],
        timestamp: new Date().toISOString(),
        shipmentId: `SHIP-2024-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
      };
      setLastEvent(event);
      setEventCount((c) => c + 1);
    }, interval);

    return () => {
      clearInterval(timer);
      setIsConnected(false);
    };
  }, [enabled, interval]);

  return { lastEvent, eventCount, isConnected };
}
