import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Timeline from '../components/Timeline';
import ProgressBar from '../components/ProgressBar';
import SkeletonLoader from '../components/SkeletonLoader';
import ExportButton from '../components/ExportButton';
import Breadcrumbs from '../components/Breadcrumbs';
import { useToast } from '../components/Toast';
import { shipmentApi } from '../services/api';
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
    transitProgress: 72,
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
    transitProgress: 100,
    events: [
      { type: 'CONTAINER_CREATED', timestamp: '2024-07-20T10:00:00Z', actor: 'System', detail: 'Container registered for route Rotterdam → Mumbai' },
      { type: 'LOADED_ON_SHIP', timestamp: '2024-07-22T12:00:00Z', actor: 'Port Operator', detail: 'Loaded onto vessel MV Aegean Wave' },
      { type: 'ARRIVED_AT_PORT', timestamp: '2024-08-10T09:00:00Z', actor: 'Port Authority', detail: 'Arrived at Nhava Sheva Port, Mumbai' },
      { type: 'DELIVERED', timestamp: '2024-08-12T09:00:00Z', actor: 'Logistics Team', detail: 'Successfully delivered to consignee' },
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
    transitProgress: 45,
    events: [
      { type: 'CONTAINER_CREATED', timestamp: '2024-06-05T07:00:00Z', actor: 'System', detail: 'Container registered for route Hamburg → Singapore' },
      { type: 'LOADED_ON_SHIP', timestamp: '2024-06-07T08:30:00Z', actor: 'Port Operator', detail: 'Loaded onto vessel MV Northern Star' },
      { type: 'TEMPERATURE_SPIKE', timestamp: '2024-07-15T11:20:00Z', actor: 'IoT Sensor', detail: 'Temperature anomaly: 31.2°C (threshold: 25°C)' },
      { type: 'TEMPERATURE_SPIKE', timestamp: '2024-08-25T16:45:00Z', actor: 'IoT Sensor', detail: 'Temperature anomaly: 29.8°C (threshold: 25°C)' },
    ],
  },
};

function ShipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShipment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Attempt real API call
      const response = await shipmentApi.getById(id);
      setShipment(response.data);
      setLoading(false);
    } catch (err) {
      // Fall back to mock data
      const found = MOCK_SHIPMENTS[id];
      if (found) {
        // Simulate network delay for mock
        setTimeout(() => {
          setShipment(found);
          setLoading(false);
        }, 600);
      } else {
        setError({
          type: 'not-found',
          title: 'Shipment Not Found',
          message: `No shipment found with ID "${id}". It may not exist in the event store yet.`,
        });
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchShipment();
  }, [id]);

  const handleRetry = () => {
    addToast({ type: 'info', message: 'Retrying...', duration: 1500 });
    fetchShipment();
  };

  const handleExport = (format) => {
    addToast({ type: 'success', message: `Shipment data exported as ${format.toUpperCase()}` });
  };

  const breadcrumbs = [
    { label: 'Dashboard', path: '/' },
    { label: 'Shipments', path: '/shipments' },
    { label: id },
  ];

  const getProgressColor = (status) => {
    if (status === 'Delivered') return 'success';
    if (status === 'Alert') return 'danger';
    return 'primary';
  };

  if (loading) {
    return (
      <div className="shipment-detail animate-fade-in">
        <Breadcrumbs items={breadcrumbs} />
        <div className="detail-skeleton">
          <SkeletonLoader variant="text" lines={2} />
          <div className="detail-grid" style={{ marginTop: '2rem' }}>
            <SkeletonLoader variant="stats" count={1} />
            <SkeletonLoader variant="text" lines={6} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shipment-detail">
        <Breadcrumbs items={breadcrumbs} />
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
      <Breadcrumbs items={breadcrumbs} />

      <header className="detail-header">
        <div>
          <h1 className="detail-title">Shipment {shipment.id}</h1>
          <p className="detail-route">{shipment.origin} → {shipment.destination}</p>
        </div>
        <div className="detail-header-actions">
          <ExportButton label="Export" onExport={handleExport} />
          <span className={`status-badge status-badge--${shipment.status.toLowerCase().replace(' ', '-')}`}>
            {shipment.status}
          </span>
        </div>
      </header>

      {/* Transit Progress */}
      {shipment.transitProgress !== undefined && (
        <div className="detail-progress-section">
          <div className="detail-progress-header">
            <span className="detail-progress-label">Transit Progress</span>
            <span className="detail-progress-value">{shipment.transitProgress}%</span>
          </div>
          <ProgressBar
            value={shipment.transitProgress}
            max={100}
            color={getProgressColor(shipment.status)}
            animated={shipment.status === 'In Transit'}
          />
        </div>
      )}

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
          <div className="info-row">
            <span className="info-label">Events</span>
            <span className="info-value mono">{shipment.events.length} recorded</span>
          </div>
        </div>

        {/* Event History — uses the Timeline component */}
        <div className="card detail-events">
          <Timeline events={shipment.events} title="Event History" />
        </div>
      </div>
    </div>
  );
}

export default ShipmentDetail;
