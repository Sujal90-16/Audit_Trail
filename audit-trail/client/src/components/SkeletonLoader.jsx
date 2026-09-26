import React from 'react';
import './SkeletonLoader.css';

/**
 * SkeletonLoader — Shimmer loading placeholders.
 *
 * Renders animated skeleton shapes while content loads.
 * Supports various preset layouts for cards, tables, and text.
 *
 * @param {string} variant - 'text' | 'card' | 'avatar' | 'table' | 'stats' (default: 'text')
 * @param {number} lines - Number of text lines (for 'text' variant, default: 3)
 * @param {number} count - Number of items to repeat (for 'card'/'stats', default: 1)
 */
function SkeletonLoader({ variant = 'text', lines = 3, count = 1 }) {
  if (variant === 'avatar') {
    return (
      <div className="skeleton-row">
        <div className="skeleton skeleton--circle" />
        <div className="skeleton-col" style={{ flex: 1 }}>
          <div className="skeleton skeleton--line" style={{ width: '40%' }} />
          <div className="skeleton skeleton--line skeleton--sm" style={{ width: '60%' }} />
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="skeleton-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton skeleton--rect" />
            <div className="skeleton-card-body">
              <div className="skeleton skeleton--line" style={{ width: '70%' }} />
              <div className="skeleton skeleton--line skeleton--sm" style={{ width: '90%' }} />
              <div className="skeleton skeleton--line skeleton--sm" style={{ width: '50%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'stats') {
    return (
      <div className="skeleton-stats">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-stat-card">
            <div className="skeleton skeleton--line skeleton--sm" style={{ width: '50%' }} />
            <div className="skeleton skeleton--line skeleton--lg" style={{ width: '40%' }} />
            <div className="skeleton skeleton--line skeleton--sm" style={{ width: '70%' }} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="skeleton-table">
        <div className="skeleton-table-header">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton skeleton--line skeleton--sm" style={{ width: `${60 + i * 10}%` }} />
          ))}
        </div>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="skeleton-table-row">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="skeleton skeleton--line skeleton--sm" style={{ width: `${50 + j * 12}%` }} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Default: text lines
  return (
    <div className="skeleton-text">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton skeleton--line"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export default SkeletonLoader;
