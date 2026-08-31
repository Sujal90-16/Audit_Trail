import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventBadge from './EventBadge';
import './ShipmentCard.css';

/**
 * ShipmentCard — Displays a shipment summary with route,
 * status, and last event info. Used in search results and lists.
 */
function ShipmentCard({ shipment, index = 0 }) {
  const navigate = useNavigate();

  const statusColors = {
    'In Transit': 'transit',
    'Delivered': 'delivered',
    'Alert': 'alert',
    'Created': 'created',
  };

  return (
    <div
      className="shipment-card card"
      onClick={() => navigate(`/shipment/${shipment.id}`)}
      style={{ animationDelay: `${index * 0.08}s` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/shipment/${shipment.id}`)}
    >
      {/* Gradient accent line */}
      <div className="shipment-card-accent" />

      <div className="shipment-card-header">
        <div className="shipment-card-id-row">
          <span className="shipment-card-id">{shipment.id}</span>
          <span className={`shipment-card-status shipment-card-status--${statusColors[shipment.status] || 'default'}`}>
            {shipment.status}
          </span>
        </div>
        <p className="shipment-card-route">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20"/>
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
          {shipment.route}
        </p>
      </div>

      <div className="shipment-card-footer">
        <div className="shipment-card-meta">
          {shipment.containerType && (
            <span className="shipment-card-meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              </svg>
              {shipment.containerType}
            </span>
          )}
          {shipment.weight && (
            <span className="shipment-card-meta-item">{shipment.weight}</span>
          )}
        </div>
        {shipment.lastEvent && (
          <EventBadge type={shipment.lastEvent} size="sm" />
        )}
      </div>

      {/* Hover arrow */}
      <div className="shipment-card-arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  );
}

export default ShipmentCard;
