import React, { useState, useMemo } from 'react';
import ShipmentCard from '../components/ShipmentCard';
import './Shipments.css';

/**
 * Mock shipment list — simulates the CQRS read model
 * projection of all active shipments.
 */
const ALL_SHIPMENTS = [
  { id: 'SHIP-2024-0847', route: 'Shanghai → Los Angeles', status: 'In Transit', containerType: '40ft Refrigerated', weight: '22,450 kg', lastEvent: 'ARRIVED_AT_PORT' },
  { id: 'SHIP-2024-0621', route: 'Rotterdam → Mumbai', status: 'Delivered', containerType: '20ft Standard', weight: '14,200 kg', lastEvent: 'DELIVERED' },
  { id: 'SHIP-2024-0103', route: 'Hamburg → Singapore', status: 'Alert', containerType: '40ft High Cube', weight: '28,900 kg', lastEvent: 'TEMPERATURE_SPIKE' },
  { id: 'SHIP-2024-0489', route: 'Busan → Seattle', status: 'In Transit', containerType: '20ft Standard', weight: '11,600 kg', lastEvent: 'LOADED_ON_SHIP' },
  { id: 'SHIP-2024-0952', route: 'Rotterdam → Mumbai', status: 'Created', containerType: '40ft Standard', weight: '19,800 kg', lastEvent: 'CONTAINER_CREATED' },
  { id: 'SHIP-2024-1100', route: 'Shenzhen → Hamburg', status: 'In Transit', containerType: '40ft Refrigerated', weight: '24,100 kg', lastEvent: 'LOADED_ON_SHIP' },
  { id: 'SHIP-2024-0755', route: 'Tokyo → Vancouver', status: 'Delivered', containerType: '20ft Standard', weight: '13,500 kg', lastEvent: 'DELIVERED' },
  { id: 'SHIP-2024-1203', route: 'Singapore → Sydney', status: 'In Transit', containerType: '40ft High Cube', weight: '26,700 kg', lastEvent: 'LOADED_ON_SHIP' },
];

const FILTER_OPTIONS = ['All', 'In Transit', 'Delivered', 'Alert', 'Created'];

function Shipments() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('id');

  const filtered = useMemo(() => {
    let result = ALL_SHIPMENTS;
    if (activeFilter !== 'All') {
      result = result.filter((s) => s.status === activeFilter);
    }
    return result.sort((a, b) => {
      if (sortBy === 'id') return a.id.localeCompare(b.id);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });
  }, [activeFilter, sortBy]);

  return (
    <div className="shipments-page animate-fade-in">
      <header className="shipments-header">
        <div>
          <h1 className="page-title">Shipments</h1>
          <p className="page-subtitle">Browse and manage all shipment containers</p>
        </div>
        <div className="shipments-count-badge">
          <span className="count-number">{filtered.length}</span>
          <span className="count-label">shipments</span>
        </div>
      </header>

      {/* Filters */}
      <div className="shipments-toolbar">
        <div className="filter-pills">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter}
              className={`filter-pill ${activeFilter === filter ? 'filter-pill--active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
              {filter !== 'All' && (
                <span className="filter-pill-count">
                  {ALL_SHIPMENTS.filter((s) => s.status === filter).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="sort-control">
          <label className="sort-label" htmlFor="sort-select">Sort by</label>
          <select
            id="sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="id">Shipment ID</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Shipment List */}
      <div className="shipments-grid">
        {filtered.map((shipment, index) => (
          <ShipmentCard key={shipment.id} shipment={shipment} index={index} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="shipments-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          <p>No shipments found for "{activeFilter}"</p>
          <button className="shipments-reset-btn" onClick={() => setActiveFilter('All')}>
            Show all shipments
          </button>
        </div>
      )}
    </div>
  );
}

export default Shipments;
