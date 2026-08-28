import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Shipment Queries (CQRS Read Side)
 */
export const shipmentApi = {
  // Get shipment by ID — reconstructs state from events
  getById: (id) => api.get(`/shipment/${id}`),

  // Get all events for a shipment (raw event stream)
  getEvents: (id) => api.get(`/shipment/${id}/events`),

  // Search shipments
  search: (query) => api.get(`/shipments/search`, { params: { q: query } }),

  // Get shipment state at a specific point in time
  getStateAt: (id, timestamp) =>
    api.get(`/shipment/${id}/state`, { params: { at: timestamp } }),
};

/**
 * Shipment Commands (CQRS Write Side)
 */
export const commandApi = {
  // Record a shipment movement
  move: (id, payload) => api.post(`/shipment/move`, { aggregateId: id, ...payload }),

  // Create a new shipment container
  create: (payload) => api.post(`/shipment/create`, payload),
};

export default api;
