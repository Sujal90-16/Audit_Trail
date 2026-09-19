import React from 'react';
import './Avatar.css';

/**
 * Color palette for auto-generated avatar backgrounds.
 * Deterministic based on name string — same name always gets same color.
 */
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fda085, #f6d365)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4481eb, #04befe)',
];

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getGradient(name) {
  let hash = 0;
  const str = name || '';
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

/**
 * Avatar — Displays user initials with deterministic gradient background.
 * Supports multiple sizes and optional status indicator.
 *
 * @param {string} name - User name (used for initials and color)
 * @param {string} size - 'xs' | 'sm' | 'md' | 'lg' (default: 'md')
 * @param {string} status - 'online' | 'away' | 'busy' | null (default: null)
 * @param {string} src - Optional image URL (overrides initials)
 */
function Avatar({ name, size = 'md', status, src }) {
  const initials = getInitials(name);
  const gradient = getGradient(name);

  return (
    <div className={`avatar avatar--${size}`}>
      {src ? (
        <img className="avatar-image" src={src} alt={name} />
      ) : (
        <div className="avatar-initials" style={{ background: gradient }}>
          {initials}
        </div>
      )}
      {status && <span className={`avatar-status avatar-status--${status}`} />}
    </div>
  );
}

/**
 * AvatarGroup — Stacked overlapping avatars for showing multiple users.
 *
 * @param {Array} users - Array of {name, status?, src?} objects
 * @param {number} max - Maximum visible avatars (default: 4)
 * @param {string} size - Avatar size (default: 'sm')
 */
function AvatarGroup({ users = [], max = 4, size = 'sm' }) {
  const visible = users.slice(0, max);
  const overflow = users.length - max;

  return (
    <div className="avatar-group">
      {visible.map((user, i) => (
        <Avatar key={i} name={user.name} size={size} status={user.status} src={user.src} />
      ))}
      {overflow > 0 && (
        <div className={`avatar avatar--${size} avatar-overflow`}>
          <div className="avatar-initials avatar-overflow-text">+{overflow}</div>
        </div>
      )}
    </div>
  );
}

export { AvatarGroup };
export default Avatar;
