import React from 'react';
import './ProgressBar.css';

/**
 * ProgressBar — Animated gradient progress bar with optional label.
 *
 * Supports multiple color variants and sizes. Animates on mount
 * with a smooth width transition and optional shine effect.
 *
 * @param {number} value - Progress value (0-100)
 * @param {string} label - Optional text label
 * @param {string} variant - 'primary' | 'success' | 'warning' | 'danger' | 'info' (default: 'primary')
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} showValue - Whether to display the percentage (default: true)
 * @param {boolean} animated - Whether to show the shine animation (default: true)
 */
function ProgressBar({
  value = 0,
  label,
  variant = 'primary',
  size = 'md',
  showValue = true,
  animated = true,
}) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="progress-bar-container">
      {(label || showValue) && (
        <div className="progress-bar-header">
          {label && <span className="progress-bar-label">{label}</span>}
          {showValue && (
            <span className={`progress-bar-value progress-bar-value--${variant}`}>
              {clampedValue}%
            </span>
          )}
        </div>
      )}
      <div className={`progress-bar-track progress-bar-track--${size}`}>
        <div
          className={`progress-bar-fill progress-bar-fill--${variant} ${animated ? 'progress-bar-fill--animated' : ''}`}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

/**
 * ProgressBarGroup — Renders multiple progress bars together,
 * useful for showing comparative metrics.
 */
function ProgressBarGroup({ items = [], size = 'sm' }) {
  return (
    <div className="progress-bar-group">
      {items.map((item, index) => (
        <ProgressBar
          key={index}
          value={item.value}
          label={item.label}
          variant={item.variant || 'primary'}
          size={size}
          showValue={item.showValue !== undefined ? item.showValue : true}
          animated={item.animated !== undefined ? item.animated : true}
        />
      ))}
    </div>
  );
}

export { ProgressBarGroup };
export default ProgressBar;
