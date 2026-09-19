import React, { useEffect, useRef } from 'react';
import './Modal.css';

/**
 * Modal — Accessible dialog overlay with backdrop blur.
 *
 * Features:
 * - Escape key to close
 * - Backdrop click to dismiss
 * - Focus trap (auto-focuses close button)
 * - Configurable size (sm/md/lg/full)
 * - Slide-up entry animation
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {Function} onClose - Close callback
 * @param {string} title - Modal header title
 * @param {string} size - 'sm' | 'md' | 'lg' | 'full' (default: 'md')
 * @param {boolean} showCloseButton - Show the X button (default: true)
 * @param {React.ReactNode} footer - Optional footer content (buttons, etc.)
 * @param {React.ReactNode} children - Modal body content
 */
function Modal({ isOpen, onClose, title, size = 'md', showCloseButton = true, footer, children }) {
  const closeRef = useRef(null);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      closeRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div
        className={`modal modal--${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {showCloseButton && (
              <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close modal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="modal-body">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
