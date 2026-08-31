import React from 'react';
import './EventBadge.css';

/**
 * Event type display names and color mappings.
 * Maps raw event store types to user-friendly labels.
 */
const EVENT_CONFIG = {
  CONTAINER_CREATED: { label: 'Created', colorClass: 'created' },
  LOADED_ON_SHIP:    { label: 'Loaded',  colorClass: 'loaded' },
  TEMPERATURE_SPIKE: { label: 'Temp Alert', colorClass: 'temperature' },
  ARRIVED_AT_PORT:   { label: 'Arrived', colorClass: 'arrived' },
  CUSTOMS_CLEARED:   { label: 'Customs', colorClass: 'customs' },
  DELIVERED:         { label: 'Delivered', colorClass: 'delivered' },
  INSPECTION:        { label: 'Inspected', colorClass: 'inspection' },
};

/**
 * Reusable event type badge with gradient styling.
 * Displays a color-coded pill for event types from the event store.
 * 
 * @param {string} type - The event type key (e.g., 'CONTAINER_CREATED')
 * @param {string} size - 'sm' | 'md' (default: 'sm')
 * @param {boolean} showDot - Whether to show the colored dot (default: true)
 */
function EventBadge({ type, size = 'sm', showDot = true }) {
  const config = EVENT_CONFIG[type] || { label: type?.replace(/_/g, ' ') || 'Unknown', colorClass: 'default' };

  return (
    <span className={`event-badge event-badge--${config.colorClass} event-badge--${size}`}>
      {showDot && <span className={`event-badge-dot event-badge-dot--${config.colorClass}`} />}
      {config.label}
    </span>
  );
}

export { EVENT_CONFIG };
export default EventBadge;
