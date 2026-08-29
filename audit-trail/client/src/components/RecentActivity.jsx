import React from 'react';
import './RecentActivity.css';

/**
 * Mock recent activity data — will be replaced with
 * real event store queries once backend is connected.
 */
const MOCK_ACTIVITIES = [
  {
    id: 1,
    eventType: 'CONTAINER_CREATED',
    shipmentId: 'SHIP-2024-0847',
    description: 'New container created for route Shanghai → Los Angeles',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    actor: 'System',
  },
  {
    id: 2,
    eventType: 'LOADED_ON_SHIP',
    shipmentId: 'SHIP-2024-0621',
    description: 'Container loaded onto vessel MV Pacific Star',
    timestamp: new Date(Date.now() - 47 * 60000).toISOString(),
    actor: 'Port Operator',
  },
  {
    id: 3,
    eventType: 'TEMPERATURE_SPIKE',
    shipmentId: 'SHIP-2024-0103',
    description: 'Temperature anomaly detected: 28.4°C (threshold: 25°C)',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    actor: 'IoT Sensor',
  },
  {
    id: 4,
    eventType: 'ARRIVED_AT_PORT',
    shipmentId: 'SHIP-2024-0489',
    description: 'Container arrived at Port of Long Beach, Terminal J',
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    actor: 'Port Authority',
  },
  {
    id: 5,
    eventType: 'CONTAINER_CREATED',
    shipmentId: 'SHIP-2024-0952',
    description: 'New container created for route Rotterdam → Mumbai',
    timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
    actor: 'System',
  },
];

/**
 * Maps event types to color CSS class names.
 */
const EVENT_TYPE_COLORS = {
  CONTAINER_CREATED: 'created',
  LOADED_ON_SHIP: 'loaded',
  TEMPERATURE_SPIKE: 'temperature',
  ARRIVED_AT_PORT: 'arrived',
};

/**
 * Format a relative time string (e.g., "12 min ago", "5 hrs ago").
 */
function formatRelativeTime(isoString) {
  const now = Date.now();
  const diff = now - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function RecentActivity({ onShipmentClick }) {
  return (
    <div className="recent-activity card">
      <div className="recent-activity-header">
        <h2 className="section-title">Recent Events</h2>
        <span className="activity-count">{MOCK_ACTIVITIES.length} events</span>
      </div>
      <div className="activity-list">
        {MOCK_ACTIVITIES.map((activity, index) => (
          <div
            key={activity.id}
            className="activity-item"
            style={{ animationDelay: `${index * 0.06}s` }}
            onClick={() => onShipmentClick && onShipmentClick(activity.shipmentId)}
            role="button"
            tabIndex={0}
          >
            <div className={`activity-dot activity-dot--${EVENT_TYPE_COLORS[activity.eventType] || 'default'}`} />
            <div className="activity-content">
              <div className="activity-top-row">
                <span className={`activity-type activity-type--${EVENT_TYPE_COLORS[activity.eventType] || 'default'}`}>
                  {activity.eventType.replace(/_/g, ' ')}
                </span>
                <span className="activity-time">{formatRelativeTime(activity.timestamp)}</span>
              </div>
              <p className="activity-description">{activity.description}</p>
              <div className="activity-meta">
                <span className="activity-shipment">{activity.shipmentId}</span>
                <span className="activity-separator">·</span>
                <span className="activity-actor">{activity.actor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;
