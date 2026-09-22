import React from 'react';
import './StatusIndicator.css';

/**
 * Status type definitions with labels, colors, and descriptions.
 */
const STATUS_CONFIG = {
  connected: {
    label: 'Connected',
    description: 'Event store connection active',
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
  },
  syncing: {
    label: 'Syncing',
    description: 'Synchronizing with event store...',
    color: '#4facfe',
    gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
  },
  warning: {
    label: 'Degraded',
    description: 'Some services experiencing issues',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #fda085, #f6d365)',
  },
  error: {
    label: 'Disconnected',
    description: 'Unable to reach event store',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
  },
  maintenance: {
    label: 'Maintenance',
    description: 'Scheduled maintenance in progress',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  },
};

/**
 * StatusIndicator — Animated connection status with pulse effect.
 *
 * @param {string} status - 'connected' | 'syncing' | 'warning' | 'error' | 'maintenance'
 * @param {string} variant - 'dot' | 'badge' | 'card' (default: 'badge')
 * @param {boolean} showDescription - Whether to show description text (default: false)
 */
function StatusIndicator({ status = 'connected', variant = 'badge', showDescription = false }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.connected;

  if (variant === 'dot') {
    return (
      <span
        className={`status-dot-indicator status-dot-indicator--${status}`}
        style={{ '--status-color': config.color }}
        title={config.label}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div className="status-card" style={{ '--status-color': config.color, '--status-gradient': config.gradient }}>
        <div className="status-card-icon">
          <span className={`status-dot-indicator status-dot-indicator--${status}`} style={{ '--status-color': config.color }} />
        </div>
        <div className="status-card-text">
          <span className="status-card-label">{config.label}</span>
          <span className="status-card-desc">{config.description}</span>
        </div>
        {status === 'syncing' && <span className="status-card-spinner" />}
      </div>
    );
  }

  // Default: badge
  return (
    <div className={`status-badge status-badge--${status}`} style={{ '--status-color': config.color }}>
      <span className={`status-dot-indicator status-dot-indicator--${status}`} style={{ '--status-color': config.color }} />
      <span className="status-badge-label">{config.label}</span>
      {showDescription && <span className="status-badge-desc">{config.description}</span>}
    </div>
  );
}

export default StatusIndicator;
