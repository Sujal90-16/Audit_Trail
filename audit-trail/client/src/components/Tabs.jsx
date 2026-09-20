import React, { useState } from 'react';
import './Tabs.css';

/**
 * Tabs — Animated tabbed interface with underline indicator.
 *
 * Supports icons, badges, and disabled states on individual tabs.
 * The active indicator slides smoothly between tabs.
 *
 * @param {Array} tabs - [{id, label, icon?, badge?, disabled?}]
 * @param {string} activeTab - Currently active tab ID
 * @param {Function} onTabChange - Callback with tab ID
 * @param {string} variant - 'underline' | 'pills' (default: 'underline')
 */
function Tabs({ tabs = [], activeTab, onTabChange, variant = 'underline' }) {
  const [hoveredTab, setHoveredTab] = useState(null);

  return (
    <div className={`tabs tabs--${variant}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isDisabled = tab.disabled;

        return (
          <button
            key={tab.id}
            className={`tab-item ${isActive ? 'tab-item--active' : ''} ${isDisabled ? 'tab-item--disabled' : ''}`}
            onClick={() => !isDisabled && onTabChange(tab.id)}
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled}
            tabIndex={isDisabled ? -1 : 0}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`tab-badge ${isActive ? 'tab-badge--active' : ''}`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * TabPanel — Content panel associated with a tab.
 * Only renders when the tab is active (with fade-in animation).
 */
function TabPanel({ id, activeTab, children }) {
  if (id !== activeTab) return null;

  return (
    <div className="tab-panel animate-fade-in" role="tabpanel" aria-labelledby={id}>
      {children}
    </div>
  );
}

export { TabPanel };
export default Tabs;
