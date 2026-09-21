import React from 'react';
import NotificationCenter from './NotificationCenter';
import Avatar from './Avatar';
import './TopBar.css';

/**
 * TopBar — Application header bar shown above page content.
 * Contains greeting, notification bell, and user avatar.
 *
 * Sits at the top of the main-content area and provides
 * consistent navigation context across all pages.
 */
function TopBar() {
  const now = new Date();
  const hour = now.getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <span className="top-bar-greeting">{greeting},</span>
        <span className="top-bar-user">Operator</span>
      </div>

      <div className="top-bar-right">
        <NotificationCenter />
        <div className="top-bar-divider" />
        <div className="top-bar-profile">
          <Avatar name="Akhil Alex" size="sm" status="online" />
          <div className="top-bar-profile-info">
            <span className="top-bar-profile-name">Akhil Alex</span>
            <span className="top-bar-profile-role">Frontend Dev</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
