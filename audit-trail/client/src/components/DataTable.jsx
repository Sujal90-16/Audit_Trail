import React, { useState, useMemo } from 'react';
import './DataTable.css';

/**
 * DataTable — Sortable data table with hover highlights and responsive design.
 *
 * Features:
 * - Column-based sorting (asc/desc toggle)
 * - Row hover highlighting with accent border
 * - Optional onRowClick handler
 * - Custom cell renderers via column config
 * - Empty state message
 *
 * @param {Array} columns - [{key, label, sortable?, render?, width?}]
 * @param {Array} data - Array of row objects
 * @param {Function} onRowClick - Optional row click handler (receives row)
 * @param {string} emptyMessage - Message when no data (default: 'No data available')
 */
function DataTable({ columns = [], data = [], onRowClick, emptyMessage = 'No data available' }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = typeof aVal === 'string'
        ? aVal.localeCompare(bVal)
        : aVal - bVal;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`data-table-th ${col.sortable ? 'data-table-th--sortable' : ''}`}
                style={col.width ? { width: col.width } : undefined}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <span className="th-content">
                  {col.label}
                  {col.sortable && (
                    <span className={`sort-icon ${sortKey === col.key ? 'sort-icon--active' : ''}`}>
                      {sortKey === col.key && sortDir === 'desc' ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6,9 12,15 18,9"/>
                        </svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6,15 12,9 18,15"/>
                        </svg>
                      )}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="data-table-empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`data-table-row ${onRowClick ? 'data-table-row--clickable' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="data-table-td">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
