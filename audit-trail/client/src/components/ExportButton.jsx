import React, { useState } from 'react';
import './ExportButton.css';

/**
 * ExportButton — Dropdown button for exporting data in various formats.
 *
 * Simulates export to CSV, JSON, and PDF. Shows a dropdown with
 * format options and triggers a simulated download.
 *
 * @param {string} label - Button text (default: 'Export')
 * @param {Function} onExport - Callback with format string
 */

const EXPORT_FORMATS = [
  {
    id: 'csv',
    label: 'CSV',
    description: 'Spreadsheet format',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/>
      </svg>
    ),
  },
  {
    id: 'json',
    label: 'JSON',
    description: 'Structured data',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/>
      </svg>
    ),
  },
  {
    id: 'pdf',
    label: 'PDF Report',
    description: 'Formatted document',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
];

function ExportButton({ label = 'Export', onExport }) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(null);

  const handleExport = async (format) => {
    setExporting(format);
    // Simulate export
    await new Promise((r) => setTimeout(r, 1500));
    onExport && onExport(format);
    setExporting(null);
    setIsOpen(false);
  };

  return (
    <div className="export-wrapper">
      <button className="export-btn" onClick={() => setIsOpen(!isOpen)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        {label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </button>

      {isOpen && (
        <div className="export-dropdown animate-fade-in">
          {EXPORT_FORMATS.map((fmt) => (
            <button
              key={fmt.id}
              className="export-option"
              onClick={() => handleExport(fmt.id)}
              disabled={exporting !== null}
            >
              <span className="export-option-icon">{fmt.icon}</span>
              <div className="export-option-text">
                <span className="export-option-label">{fmt.label}</span>
                <span className="export-option-desc">{fmt.description}</span>
              </div>
              {exporting === fmt.id && <span className="export-spinner" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExportButton;
