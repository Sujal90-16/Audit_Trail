import React, { useState } from 'react';
import EventBadge from './EventBadge';
import './Timeline.css';

/**
 * Icon map for event types — renders inline SVGs per type.
 */
const EVENT_ICONS = {
  CONTAINER_CREATED: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  LOADED_ON_SHIP: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20M5 20V10l7-5 7 5v10"/>
      <path d="M9 20v-4h6v4"/>
    </svg>
  ),
  TEMPERATURE_SPIKE: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/>
    </svg>
  ),
  ARRIVED_AT_PORT: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  DELIVERED: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22,4 12,14.01 9,11.01"/>
    </svg>
  ),
  CUSTOMS_CLEARED: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
};

const COLOR_MAP = {
  CONTAINER_CREATED: 'created',
  LOADED_ON_SHIP: 'loaded',
  TEMPERATURE_SPIKE: 'temperature',
  ARRIVED_AT_PORT: 'arrived',
  DELIVERED: 'delivered',
  CUSTOMS_CLEARED: 'customs',
};

/**
 * Calculate time difference between two timestamps as human-readable string.
 */
function formatDuration(from, to) {
  const diff = new Date(to) - new Date(from);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (days > 0) {
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }
  if (hours > 0) return `${hours}h`;
  const minutes = Math.floor(diff / 60000);
  return `${minutes}m`;
}

/**
 * Timeline — Vertical timeline component to render the raw sequence
 * of events for a given shipment. This is the Week 2 core deliverable.
 *
 * Features:
 * - Vertical layout with colored event nodes and connector lines
 * - Expandable event details on click
 * - Duration calculation between consecutive events
 * - Event type icons and badges
 * - Animated staggered entry
 *
 * @param {Array} events - Array of event objects from the event store
 * @param {string} title - Optional section title
 */
function Timeline({ events = [], title = 'Event Timeline' }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!events || events.length === 0) {
    return (
      <div className="timeline-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
        <p>No events recorded yet</p>
        <span>Events will appear here as they are appended to the store</span>
      </div>
    );
  }

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="timeline">
      <div className="timeline-header">
        <h3 className="timeline-title">{title}</h3>
        <span className="timeline-count">{events.length} events</span>
      </div>

      <div className="timeline-track">
        {events.map((event, index) => {
          const colorClass = COLOR_MAP[event.type] || 'default';
          const isExpanded = expandedIndex === index;
          const isLast = index === events.length - 1;
          const duration = index > 0
            ? formatDuration(events[index - 1].timestamp, event.timestamp)
            : null;

          return (
            <div
              key={index}
              className={`timeline-item ${isExpanded ? 'timeline-item--expanded' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Duration badge between events */}
              {duration && (
                <div className="timeline-duration">
                  <span className="timeline-duration-badge">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    {duration}
                  </span>
                </div>
              )}

              {/* Node */}
              <div className="timeline-node-row" onClick={() => toggleExpand(index)}>
                <div className={`timeline-node timeline-node--${colorClass}`}>
                  {EVENT_ICONS[event.type] || (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="4"/>
                    </svg>
                  )}
                </div>

                {/* Connector line */}
                {!isLast && <div className={`timeline-connector timeline-connector--${colorClass}`} />}

                <div className="timeline-content">
                  <div className="timeline-content-top">
                    <EventBadge type={event.type} size="sm" showDot={false} />
                    <span className="timeline-timestamp">
                      {new Date(event.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="timeline-detail">{event.detail}</p>

                  {/* Expandable section */}
                  <div className={`timeline-expand ${isExpanded ? 'timeline-expand--visible' : ''}`}>
                    <div className="timeline-expand-grid">
                      <div className="timeline-expand-item">
                        <span className="expand-label">Actor</span>
                        <span className="expand-value">{event.actor}</span>
                      </div>
                      <div className="timeline-expand-item">
                        <span className="expand-label">Timestamp</span>
                        <span className="expand-value mono">{event.timestamp}</span>
                      </div>
                      <div className="timeline-expand-item">
                        <span className="expand-label">Event Type</span>
                        <span className="expand-value mono">{event.type}</span>
                      </div>
                      {event.payload && (
                        <div className="timeline-expand-item timeline-expand-item--full">
                          <span className="expand-label">Payload</span>
                          <pre className="expand-payload">{JSON.stringify(event.payload, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expand toggle hint */}
                  <button className="timeline-expand-toggle" onClick={(e) => { e.stopPropagation(); toggleExpand(index); }}>
                    <svg
                      width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className={`expand-chevron ${isExpanded ? 'expand-chevron--open' : ''}`}
                    >
                      <polyline points="6,9 12,15 18,9"/>
                    </svg>
                    {isExpanded ? 'Less' : 'Details'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline summary */}
      <div className="timeline-summary">
        <div className="timeline-summary-item">
          <span className="summary-label">Total Duration</span>
          <span className="summary-value">
            {formatDuration(events[0].timestamp, events[events.length - 1].timestamp)}
          </span>
        </div>
        <div className="timeline-summary-item">
          <span className="summary-label">First Event</span>
          <span className="summary-value">
            {new Date(events[0].timestamp).toLocaleDateString()}
          </span>
        </div>
        <div className="timeline-summary-item">
          <span className="summary-label">Latest Event</span>
          <span className="summary-value">
            {new Date(events[events.length - 1].timestamp).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Timeline;
