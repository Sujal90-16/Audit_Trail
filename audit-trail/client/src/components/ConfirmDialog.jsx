import React from 'react';
import Modal from './Modal';
import './ConfirmDialog.css';

/**
 * ConfirmDialog — Modal confirmation prompt with destructive/safe variants.
 *
 * Use for irreversible actions like deleting shipments or clearing data.
 *
 * @param {boolean} isOpen - Whether the dialog is visible
 * @param {Function} onClose - Close callback (cancel action)
 * @param {Function} onConfirm - Confirm callback (proceed with action)
 * @param {string} title - Dialog title (default: 'Are you sure?')
 * @param {string} message - Description of the action
 * @param {string} confirmLabel - Confirm button text (default: 'Confirm')
 * @param {string} cancelLabel - Cancel button text (default: 'Cancel')
 * @param {string} variant - 'danger' | 'warning' | 'info' (default: 'danger')
 * @param {boolean} loading - Show loading state on confirm button
 */
function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  const iconMap = {
    danger: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    warning: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    info: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
      </svg>
    ),
  };

  const footer = (
    <>
      <button className="confirm-dialog-btn confirm-dialog-btn--cancel" onClick={onClose} disabled={loading}>
        {cancelLabel}
      </button>
      <button
        className={`confirm-dialog-btn confirm-dialog-btn--confirm confirm-dialog-btn--${variant}`}
        onClick={onConfirm}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="confirm-spinner" />
            Processing...
          </>
        ) : (
          confirmLabel
        )}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" footer={footer}>
      <div className="confirm-dialog-content">
        <div className={`confirm-dialog-icon confirm-dialog-icon--${variant}`}>
          {iconMap[variant]}
        </div>
        {message && <p className="confirm-dialog-message">{message}</p>}
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
