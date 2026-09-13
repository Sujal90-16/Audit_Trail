import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

/**
 * Route label map — converts URL segments to human-readable names.
 */
const ROUTE_LABELS = {
  '': 'Dashboard',
  'shipments': 'Shipments',
  'shipment': 'Shipment Detail',
  'timeline': 'Timeline',
  'analytics': 'Analytics',
  'settings': 'Settings',
};

/**
 * Breadcrumbs — Displays the current navigation path.
 * Auto-generates breadcrumb trail from the URL.
 *
 * @param {Array} items - Optional manual breadcrumb items [{label, to}]
 */
function Breadcrumbs({ items }) {
  const location = useLocation();

  // Auto-generate breadcrumbs from URL if not provided manually
  const crumbs = items || (() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const trail = [{ label: 'Dashboard', to: '/' }];

    let path = '';
    segments.forEach((seg, i) => {
      path += `/${seg}`;
      const label = ROUTE_LABELS[seg] || seg.replace(/-/g, ' ');
      trail.push({
        label: i === segments.length - 1 && !ROUTE_LABELS[seg]
          ? seg.toUpperCase()
          : label,
        to: path,
      });
    });

    return trail;
  })();

  if (crumbs.length <= 1) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.to} className="breadcrumbs-item">
              {index > 0 && (
                <svg className="breadcrumbs-separator" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9,6 15,12 9,18"/>
                </svg>
              )}
              {isLast ? (
                <span className="breadcrumbs-current">{crumb.label}</span>
              ) : (
                <Link to={crumb.to} className="breadcrumbs-link">
                  {index === 0 && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                      <polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                  )}
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
