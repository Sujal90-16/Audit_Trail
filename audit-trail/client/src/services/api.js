import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Auth token management.
 * Automatically attach JWT to all requests if available.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('audit_trail_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response interceptor — redirect to login on 401.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('audit_trail_token');
      // Optionally trigger logout
    }
    return Promise.reject(error);
  }
);

/**
 * Auth API — matches server/src/routes/auth.routes.ts
 */
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

/**
 * Shipment Queries (CQRS Read Side) — matches server/src/routes/shipment.routes.ts
 */
export const shipmentApi = {
  // Get all shipments with pagination and filtering
  getAll: (params = {}) => api.get('/shipments', { params }),

  // Get shipment by aggregate ID
  getById: (aggregateId) => api.get(`/shipments/${aggregateId}`),

  // Get dashboard statistics
  getStats: () => api.get('/shipments/stats'),

  // Search shipments
  search: (query) => api.get('/shipments', { params: { q: query } }),
};

/**
 * Event API (CQRS Event Store) — matches server/src/routes/event.routes.ts
 */
export const eventApi = {
  // Get events with filtering
  getAll: (params = {}) => api.get('/events', { params }),

  // Create a new event
  create: (data) => api.post('/events', data),

  // Get current state of a shipment (replayed from events)
  getShipmentState: (aggregateId) => api.get(`/events/state/${aggregateId}`),

  // Rebuild projection for a shipment
  rebuildProjection: (aggregateId) => api.post(`/events/rebuild/${aggregateId}`),
};

/**
 * Shipment Commands (CQRS Write Side) — matches server/src/routes/command.routes.js
 */
export const commandApi = {
  create: (payload) => api.post('/commands/create', payload),
  move: (id, payload) => api.post('/commands/move', { aggregateId: id, ...payload }),
  load: (id, payload) => api.post('/commands/load', { aggregateId: id, ...payload }),
  deliver: (id, payload) => api.post('/commands/deliver', { aggregateId: id, ...payload }),
};

export default api;
