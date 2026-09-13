import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import './PageHeader.css';

/**
 * PageHeader — Shared page header with breadcrumbs, title,
 * subtitle, and optional right-side actions slot.
 *
 * Provides consistent layout across all pages.
 *
 * @param {string} title - Page title (rendered as gradient h1)
 * @param {string} subtitle - Page description
 * @param {string} gradient - CSS variable name for gradient (default: --gradient-primary)
 * @param {React.ReactNode} actions - Optional right-side content
 * @param {Array} breadcrumbs - Optional manual breadcrumb items
 * @param {React.ReactNode} children - Extra content below the header
 */
function PageHeader({ title, subtitle, gradient = 'primary', actions, breadcrumbs, children }) {
  const gradientMap = {
    primary: 'var(--gradient-primary)',
    cool: 'var(--gradient-cool)',
    warm: 'var(--gradient-warm)',
    accent: 'var(--gradient-accent)',
    mint: 'var(--gradient-mint)',
  };

  return (
    <div className="page-header">
      <Breadcrumbs items={breadcrumbs} />
      <div className="page-header-row">
        <div className="page-header-text">
          <h1
            className="page-header-title"
            style={{ background: gradientMap[gradient] || gradientMap.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >
            {title}
          </h1>
          {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export default PageHeader;
