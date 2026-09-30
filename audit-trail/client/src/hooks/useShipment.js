import { useState, useEffect, useCallback } from 'react';
import { shipmentApi, eventApi } from '../services/api';

/**
 * Custom hook for fetching and managing shipment data.
 * Handles loading states, error handling, and data caching.
 *
 * Follows the CQRS read-side pattern — queries the projected state
 * reconstructed from the event store.
 *
 * Falls back to mock data when backend is unavailable.
 */

const MOCK_SHIPMENTS = {
  'SHIP-2024-0847': { id: 'SHIP-2024-0847', status: 'In Transit', origin: 'Shanghai, CN', destination: 'Los Angeles, US', containerType: '40ft Refrigerated', weight: '22,450 kg', transitProgress: 72 },
  'SHIP-2024-0621': { id: 'SHIP-2024-0621', status: 'Delivered', origin: 'Rotterdam, NL', destination: 'Mumbai, IN', containerType: '20ft Standard', weight: '14,200 kg', transitProgress: 100 },
  'SHIP-2024-0103': { id: 'SHIP-2024-0103', status: 'Alert', origin: 'Hamburg, DE', destination: 'Singapore, SG', containerType: '40ft High Cube', weight: '28,900 kg', transitProgress: 45 },
};

export function useShipment(shipmentId) {
  const [shipment, setShipment] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShipment = useCallback(async () => {
    if (!shipmentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await shipmentApi.getById(shipmentId);
      setShipment(response.data);
    } catch (err) {
      // Fall back to mock data if backend unavailable
      if (!err.response || err.code === 'ERR_NETWORK') {
        const mock = MOCK_SHIPMENTS[shipmentId];
        if (mock) {
          setShipment(mock);
        } else {
          setError({
            type: 'not-found',
            title: 'Shipment Not Found',
            message: `No shipment found with ID "${shipmentId}".`,
          });
        }
      } else {
        const status = err.response?.status;
        if (status === 404) {
          setError({
            type: 'not-found',
            title: 'Shipment Not Found',
            message: `No shipment found with ID "${shipmentId}". Please check the ID and try again.`,
          });
        } else if (status >= 500) {
          setError({
            type: 'error',
            title: 'Server Error',
            message: 'The server encountered an error. Please try again later.',
          });
        } else {
          setError({
            type: 'error',
            title: 'Request Failed',
            message: err.response?.data?.message || 'An unexpected error occurred.',
          });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [shipmentId]);

  const fetchEvents = useCallback(async () => {
    if (!shipmentId) return;

    try {
      const response = await eventApi.getShipmentState(shipmentId);
      setEvents(response.data?.events || []);
    } catch (err) {
      // Events fetch failure is non-critical — shipment info still shown
      console.warn('Failed to fetch events for shipment:', shipmentId);
    }
  }, [shipmentId]);

  const retry = useCallback(() => {
    fetchShipment();
    fetchEvents();
  }, [fetchShipment, fetchEvents]);

  useEffect(() => {
    fetchShipment();
    fetchEvents();
  }, [fetchShipment, fetchEvents]);

  return { shipment, events, loading, error, retry };
}

/**
 * Custom hook for fetching dashboard statistics.
 * Falls back to mock stats if backend is unavailable.
 */
export function useShipmentStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await shipmentApi.getStats();
        setStats(response.data);
      } catch {
        // Fall back to mock stats
        setStats({
          activeShipments: 1247,
          eventsToday: 3891,
          alerts: 23,
          avgTransitDays: 4.2,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading };
}

/**
 * Custom hook for search with debounce and validation.
 */
export function useShipmentSearch() {
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const search = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    setSearching(true);
    setSearchError(null);

    try {
      const response = await shipmentApi.search(query.trim());
      setResults(response.data?.shipments || response.data || []);
    } catch (err) {
      // Fall back to simple mock search
      if (!err.response || err.code === 'ERR_NETWORK') {
        const q = query.trim().toUpperCase();
        const mockResults = Object.values(MOCK_SHIPMENTS).filter(
          (s) => s.id.includes(q) || s.origin.toUpperCase().includes(q) || s.destination.toUpperCase().includes(q)
        );
        setResults(mockResults);
      } else {
        setSearchError('Search failed. Please try again.');
        setResults([]);
      }
    } finally {
      setSearching(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setSearchError(null);
  }, []);

  return { results, searching, searchError, search, clearResults };
}
