import React, { useState, useRef, useEffect } from 'react';
import Avatar from './Avatar';
import EventBadge from './EventBadge';
import './NotificationCenter.css';

/**
 * Mock notifications — simulates real-time alerts from the event store.
 */
const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'TEMPERATURE_SPIKE', title: 'Temperature Alert', message: 'SHIP-2024-0103: 29.8°C exceeds threshold', time: '2 min ago', read: false },
  { id: 2, type: 'ARRIVED_AT_PORT', title: 'Arrival Confirmed', message: 'SHIP-2024-0847 arrived at Port of Long Beach', time: '15 min ago', read: false },
  { id: 3, type: 'DELIVERED', title: 'Delivery Complete', message: 'SHIP-2024-0621 delivered to Mumbai terminal', time: '1 hr ago', read: true },
  { id: 4, type: 'CONTAINER_CREATED', title: 'New Container', message: 'SHIP-2024-1203 registered: Singapore → Sydney', time: '3 hrs ago', read: true },
  { id: 5, type: 'LOADED_ON_SHIP', title: 'Container Loaded', message: 'SHIP-2024-1100 loaded onto MV Ocean Runner', time: '5 hrs ago', read: true },
];

/**
 * NotificationCenter — Bell icon dropdown showing recent alerts/events.
 * Shows unread count badge, mark-all-as-read, and links to related shipments.
 */
function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const ref = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="notification-center" ref={ref}>
      <button
        className={`notification-bell ${unreadCount > 0 ? 'notification-bell--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown animate-fade-in">
          <div className="notification-header">
            <h3 className="notification-title">Notifications</h3>
            {unreadCount > 0 && (
              <button className="notification-mark-all" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notification-item ${!notif.read ? 'notification-item--unread' : ''}`}
                onClick={() => markRead(notif.id)}
              >
                <div className="notification-item-dot-col">
                  {!notif.read && <span className="notification-unread-dot" />}
                </div>
                <div className="notification-item-body">
                  <div className="notification-item-top">
                    <EventBadge type={notif.type} size="sm" />
                    <span className="notification-item-time">{notif.time}</span>
                  </div>
                  <p className="notification-item-title">{notif.title}</p>
                  <p className="notification-item-message">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="notification-footer">
            <button className="notification-view-all">View all notifications</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
