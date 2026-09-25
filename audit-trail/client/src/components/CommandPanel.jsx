import React, { useState, useEffect, useRef } from 'react';
import { useToast } from './Toast';
import './CommandPanel.css';

/**
 * CQRS Command definitions — maps to the write-side command handlers.
 * Each command has a name, description, and required fields.
 */
const COMMANDS = [
  {
    id: 'CREATE_SHIPMENT',
    label: 'Create Shipment',
    description: 'Register a new container in the event store',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
    colorClass: 'create',
    fields: [
      { key: 'origin', label: 'Origin Port', type: 'text', placeholder: 'e.g., Shanghai, CN' },
      { key: 'destination', label: 'Destination Port', type: 'text', placeholder: 'e.g., Los Angeles, US' },
      { key: 'containerType', label: 'Container Type', type: 'select', options: ['20ft Standard', '40ft Standard', '40ft High Cube', '40ft Refrigerated'] },
      { key: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '0' },
    ],
  },
  {
    id: 'LOAD_SHIPMENT',
    label: 'Load on Vessel',
    description: 'Record container loading onto a vessel',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20M5 20V10l7-5 7 5v10"/><path d="M9 20v-4h6v4"/>
      </svg>
    ),
    colorClass: 'load',
    fields: [
      { key: 'shipmentId', label: 'Shipment ID', type: 'text', placeholder: 'SHIP-2024-XXXX' },
      { key: 'vesselName', label: 'Vessel Name', type: 'text', placeholder: 'e.g., MV Pacific Star' },
      { key: 'terminal', label: 'Terminal', type: 'text', placeholder: 'e.g., Terminal A' },
    ],
  },
  {
    id: 'RECORD_ARRIVAL',
    label: 'Record Arrival',
    description: 'Log container arrival at a destination port',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    colorClass: 'arrive',
    fields: [
      { key: 'shipmentId', label: 'Shipment ID', type: 'text', placeholder: 'SHIP-2024-XXXX' },
      { key: 'port', label: 'Port Name', type: 'text', placeholder: 'e.g., Port of Long Beach' },
      { key: 'terminal', label: 'Terminal', type: 'text', placeholder: 'e.g., Terminal J' },
    ],
  },
  {
    id: 'DELIVER_SHIPMENT',
    label: 'Mark Delivered',
    description: 'Mark a shipment as successfully delivered',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
      </svg>
    ),
    colorClass: 'deliver',
    fields: [
      { key: 'shipmentId', label: 'Shipment ID', type: 'text', placeholder: 'SHIP-2024-XXXX' },
      { key: 'receivedBy', label: 'Received By', type: 'text', placeholder: 'Name or company' },
    ],
  },
];

/**
 * CommandPanel — Slide-in drawer for issuing CQRS write-side commands.
 * Renders a command selector and dynamic form based on the selected command.
 *
 * @param {boolean} isOpen - Whether the panel is open
 * @param {Function} onClose - Callback to close the panel
 */
function CommandPanel({ isOpen, onClose }) {
  const { addToast } = useToast();
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const panelRef = useRef(null);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSelectedCommand(null);
        setFormData({});
      }, 300);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleFieldChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCommand) return;

    // Validate required fields
    const emptyFields = selectedCommand.fields.filter(
      (f) => !formData[f.key] || formData[f.key].toString().trim() === ''
    );
    if (emptyFields.length > 0) {
      addToast({ type: 'warning', message: `Please fill in: ${emptyFields.map((f) => f.label).join(', ')}` });
      return;
    }

    setIsSubmitting(true);

    // Simulate command dispatch (will connect to real API later)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    addToast({
      type: 'success',
      message: `Command "${selectedCommand.label}" dispatched successfully!`,
      duration: 5000,
    });

    setIsSubmitting(false);
    setFormData({});
    setSelectedCommand(null);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="command-backdrop command-backdrop--visible"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className={`command-panel ${isOpen ? 'command-panel--open' : ''}`}
        role="dialog"
        aria-label="Command Panel"
      >
        <div className="command-panel-header">
          <div>
            <h2 className="command-panel-title">Dispatch Command</h2>
            <p className="command-panel-subtitle">Issue a write-side CQRS command to the event store</p>
          </div>
          <button className="command-panel-close" onClick={onClose} aria-label="Close panel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Command Selector */}
        {!selectedCommand && (
          <div className="command-list">
            <p className="command-list-label">Select a command</p>
            {COMMANDS.map((cmd) => (
              <button
                key={cmd.id}
                className={`command-option command-option--${cmd.colorClass}`}
                onClick={() => setSelectedCommand(cmd)}
              >
                <div className={`command-option-icon command-option-icon--${cmd.colorClass}`}>
                  {cmd.icon}
                </div>
                <div className="command-option-text">
                  <span className="command-option-label">{cmd.label}</span>
                  <span className="command-option-desc">{cmd.description}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="command-option-arrow">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </button>
            ))}
          </div>
        )}

        {/* Command Form */}
        {selectedCommand && (
          <form className="command-form animate-fade-in" onSubmit={handleSubmit}>
            <button
              type="button"
              className="command-back"
              onClick={() => { setSelectedCommand(null); setFormData({}); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to commands
            </button>

            <div className="command-form-header">
              <div className={`command-option-icon command-option-icon--${selectedCommand.colorClass}`}>
                {selectedCommand.icon}
              </div>
              <div>
                <h3 className="command-form-title">{selectedCommand.label}</h3>
                <p className="command-form-desc">{selectedCommand.description}</p>
              </div>
            </div>

            <div className="command-fields">
              {selectedCommand.fields.map((field) => (
                <div key={field.key} className="command-field">
                  <label className="command-field-label" htmlFor={`cmd-${field.key}`}>
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      id={`cmd-${field.key}`}
                      className="command-field-select"
                      value={formData[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    >
                      <option value="">Select...</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`cmd-${field.key}`}
                      type={field.type}
                      className="command-field-input"
                      placeholder={field.placeholder}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              className={`command-submit ${isSubmitting ? 'command-submit--loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="command-submit-spinner" />
                  Dispatching...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/>
                  </svg>
                  Dispatch Command
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export default CommandPanel;
