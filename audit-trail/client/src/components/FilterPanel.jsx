import React, { useState } from 'react';
import './FilterPanel.css';

/**
 * FilterPanel — Collapsible filter sidebar for shipment list views.
 *
 * Features:
 * - Expandable filter sections with chevron toggle
 * - Checkbox group filters (event type, status, port)
 * - Date range picker inputs
 * - Active filter count badge
 * - Clear all / Apply actions
 *
 * @param {Function} onApply - Callback with filter state object
 * @param {Function} onClear - Callback to reset all filters
 */

const FILTER_SECTIONS = [
  {
    id: 'status',
    label: 'Status',
    options: [
      { value: 'in_transit', label: 'In Transit' },
      { value: 'delivered', label: 'Delivered' },
      { value: 'delayed', label: 'Delayed' },
      { value: 'pending', label: 'Pending' },
    ],
  },
  {
    id: 'eventType',
    label: 'Event Type',
    options: [
      { value: 'CONTAINER_CREATED', label: 'Container Created' },
      { value: 'LOADED_ON_SHIP', label: 'Loaded on Ship' },
      { value: 'ARRIVED_AT_PORT', label: 'Arrived at Port' },
      { value: 'TEMPERATURE_SPIKE', label: 'Temperature Spike' },
      { value: 'DELIVERED', label: 'Delivered' },
    ],
  },
  {
    id: 'port',
    label: 'Port',
    options: [
      { value: 'shanghai', label: 'Shanghai' },
      { value: 'los_angeles', label: 'Los Angeles' },
      { value: 'rotterdam', label: 'Rotterdam' },
      { value: 'mumbai', label: 'Mumbai' },
      { value: 'singapore', label: 'Singapore' },
    ],
  },
];

function FilterPanel({ onApply, onClear }) {
  const [expanded, setExpanded] = useState({ status: true, eventType: true, port: false });
  const [selected, setSelected] = useState({});
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const toggleSection = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleOption = (sectionId, value) => {
    setSelected((prev) => {
      const current = prev[sectionId] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [sectionId]: next };
    });
  };

  const activeCount = Object.values(selected).reduce((sum, arr) => sum + arr.length, 0)
    + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0);

  const handleClear = () => {
    setSelected({});
    setDateFrom('');
    setDateTo('');
    onClear && onClear();
  };

  const handleApply = () => {
    onApply && onApply({ ...selected, dateFrom, dateTo });
  };

  return (
    <div className="filter-panel card">
      <div className="filter-panel-header">
        <div className="filter-panel-title-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
          </svg>
          <h3 className="filter-panel-title">Filters</h3>
          {activeCount > 0 && (
            <span className="filter-active-badge">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button className="filter-clear-btn" onClick={handleClear}>Clear all</button>
        )}
      </div>

      {/* Date Range */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection('date')}>
          <span className="filter-section-label">Date Range</span>
          <svg className={`filter-chevron ${expanded.date ? 'filter-chevron--open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </div>
        {expanded.date !== false && (
          <div className="filter-date-range">
            <div className="filter-date-field">
              <label className="filter-date-label">From</label>
              <input
                type="date"
                className="filter-date-input"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="filter-date-field">
              <label className="filter-date-label">To</label>
              <input
                type="date"
                className="filter-date-input"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Checkbox Sections */}
      {FILTER_SECTIONS.map((section) => (
        <div key={section.id} className="filter-section">
          <div className="filter-section-header" onClick={() => toggleSection(section.id)}>
            <span className="filter-section-label">
              {section.label}
              {(selected[section.id] || []).length > 0 && (
                <span className="filter-section-count">{(selected[section.id] || []).length}</span>
              )}
            </span>
            <svg className={`filter-chevron ${expanded[section.id] ? 'filter-chevron--open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 12,15 18,9"/>
            </svg>
          </div>
          {expanded[section.id] && (
            <div className="filter-options">
              {section.options.map((opt) => {
                const isChecked = (selected[section.id] || []).includes(opt.value);
                return (
                  <label key={opt.value} className={`filter-checkbox ${isChecked ? 'filter-checkbox--checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOption(section.id, opt.value)}
                      className="filter-checkbox-input"
                    />
                    <span className="filter-checkbox-mark">
                      {isChecked && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20,6 9,17 4,12"/>
                        </svg>
                      )}
                    </span>
                    <span className="filter-checkbox-label">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <button className="filter-apply-btn" onClick={handleApply}>
        Apply Filters
        {activeCount > 0 && <span className="filter-apply-count">({activeCount})</span>}
      </button>
    </div>
  );
}

export default FilterPanel;
