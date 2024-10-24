import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Main App component
import { BrowserRouter } from 'react-router-dom';
import './assets/styles.css'; // Global styles

// Custom Error Boundary to handle any rendering errors gracefully
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to the console or an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }
    return this.props.children;
  }
}

// Get the root element from the HTML file
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
