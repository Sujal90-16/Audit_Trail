import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './KeyboardShortcuts.css';

/**
 * Keyboard shortcuts definitions for the application.
 */
const SHORTCUTS = [
  { category: 'Navigation', items: [
    { keys: ['Ctrl', 'K'], description: 'Open search' },
    { keys: ['G', 'D'], description: 'Go to Dashboard' },
    { keys: ['G', 'S'], description: 'Go to Shipments' },
    { keys: ['G', 'T'], description: 'Go to Timeline' },
    { keys: ['G', 'A'], description: 'Go to Analytics' },
  ]},
  { category: 'Actions', items: [
    { keys: ['N'], description: 'New command' },
    { keys: ['F'], description: 'Toggle filter panel' },
    { keys: ['R'], description: 'Refresh data' },
    { keys: ['Esc'], description: 'Close dialog / panel' },
  ]},
  { category: 'General', items: [
    { keys: ['?'], description: 'Show this help' },
    { keys: ['Ctrl', '/'], description: 'Toggle sidebar' },
    { keys: ['Ctrl', '.'], description: 'Toggle notifications' },
  ]},
];

/**
 * KeyboardShortcuts — Modal overlay showing all available keyboard shortcuts.
 * Toggles with '?' key press.
 */
function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Only trigger when not in an input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Keyboard Shortcuts"
      size="md"
    >
      <div className="shortcuts-content">
        {SHORTCUTS.map((group) => (
          <div key={group.category} className="shortcuts-group">
            <h3 className="shortcuts-category">{group.category}</h3>
            <div className="shortcuts-list">
              {group.items.map((item, i) => (
                <div key={i} className="shortcut-item">
                  <span className="shortcut-desc">{item.description}</span>
                  <div className="shortcut-keys">
                    {item.keys.map((key, j) => (
                      <React.Fragment key={j}>
                        {j > 0 && <span className="shortcut-plus">+</span>}
                        <kbd className="shortcut-key">{key}</kbd>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="shortcuts-hint">
          Press <kbd className="shortcut-key shortcut-key--inline">?</kbd> to toggle this dialog
        </p>
      </div>
    </Modal>
  );
}

export default KeyboardShortcuts;
