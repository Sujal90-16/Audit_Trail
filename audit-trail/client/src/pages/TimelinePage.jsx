import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Timeline from '../components/Timeline';
import EventBadge from '../components/EventBadge';
import './TimelinePage.css';

/**
 * Mock global event log — simulates querying the full event store
 * across all shipments. Sorted newest-first by default.
 */
const ALL_EVENTS = [
  { type: 'ARRIVED_AT_PORT', timestamp: '2024-08-28T14:30:00Z', actor: 'Port Authority', detail: 'Arrived at Port of Long Beach, Terminal J', shipmentId: 'SHIP-2024-0847' },
  { type: 'TEMPERATURE_SPIKE', timestamp: '2024-08-25T16:45:00Z', actor: 'IoT Sensor', detail: 'Temperature anomaly: 29.8°C (threshold: 25°C)', shipmentId: 'SHIP-2024-0103' },
  { type: 'TEMPERATURE_SPIKE', timestamp: '2024-08-22T14:30:00Z', actor: 'IoT Sensor', detail: 'Temperature anomaly: 28.4°C (threshold: 25°C)', shipmentId: 'SHIP-2024-0847' },
  { type: 'LOADED_ON_SHIP', timestamp: '2024-08-20T09:00:00Z', actor: 'Port Operator', detail: 'Loaded onto vessel MV Pacific Voyager', shipmentId: 'SHIP-2024-1203' },
  { type: 'LOADED_ON_SHIP', timestamp: '2024-08-18T11:30:00Z', actor: 'Port Operator', detail: 'Loaded onto vessel MV Ocean Runner', shipmentId: 'SHIP-2024-1100' },
  { type: 'LOADED_ON_SHIP', timestamp: '2024-08-17T06:15:00Z', actor: 'Port Operator', detail: 'Loaded onto vessel MV Pacific Star at Yangshan Terminal', shipmentId: 'SHIP-2024-0847' },
  { type: 'CONTAINER_CREATED', timestamp: '2024-08-15T08:00:00Z', actor: 'System', detail: 'Container registered for route Shanghai → Los Angeles', shipmentId: 'SHIP-2024-0847' },
  { type: 'CONTAINER_CREATED', timestamp: '2024-08-14T10:00:00Z', actor: 'System', detail: 'Container registered for route Singapore → Sydney', shipmentId: 'SHIP-2024-1203' },
  { type: 'CONTAINER_CREATED', timestamp: '2024-08-12T07:00:00Z', actor: 'System', detail: 'Container registered for route Shenzhen → Hamburg', shipmentId: 'SHIP-2024-1100' },
  { type: 'ARRIVED_AT_PORT', timestamp: '2024-08-10T09:00:00Z', actor: 'Port Authority', detail: 'Arrived at Nhava Sheva Port, Mumbai', shipmentId: 'SHIP-2024-0621' },
  { type: 'LOADED_ON_SHIP', timestamp: '2024-07-22T12:00:00Z', actor: 'Port Operator', detail: 'Loaded onto vessel MV Aegean Wave', shipmentId: 'SHIP-2024-0621' },
  { type: 'CONTAINER_CREATED', timestamp: '2024-07-20T10:00:00Z', actor: 'System', detail: 'Container registered for route Rotterdam → Mumbai', shipmentId: 'SHIP-2024-0621' },
  { type: 'TEMPERATURE_SPIKE', timestamp: '2024-07-15T11:20:00Z', actor: 'IoT Sensor', detail: 'Temperature anomaly: 31.2°C (threshold: 25°C)', shipmentId: 'SHIP-2024-0103' },
  { type: 'LOADED_ON_SHIP', timestamp: '2024-06-07T08:30:00Z', actor: 'Port Operator', detail: 'Loaded onto vessel MV Northern Star', shipmentId: 'SHIP-2024-0103' },
  { type: 'CONTAINER_CREATED', timestamp: '2024-06-05T07:00:00Z', actor: 'System', detail: 'Container registered for route Hamburg → Singapore', shipmentId: 'SHIP-2024-0103' },
];

const EVENT_FILTERS = [
  { key: 'ALL', label: 'All Events' },
  { key: 'CONTAINER_CREATED', label: 'Created' },
  { key: 'LOADED_ON_SHIP', label: 'Loaded' },
  { key: 'TEMPERATURE_SPIKE', label: 'Alerts' },
  { key: 'ARRIVED_AT_PORT', label: 'Arrived' },
];

/**
 * Group events by date for the timeline section headers.
 */
function groupByDate(events) {
  const groups = {};
  events.forEach((event) => {
    const date = new Date(event.timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(event);
  });
  return groups;
}

function TimelinePage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filtered = useMemo(() => {
    if (activeFilter === 'ALL') return ALL_EVENTS;
    return ALL_EVENTS.filter((e) => e.type === activeFilter);
  }, [activeFilter]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  // Stats
  const stats = useMemo(() => ({
    total: ALL_EVENTS.length,
    alerts: ALL_EVENTS.filter((e) => e.type === 'TEMPERATURE_SPIKE').length,
    shipments: new Set(ALL_EVENTS.map((e) => e.shipmentId)).size,
    latest: ALL_EVENTS.length > 0
      ? new Date(ALL_EVENTS[0].timestamp).toLocaleDateString()
      : '—',
  }), []);

  return (
    <div className="timeline-page animate-fade-in">
      <header className="timeline-page-header">
        <div>
          <h1 className="page-title">Event Timeline</h1>
          <p className="page-subtitle">Immutable audit log — every event across all shipments</p>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="timeline-stats-bar">
        <div className="timeline-stat">
          <span className="timeline-stat-value">{stats.total}</span>
          <span className="timeline-stat-label">Total Events</span>
        </div>
        <div className="timeline-stat-divider" />
        <div className="timeline-stat">
          <span className="timeline-stat-value timeline-stat-value--alert">{stats.alerts}</span>
          <span className="timeline-stat-label">Alerts</span>
        </div>
        <div className="timeline-stat-divider" />
        <div className="timeline-stat">
          <span className="timeline-stat-value">{stats.shipments}</span>
          <span className="timeline-stat-label">Shipments</span>
        </div>
        <div className="timeline-stat-divider" />
        <div className="timeline-stat">
          <span className="timeline-stat-value">{stats.latest}</span>
          <span className="timeline-stat-label">Latest Event</span>
        </div>
      </div>

      {/* Event Type Filters */}
      <div className="timeline-filters">
        {EVENT_FILTERS.map((filter) => {
          const count = filter.key === 'ALL'
            ? ALL_EVENTS.length
            : ALL_EVENTS.filter((e) => e.type === filter.key).length;

          return (
            <button
              key={filter.key}
              className={`timeline-filter-btn ${activeFilter === filter.key ? 'timeline-filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.key !== 'ALL' && <EventBadge type={filter.key} size="sm" showDot={true} />}
              {filter.key === 'ALL' && <span>{filter.label}</span>}
              <span className="timeline-filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Grouped Timeline */}
      <div className="timeline-groups">
        {Object.entries(grouped).map(([date, events]) => (
          <div key={date} className="timeline-date-group">
            <div className="timeline-date-header">
              <div className="timeline-date-line" />
              <span className="timeline-date-label">{date}</span>
              <div className="timeline-date-line" />
            </div>

            <div className="timeline-date-events">
              {events.map((event, index) => (
                <div
                  key={`${event.shipmentId}-${index}`}
                  className="timeline-event-card card"
                  onClick={() => navigate(`/shipment/${event.shipmentId}`)}
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <div className="timeline-event-top">
                    <EventBadge type={event.type} size="sm" />
                    <span className="timeline-event-time">
                      {new Date(event.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="timeline-event-detail">{event.detail}</p>
                  <div className="timeline-event-bottom">
                    <span className="timeline-event-shipment">{event.shipmentId}</span>
                    <span className="timeline-event-actor">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      {event.actor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="timeline-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
          <p>No events match the selected filter</p>
          <button className="timeline-reset-btn" onClick={() => setActiveFilter('ALL')}>
            Show all events
          </button>
        </div>
      )}
    </div>
  );
}

export default TimelinePage;
