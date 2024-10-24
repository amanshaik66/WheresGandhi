// /frontend/src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // Ensure the correct relative path to App.tsx
import { BrowserRouter } from 'react-router-dom';
import './assets/styles.css'; // Global styles

// Error Boundary to handle rendering errors gracefully
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }; // Show fallback UI if an error occurs
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }
    return this.props.children;
  }
}

// Safely get the root element from the DOM
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Root element not found. Ensure 'index.html' contains a div with id='root'.");
} else {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
