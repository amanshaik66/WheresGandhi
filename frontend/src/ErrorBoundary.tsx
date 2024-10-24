// /frontend/src/ErrorBoundary.tsx

import React, { Component, ReactNode } from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo?: string;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorInfo: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorInfo: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, errorInfo: '' });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error" action={<button onClick={this.handleReload}>Reload</button>}>
          <AlertTitle>Something went wrong</AlertTitle>
          {this.state.errorInfo || 'An unexpected error occurred.'}
        </Alert>
      );
    }
    return this.props.children;
  }
}
