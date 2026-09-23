import React from 'react';
import Tabs, { TabPanel } from '../components/Tabs';
import './HelpPage.css';

/**
 * HelpPage — Documentation and API reference for the audit trail system.
 * Covers CQRS architecture, event types, API endpoints, and usage guides.
 */

const EVENT_TYPES_DOC = [
  { type: 'CONTAINER_CREATED', description: 'A new shipping container is registered in the system', fields: 'origin, destination, containerType, weight' },
  { type: 'LOADED_ON_SHIP', description: 'Container is loaded onto a vessel at the origin port', fields: 'vesselName, terminal, timestamp' },
  { type: 'ARRIVED_AT_PORT', description: 'Container arrives at a destination or transit port', fields: 'port, terminal, timestamp' },
  { type: 'TEMPERATURE_SPIKE', description: 'Temperature sensor exceeds configured threshold', fields: 'temperature, threshold, duration' },
  { type: 'DELIVERED', description: 'Container is delivered to the final recipient', fields: 'receivedBy, timestamp, condition' },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/shipments', description: 'List all shipments (read-side projection)' },
  { method: 'GET', path: '/api/shipments/:id', description: 'Get shipment detail with event history' },
  { method: 'GET', path: '/api/events', description: 'Query the global event stream' },
  { method: 'GET', path: '/api/analytics', description: 'Aggregated analytics from projections' },
  { method: 'POST', path: '/api/commands/create', description: 'Dispatch CreateShipment command' },
  { method: 'POST', path: '/api/commands/move', description: 'Dispatch MoveShipment command' },
  { method: 'POST', path: '/api/commands/deliver', description: 'Dispatch DeliverShipment command' },
];

function HelpPage() {
  const [activeTab, setActiveTab] = React.useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'events', label: 'Event Types', badge: EVENT_TYPES_DOC.length },
    { id: 'api', label: 'API Reference', badge: API_ENDPOINTS.length },
    { id: 'architecture', label: 'Architecture' },
  ];

  return (
    <div className="help-page animate-fade-in">
      <header className="help-header">
        <h1 className="page-title">Documentation</h1>
        <p className="page-subtitle">System architecture, event types, and API reference</p>
      </header>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <TabPanel id="overview" activeTab={activeTab}>
        <div className="help-section">
          <h2 className="help-section-title">What is Audit Trail?</h2>
          <p className="help-text">
            Audit Trail is an enterprise-grade shipment tracking system built on <strong>Event Sourcing</strong> and <strong>CQRS</strong> (Command Query Responsibility Segregation). 
            Every state change is recorded as an immutable event in the event store, creating a complete audit log of all shipment activity.
          </p>
          <div className="help-feature-grid">
            <div className="help-feature-card">
              <div className="help-feature-icon help-feature-icon--blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
              </div>
              <h3>Event Sourcing</h3>
              <p>Every state change stored as an immutable event</p>
            </div>
            <div className="help-feature-card">
              <div className="help-feature-icon help-feature-icon--green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>
              </div>
              <h3>Real-time Tracking</h3>
              <p>Live updates from the event stream</p>
            </div>
            <div className="help-feature-card">
              <div className="help-feature-icon help-feature-icon--purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3>Immutable Ledger</h3>
              <p>Tamper-proof audit trail for compliance</p>
            </div>
            <div className="help-feature-card">
              <div className="help-feature-icon help-feature-icon--orange">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              </div>
              <h3>Analytics</h3>
              <p>Projected read models for fast queries</p>
            </div>
          </div>
        </div>
      </TabPanel>

      <TabPanel id="events" activeTab={activeTab}>
        <div className="help-section">
          <h2 className="help-section-title">Event Types</h2>
          <p className="help-text">These are the domain events recorded in the event store:</p>
          <div className="help-event-list">
            {EVENT_TYPES_DOC.map((evt) => (
              <div key={evt.type} className="help-event-card">
                <code className="help-event-type">{evt.type}</code>
                <p className="help-event-desc">{evt.description}</p>
                <div className="help-event-fields">
                  <span className="help-event-fields-label">Fields:</span>
                  <code className="help-event-fields-value">{evt.fields}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabPanel>

      <TabPanel id="api" activeTab={activeTab}>
        <div className="help-section">
          <h2 className="help-section-title">API Endpoints</h2>
          <p className="help-text">RESTful API following CQRS — queries read from projections, commands write to the event store:</p>
          <div className="help-api-list">
            {API_ENDPOINTS.map((ep, i) => (
              <div key={i} className="help-api-item">
                <span className={`help-api-method help-api-method--${ep.method.toLowerCase()}`}>{ep.method}</span>
                <code className="help-api-path">{ep.path}</code>
                <span className="help-api-desc">{ep.description}</span>
              </div>
            ))}
          </div>
        </div>
      </TabPanel>

      <TabPanel id="architecture" activeTab={activeTab}>
        <div className="help-section">
          <h2 className="help-section-title">System Architecture</h2>
          <div className="help-arch-diagram">
            <div className="help-arch-layer help-arch-layer--client">
              <span className="help-arch-label">Frontend (React)</span>
              <div className="help-arch-items">
                <span className="help-arch-item">Dashboard</span>
                <span className="help-arch-item">Shipments</span>
                <span className="help-arch-item">Timeline</span>
                <span className="help-arch-item">Analytics</span>
              </div>
            </div>
            <div className="help-arch-arrow">↕</div>
            <div className="help-arch-layer help-arch-layer--api">
              <span className="help-arch-label">API Layer (Express)</span>
              <div className="help-arch-items">
                <span className="help-arch-item">Commands</span>
                <span className="help-arch-item">Queries</span>
                <span className="help-arch-item">Projections</span>
              </div>
            </div>
            <div className="help-arch-arrow">↕</div>
            <div className="help-arch-layer help-arch-layer--data">
              <span className="help-arch-label">Data Layer</span>
              <div className="help-arch-items">
                <span className="help-arch-item">Event Store</span>
                <span className="help-arch-item">Read Models</span>
                <span className="help-arch-item">Prisma ORM</span>
              </div>
            </div>
          </div>
        </div>
      </TabPanel>
    </div>
  );
}

export default HelpPage;
