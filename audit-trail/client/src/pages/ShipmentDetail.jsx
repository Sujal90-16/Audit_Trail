import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ShipmentDetail.css';

function ShipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Placeholder — will be replaced with actual API calls
  const shipment = {
    id: id,
    status: 'In Transit',
    origin: 'Shanghai, CN',
    destination: 'Los Angeles, US',
    createdAt: '2024-08-15T08:00:00Z',
  };

  return (
    <div className="shipment-detail animate-fade-in">
      <button className="back-button" onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </button>

      <header className="detail-header">
        <div>
          <h1 className="detail-title">Shipment {shipment.id}</h1>
          <p className="detail-route">{shipment.origin} → {shipment.destination}</p>
        </div>
        <span className={`status-badge status-badge--${shipment.status.toLowerCase().replace(' ', '-')}`}>
          {shipment.status}
        </span>
      </header>

      <div className="detail-grid">
        <div className="card detail-info">
          <h2 className="section-title">Shipment Info</h2>
          <div className="info-row">
            <span className="info-label">Shipment ID</span>
            <span className="info-value mono">{shipment.id}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Status</span>
            <span className="info-value">{shipment.status}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Origin</span>
            <span className="info-value">{shipment.origin}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Destination</span>
            <span className="info-value">{shipment.destination}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Created</span>
            <span className="info-value">{new Date(shipment.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="card detail-timeline-placeholder">
          <h2 className="section-title">Event Timeline</h2>
          <div className="placeholder-content">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="placeholder-icon">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            <p>Timeline visualization coming in Week 2</p>
            <span className="placeholder-sub">Event replay & chronological history</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShipmentDetail;
