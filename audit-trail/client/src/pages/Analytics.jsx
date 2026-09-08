import React, { useState } from 'react';
import EventBadge from '../components/EventBadge';
import './Analytics.css';

/**
 * Mock analytics data — simulates aggregated queries
 * from the CQRS read model projections.
 */
const MONTHLY_EVENTS = [
  { month: 'Mar', count: 142 },
  { month: 'Apr', count: 218 },
  { month: 'May', count: 176 },
  { month: 'Jun', count: 305 },
  { month: 'Jul', count: 287 },
  { month: 'Aug', count: 391 },
];

const EVENT_DISTRIBUTION = [
  { type: 'CONTAINER_CREATED', count: 412, percentage: 33 },
  { type: 'LOADED_ON_SHIP', count: 356, percentage: 28 },
  { type: 'ARRIVED_AT_PORT', count: 298, percentage: 24 },
  { type: 'TEMPERATURE_SPIKE', count: 89, percentage: 7 },
  { type: 'DELIVERED', count: 102, percentage: 8 },
];

const TOP_ROUTES = [
  { route: 'Shanghai → Los Angeles', shipments: 187, percentage: 85 },
  { route: 'Rotterdam → Mumbai', shipments: 143, percentage: 65 },
  { route: 'Hamburg → Singapore', shipments: 126, percentage: 57 },
  { route: 'Busan → Seattle', shipments: 98, percentage: 45 },
  { route: 'Shenzhen → Hamburg', shipments: 84, percentage: 38 },
];

const DONUT_COLORS = {
  CONTAINER_CREATED: '#43e97b',
  LOADED_ON_SHIP: '#4facfe',
  ARRIVED_AT_PORT: '#a18cd1',
  TEMPERATURE_SPIKE: '#fda085',
  DELIVERED: '#22c55e',
};

const KPI_CARDS = [
  { label: 'Total Shipments', value: '1,247', trend: '+12.4%', trendUp: true, icon: 'package' },
  { label: 'Events Processed', value: '15,219', trend: '+8.7%', trendUp: true, icon: 'activity' },
  { label: 'Avg Transit Time', value: '4.2 days', trend: '-0.3 days', trendUp: true, icon: 'clock' },
  { label: 'Alert Rate', value: '5.8%', trend: '-1.2%', trendUp: true, icon: 'shield' },
];

function Analytics() {
  const [timeRange, setTimeRange] = useState('6m');
  const maxCount = Math.max(...MONTHLY_EVENTS.map((m) => m.count));

  // Build donut chart conic gradient
  let cumulativePercent = 0;
  const donutSegments = EVENT_DISTRIBUTION.map((item) => {
    const start = cumulativePercent;
    cumulativePercent += item.percentage;
    return `${DONUT_COLORS[item.type]} ${start}% ${cumulativePercent}%`;
  });
  const donutGradient = `conic-gradient(${donutSegments.join(', ')})`;

  return (
    <div className="analytics-page animate-fade-in">
      <header className="analytics-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Event store metrics and shipment performance insights</p>
        </div>
        <div className="time-range-selector">
          {['1m', '3m', '6m', '1y'].map((range) => (
            <button
              key={range}
              className={`time-range-btn ${timeRange === range ? 'time-range-btn--active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </header>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {KPI_CARDS.map((kpi, index) => (
          <div key={kpi.label} className="kpi-card card" style={{ animationDelay: `${index * 0.08}s` }}>
            <div className="kpi-header">
              <span className="kpi-label">{kpi.label}</span>
              <div className={`kpi-icon kpi-icon--${kpi.icon}`}>
                {kpi.icon === 'package' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                  </svg>
                )}
                {kpi.icon === 'activity' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                  </svg>
                )}
                {kpi.icon === 'clock' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                )}
                {kpi.icon === 'shield' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                )}
              </div>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className={`kpi-trend ${kpi.trendUp ? 'kpi-trend--up' : 'kpi-trend--down'}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {kpi.trendUp
                  ? <polyline points="18,15 12,9 6,15"/>
                  : <polyline points="6,9 12,15 18,9"/>
                }
              </svg>
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-grid">
        {/* Bar Chart — Monthly Events */}
        <div className="card analytics-chart">
          <h2 className="section-title">Events Over Time</h2>
          <div className="bar-chart">
            {MONTHLY_EVENTS.map((item, index) => (
              <div key={item.month} className="bar-column" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="bar-value">{item.count}</div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ height: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
                <div className="bar-label">{item.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart — Event Distribution */}
        <div className="card analytics-donut">
          <h2 className="section-title">Event Distribution</h2>
          <div className="donut-container">
            <div className="donut" style={{ background: donutGradient }}>
              <div className="donut-hole">
                <span className="donut-total">{EVENT_DISTRIBUTION.reduce((s, e) => s + e.count, 0)}</span>
                <span className="donut-total-label">events</span>
              </div>
            </div>
            <div className="donut-legend">
              {EVENT_DISTRIBUTION.map((item) => (
                <div key={item.type} className="legend-item">
                  <EventBadge type={item.type} size="sm" />
                  <span className="legend-count">{item.count}</span>
                  <span className="legend-percent">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Routes */}
        <div className="card analytics-routes">
          <h2 className="section-title">Top Routes</h2>
          <div className="routes-list">
            {TOP_ROUTES.map((item, index) => (
              <div key={item.route} className="route-item" style={{ animationDelay: `${index * 0.08}s` }}>
                <div className="route-info">
                  <span className="route-rank">#{index + 1}</span>
                  <div className="route-text">
                    <span className="route-name">{item.route}</span>
                    <span className="route-count">{item.shipments} shipments</span>
                  </div>
                </div>
                <div className="route-bar-track">
                  <div className="route-bar-fill" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
