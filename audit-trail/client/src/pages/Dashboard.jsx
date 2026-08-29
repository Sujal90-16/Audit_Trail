import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import SearchBar from '../components/SearchBar';
import StatsCard from '../components/StatsCard';
import RecentActivity from '../components/RecentActivity';
import './Dashboard.css';

/**
 * Validates a shipment ID format.
 * Accepted formats: SHIP-YYYY-NNNN or any alphanumeric with hyphens (min 3 chars).
 */
function validateShipmentId(id) {
  if (!id || id.trim().length < 3) {
    return { valid: false, message: 'Shipment ID must be at least 3 characters long.' };
  }
  if (!/^[A-Za-z0-9\-]+$/.test(id.trim())) {
    return { valid: false, message: 'Shipment ID can only contain letters, numbers, and hyphens.' };
  }
  return { valid: true };
}

function Dashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [recentSearches, setRecentSearches] = useState([
    'SHIP-2024-0847',
    'SHIP-2024-0621',
    'SHIP-2024-0103',
  ]);

  const handleSearch = (shipmentId) => {
    const trimmed = shipmentId.trim();
    const validation = validateShipmentId(trimmed);

    if (!validation.valid) {
      addToast({ type: 'warning', message: validation.message });
      return;
    }

    // Add to recent searches (avoid duplicates, keep max 5)
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== trimmed);
      return [trimmed, ...filtered].slice(0, 5);
    });

    addToast({ type: 'info', message: `Searching for shipment ${trimmed}...`, duration: 2000 });
    navigate(`/shipment/${trimmed}`);
  };

  const handleActivityClick = (shipmentId) => {
    navigate(`/shipment/${shipmentId}`);
  };

  return (
    <div className="dashboard animate-fade-in">
      <header className="dashboard-header">
        <div className="header-text">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Monitor shipments, track events, and audit the immutable ledger
          </p>
        </div>
        <div className="header-badge">
          <span className="badge-dot"></span>
          <span>Live</span>
        </div>
      </header>

      {/* Search Section */}
      <section className="search-section">
        <SearchBar onSearch={handleSearch} />
        <div className="recent-searches">
          <span className="recent-label">Recent:</span>
          {recentSearches.map((id) => (
            <button
              key={id}
              className="recent-chip"
              onClick={() => handleSearch(id)}
            >
              {id}
            </button>
          ))}
        </div>
      </section>

      {/* Stats Overview */}
      <section className="stats-grid">
        <StatsCard
          title="Active Shipments"
          value="1,247"
          change="+12%"
          changeType="positive"
          icon="package"
        />
        <StatsCard
          title="Events Today"
          value="3,891"
          change="+8%"
          changeType="positive"
          icon="activity"
        />
        <StatsCard
          title="Alerts"
          value="23"
          change="-5%"
          changeType="negative"
          icon="alert"
        />
        <StatsCard
          title="Avg. Transit Time"
          value="4.2 days"
          change="-0.3"
          changeType="positive"
          icon="clock"
        />
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => navigate('/shipment/search')}>
            <div className="action-icon action-icon--search">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
            <span className="action-label">Look Up Shipment</span>
            <span className="action-desc">Search by ID or container</span>
          </button>

          <button className="action-card" onClick={() => navigate('/timeline')}>
            <div className="action-icon action-icon--timeline">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
            </div>
            <span className="action-label">View Timeline</span>
            <span className="action-desc">Browse event history</span>
          </button>

          <button className="action-card">
            <div className="action-icon action-icon--audit">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span className="action-label">Audit Log</span>
            <span className="action-desc">Immutable event store</span>
          </button>
        </div>
      </section>

      {/* Recent Activity Feed */}
      <RecentActivity onShipmentClick={handleActivityClick} />
    </div>
  );
}

export default Dashboard;
