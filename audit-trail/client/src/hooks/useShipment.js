import { useState, useEffect, useCallback } from 'react';
import { shipmentApi } from '../services/api';

/**
 * Custom hook for fetching and managing shipment data.
 * Handles loading states, error handling, and data caching.
 * 
 * Follows the CQRS read-side pattern — queries the projected state
 * reconstructed from the event store.
 */
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
          message: 'The server encountered an error while processing your request. Please try again later.',
        });
      } else {
        setError({
          type: 'error',
          title: 'Connection Error',
          message: 'Unable to reach the server. Please check your connection and try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [shipmentId]);

  const fetchEvents = useCallback(async () => {
    if (!shipmentId) return;

    try {
      const response = await shipmentApi.getEvents(shipmentId);
      setEvents(response.data);
    } catch (err) {
      // Events fetch failure is non-critical — shipment info still shown
      console.warn('Failed to fetch events for shipment:', shipmentId, err);
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
      setResults(response.data);
    } catch (err) {
      setSearchError('Search failed. Please try again.');
      setResults([]);
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
