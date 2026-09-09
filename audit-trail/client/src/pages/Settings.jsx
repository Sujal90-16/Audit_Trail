import React, { useState } from 'react';
import { useToast } from '../components/Toast';
import './Settings.css';

/**
 * Toggle switch component for settings.
 */
function Toggle({ checked, onChange, id }) {
  return (
    <label className="toggle" htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="toggle-input"
      />
      <span className="toggle-slider" />
    </label>
  );
}

/**
 * Settings page — user preferences, notification config,
 * and API connection settings for the audit trail system.
 */
function Settings() {
  const { addToast } = useToast();

  // Notification preferences
  const [notifications, setNotifications] = useState({
    temperatureAlerts: true,
    arrivalNotifs: true,
    systemUpdates: false,
    emailDigest: true,
    pushNotifications: false,
  });

  // API Configuration
  const [apiConfig, setApiConfig] = useState({
    baseUrl: 'http://localhost:3000',
    timeout: '5000',
    retryAttempts: '3',
  });

  // Display preferences
  const [display, setDisplay] = useState({
    compactMode: false,
    animationsEnabled: true,
    showTimestamps: true,
    timezone: 'UTC',
    dateFormat: 'relative',
  });

  const handleNotifToggle = (key, value) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleDisplayToggle = (key, value) => {
    setDisplay((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    addToast({ type: 'success', message: 'Settings saved successfully!' });
  };

  const handleReset = () => {
    setNotifications({
      temperatureAlerts: true,
      arrivalNotifs: true,
      systemUpdates: false,
      emailDigest: true,
      pushNotifications: false,
    });
    setApiConfig({
      baseUrl: 'http://localhost:3000',
      timeout: '5000',
      retryAttempts: '3',
    });
    setDisplay({
      compactMode: false,
      animationsEnabled: true,
      showTimestamps: true,
      timezone: 'UTC',
      dateFormat: 'relative',
    });
    addToast({ type: 'info', message: 'Settings reset to defaults' });
  };

  return (
    <div className="settings-page animate-fade-in">
      <header className="settings-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure notifications, display preferences, and API connections</p>
        </div>
        <div className="settings-actions">
          <button className="settings-btn settings-btn--secondary" onClick={handleReset}>
            Reset Defaults
          </button>
          <button className="settings-btn settings-btn--primary" onClick={handleSave}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
              <polyline points="17,21 17,13 7,13 7,21"/>
              <polyline points="7,3 7,8 15,8"/>
            </svg>
            Save Changes
          </button>
        </div>
      </header>

      <div className="settings-grid">
        {/* Notification Preferences */}
        <div className="settings-section card">
          <div className="settings-section-header">
            <div className="settings-section-icon settings-section-icon--notif">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
            </div>
            <div>
              <h2 className="settings-section-title">Notifications</h2>
              <p className="settings-section-desc">Control which alerts and updates you receive</p>
            </div>
          </div>

          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Temperature Alerts</span>
                <span className="settings-item-desc">Get notified when temperature thresholds are exceeded</span>
              </div>
              <Toggle id="temp-alerts" checked={notifications.temperatureAlerts} onChange={(v) => handleNotifToggle('temperatureAlerts', v)} />
            </div>
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Arrival Notifications</span>
                <span className="settings-item-desc">Notify when shipments arrive at destination ports</span>
              </div>
              <Toggle id="arrival-notifs" checked={notifications.arrivalNotifs} onChange={(v) => handleNotifToggle('arrivalNotifs', v)} />
            </div>
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">System Updates</span>
                <span className="settings-item-desc">Receive event store maintenance and system notifications</span>
              </div>
              <Toggle id="sys-updates" checked={notifications.systemUpdates} onChange={(v) => handleNotifToggle('systemUpdates', v)} />
            </div>
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Daily Email Digest</span>
                <span className="settings-item-desc">Receive a daily summary of all shipment events</span>
              </div>
              <Toggle id="email-digest" checked={notifications.emailDigest} onChange={(v) => handleNotifToggle('emailDigest', v)} />
            </div>
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Push Notifications</span>
                <span className="settings-item-desc">Enable browser push notifications for critical alerts</span>
              </div>
              <Toggle id="push-notifs" checked={notifications.pushNotifications} onChange={(v) => handleNotifToggle('pushNotifications', v)} />
            </div>
          </div>
        </div>

        {/* Display Preferences */}
        <div className="settings-section card">
          <div className="settings-section-header">
            <div className="settings-section-icon settings-section-icon--display">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div>
              <h2 className="settings-section-title">Display</h2>
              <p className="settings-section-desc">Customize the look and feel of your dashboard</p>
            </div>
          </div>

          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Compact Mode</span>
                <span className="settings-item-desc">Reduce spacing for a denser information layout</span>
              </div>
              <Toggle id="compact-mode" checked={display.compactMode} onChange={(v) => handleDisplayToggle('compactMode', v)} />
            </div>
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Animations</span>
                <span className="settings-item-desc">Enable smooth transitions and micro-animations</span>
              </div>
              <Toggle id="animations" checked={display.animationsEnabled} onChange={(v) => handleDisplayToggle('animationsEnabled', v)} />
            </div>
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Show Timestamps</span>
                <span className="settings-item-desc">Display ISO timestamps alongside relative times</span>
              </div>
              <Toggle id="timestamps" checked={display.showTimestamps} onChange={(v) => handleDisplayToggle('showTimestamps', v)} />
            </div>
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Date Format</span>
                <span className="settings-item-desc">Choose between relative and absolute date display</span>
              </div>
              <select
                className="settings-select"
                value={display.dateFormat}
                onChange={(e) => handleDisplayToggle('dateFormat', e.target.value)}
              >
                <option value="relative">Relative (2 hours ago)</option>
                <option value="absolute">Absolute (Sep 9, 2024)</option>
                <option value="iso">ISO 8601</option>
              </select>
            </div>
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Timezone</span>
                <span className="settings-item-desc">Set your preferred timezone for event timestamps</span>
              </div>
              <select
                className="settings-select"
                value={display.timezone}
                onChange={(e) => handleDisplayToggle('timezone', e.target.value)}
              >
                <option value="UTC">UTC</option>
                <option value="IST">IST (UTC+5:30)</option>
                <option value="EST">EST (UTC-5)</option>
                <option value="PST">PST (UTC-8)</option>
                <option value="CET">CET (UTC+1)</option>
              </select>
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="settings-section settings-section--full card">
          <div className="settings-section-header">
            <div className="settings-section-icon settings-section-icon--api">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16,18 22,12 16,6"/>
                <polyline points="8,6 2,12 8,18"/>
              </svg>
            </div>
            <div>
              <h2 className="settings-section-title">API Configuration</h2>
              <p className="settings-section-desc">Configure the connection to the event store backend</p>
            </div>
          </div>

          <div className="api-config-grid">
            <div className="api-field">
              <label className="api-field-label" htmlFor="api-url">Base URL</label>
              <input
                id="api-url"
                type="text"
                className="api-field-input"
                value={apiConfig.baseUrl}
                onChange={(e) => setApiConfig((p) => ({ ...p, baseUrl: e.target.value }))}
              />
              <span className="api-field-hint">The root URL for the CQRS query and command endpoints</span>
            </div>
            <div className="api-field">
              <label className="api-field-label" htmlFor="api-timeout">Timeout (ms)</label>
              <input
                id="api-timeout"
                type="number"
                className="api-field-input"
                value={apiConfig.timeout}
                onChange={(e) => setApiConfig((p) => ({ ...p, timeout: e.target.value }))}
              />
              <span className="api-field-hint">Request timeout in milliseconds</span>
            </div>
            <div className="api-field">
              <label className="api-field-label" htmlFor="api-retries">Retry Attempts</label>
              <input
                id="api-retries"
                type="number"
                className="api-field-input"
                value={apiConfig.retryAttempts}
                onChange={(e) => setApiConfig((p) => ({ ...p, retryAttempts: e.target.value }))}
              />
              <span className="api-field-hint">Number of retries on failed requests</span>
            </div>
          </div>

          <div className="api-status">
            <div className="api-status-dot" />
            <span className="api-status-text">Connected to event store</span>
            <span className="api-status-url">{apiConfig.baseUrl}/api</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
