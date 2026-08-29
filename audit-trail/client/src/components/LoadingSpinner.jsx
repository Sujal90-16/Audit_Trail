import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner({ size = 'md', message = 'Loading...' }) {
  return (
    <div className={`loading-spinner loading-spinner--${size}`}>
      <div className="spinner-ring">
        <div className="spinner-ring-inner"></div>
      </div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;
