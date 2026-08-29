import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useToast } from '../components/Toast';
import './ShipmentDetail.css';

/**
 * Mock shipment data — simulates the CQRS read model
 * that would be populated by projecting events.
 */
const MOCK_SHIPMENTS = {
  'SHIP-2024-0847': {
    id: 'SHIP-2024-0847',
    status: 'In Transit',
    origin: 'Shanghai, CN',
    destination: 'Los Angeles, US',
    containerType: '40ft Refrigerated',
    weight: '22,450 kg',
    createdAt: '2024-08-15T08:00:00Z',
    lastUpdated: '2024-08-28T14:30:00Z',
    events: [
      { type: 'CONTAINER_CREATED', timestamp: '2024-08-15T08:00:00Z', actor: 'System', detail: 'Container registered for route Shanghai → Los Angeles' },
      { type: 'LOADED_ON_SHIP', timestamp: '2024-08-17T06:15:00Z', actor: 'Port Operator', detail: 'Loaded onto vessel MV Pacific Star at Yangshan Terminal' },
      { type: 'TEMPERATURE_SPIKE', timestamp: '2024-08-22T14:30:00Z', actor: 'IoT Sensor', detail: 'Temperature anomaly: 28.4°C (threshold: 25°C)' },
      { type: 'ARRIVED_AT_PORT', timestamp: '2024-08-28T14:30:00Z', actor: 'Port Authority', detail: 'Arrived at Port of Long Beach, Terminal J' },
    ],
  },
  'SHIP-2024-0621': {
    id: 'SHIP-2024-0621',
    status: 'Delivered',
    origin: 'Rotterdam, NL',
    destination: 'Mumbai, IN',
    containerType: '20ft Standard',
    weight: '14,200 kg',
    createdAt: '2024-07-20T10:00:00Z',
    lastUpdated: '2024-08-10T09:00:00Z',
    events: [
      { type: 'CONTAINER_CREATED', timestamp: '2024-07-20T10:00:00Z', actor: 'System', detail: 'Container registered for route Rotterdam → Mumbai' },
      { type: 'LOADED_ON_SHIP', timestamp: '2024-07-22T12:00:00Z', actor: 'Port Operator', detail: 'Loaded onto vessel MV Aegean Wave' },
      { type: 'ARRIVED_AT_PORT', timestamp: '2024-08-10T09:00:00Z', actor: 'Port Authority', detail: 'Arrived at Nhava Sheva Port, Mumbai' },
    ],
  },
  'SHIP-2024-0103': {
    id: 'SHIP-2024-0103',
    status: 'Alert',
    origin: 'Hamburg, DE',
    destination: 'Singapore, SG',
    containerType: '40ft High Cube',
    weight: '28,900 kg',
    createdAt: '2024-06-05T07:00:00Z',
    lastUpdated: '2024-08-25T16:45:00Z',
    events: [
      { type: 'CONTAINER_CREATED', timestamp: '2024-06-05T07:00:00Z', actor: 'System', detail: 'Container registered for route Hamburg → Singapore' },
      { type: 'LOADED_ON_SHIP', timestamp: '2024-06-07T08:30:00Z', actor: 'Port Operator', detail: 'Loaded onto vessel MV Northern Star' },
      { type: 'TEMPERATURE_SPIKE', timestamp: '2024-07-15T11:20:00Z', actor: 'IoT Sensor', detail: 'Temperature anomaly: 31.2°C (threshold: 25°C)' },
      { type: 'TEMPERATURE_SPIKE', timestamp: '2024-08-25T16:45:00Z', actor: 'IoT Sensor', detail: 'Temperature anomaly: 29.8°C (threshold: 25°C)' },
    ],
  },
};

const EVENT_TYPE_COLORS = {
  CONTAINER_CREATED: 'created',
  LOADED_ON_SHIP: 'loaded',
  TEMPERATURE_SPIKE: 'temperature',
  ARRIVED_AT_PORT: 'arrived',
};

function ShipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call with loading delay
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      const found = MOCK_SHIPMENTS[id];
      if (found) {
        setShipment(found);
        setError(null);
      } else {
        setError({
          type: 'not-found',
          title: 'Shipment Not Found',
          message: `No shipment found with ID "${id}". The backend event store will be connected in the next iteration.`,
        });
      }
      setLoading(false);
    }, 800); // Simulated network delay

    return () => clearTimeout(timer);
  }, [id]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    addToast({ type: 'info', message: 'Retrying...', duration: 1500 });
    // Re-trigger the effect
    const timer = setTimeout(() => {
      const found = MOCK_SHIPMENTS[id];
      if (found) {
        setShipment(found);
      } else {
        setError({
          type: 'not-found',
          title: 'Shipment Not Found',
          message: `No shipment found with ID "${id}".`,
        });
      }
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  };

  if (loading) {
    return (
      <div className="shipment-detail">
        <LoadingSpinner size="lg" message={`Loading shipment ${id}...`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="shipment-detail">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <ErrorMessage
          type={error.type}
          title={error.title}
          message={error.message}
          onRetry={handleRetry}
        />
      </div>
    );
  }

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
        {/* Shipment Info Card */}
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
            <span className="info-label">Container Type</span>
            <span className="info-value">{shipment.containerType}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Weight</span>
            <span className="info-value">{shipment.weight}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Created</span>
            <span className="info-value">{new Date(shipment.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Last Updated</span>
            <span className="info-value">{new Date(shipment.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Event History Card */}
        <div className="card detail-events">
          <div className="events-header">
            <h2 className="section-title">Event History</h2>
            <span className="events-count">{shipment.events.length} events</span>
          </div>
          <div className="events-timeline">
            {shipment.events.map((event, index) => (
              <div key={index} className="event-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`event-dot event-dot--${EVENT_TYPE_COLORS[event.type] || 'default'}`} />
                <div className="event-content">
                  <div className="event-top-row">
                    <span className={`event-type event-type--${EVENT_TYPE_COLORS[event.type] || 'default'}`}>
                      {event.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="event-detail">{event.detail}</p>
                  <div className="event-meta">
                    <span className="event-time">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                    <span className="event-separator">·</span>
                    <span className="event-actor">{event.actor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShipmentDetail;
