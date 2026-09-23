import React from 'react';
import './ErrorBoundary.css';

/**
 * ErrorBoundary — React error boundary with gradient fallback UI.
 * Catches render errors and shows a styled error screen with
 * stack trace (dev only), retry button, and home navigation.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h1 className="error-boundary-title">Something went wrong</h1>
            <p className="error-boundary-desc">
              An unexpected error occurred in the application. This has been logged for investigation.
            </p>
            {this.state.error && (
              <div className="error-boundary-details">
                <code className="error-boundary-message">{this.state.error.toString()}</code>
              </div>
            )}
            <div className="error-boundary-actions">
              <button className="error-boundary-btn error-boundary-btn--primary" onClick={this.handleRetry}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
                </svg>
                Try Again
              </button>
              <button className="error-boundary-btn error-boundary-btn--secondary" onClick={() => window.location.href = '/'}>
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
