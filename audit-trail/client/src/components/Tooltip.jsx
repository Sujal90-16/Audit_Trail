import React, { useState, useRef, useEffect } from 'react';
import './Tooltip.css';

/**
 * Tooltip — Accessible hover/focus tooltip with configurable placement.
 *
 * Supports four placements (top, bottom, left, right) and auto-hides
 * after the cursor leaves. Uses CSS transforms for positioning.
 *
 * @param {string} content - Tooltip text
 * @param {string} placement - 'top' | 'bottom' | 'left' | 'right' (default: 'top')
 * @param {number} delay - Show delay in ms (default: 200)
 * @param {React.ReactNode} children - Trigger element
 */
function Tooltip({ content, placement = 'top', delay = 200, children }) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && content && (
        <div className={`tooltip tooltip--${placement}`} role="tooltip">
          <span className="tooltip-text">{content}</span>
          <span className={`tooltip-arrow tooltip-arrow--${placement}`} />
        </div>
      )}
    </div>
  );
}

export default Tooltip;
