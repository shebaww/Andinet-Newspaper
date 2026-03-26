// Create new file: src/components/common/ErrorBoundary.jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '70vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          textAlign: 'center',
          padding: '50px 20px'
        }}>
          <h1 style={{ fontFamily: 'var(--font-header)' }}>Something Went Wrong</h1>
          <p style={{ fontFamily: 'var(--font-main)', marginBottom: '30px' }}>
            We apologize for the technical difficulty. Please refresh the page or try again later.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-heritage"
            style={{ cursor: 'pointer' }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
