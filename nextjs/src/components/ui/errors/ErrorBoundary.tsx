/**
 * Error Boundary Component
 *
 * Provides error handling for React components
 *
 * @module components/ui/errors/ErrorBoundary
 * @version 1.0.0
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../buttons/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <div className="text-center max-w-md">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button
              onClick={this.handleReset}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorDisplay({
  error,
  onRetry,
  title = 'Error',
  description,
}: {
  error?: Error | string;
  onRetry?: () => void;
  title?: string;
  description?: string;
}) {
  const errorMessage =
    typeof error === 'string' ? error : error?.message || 'An unexpected error occurred';

  return (
    <div className="flex items-center justify-center min-h-[300px] p-6">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description || errorMessage}</p>
        {onRetry && (
          <Button onClick={onRetry} leftIcon={<RefreshCw className="h-4 w-4" />}>
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}

export function ErrorCard({
  error,
  onRetry,
}: {
  error?: Error | string;
  onRetry?: () => void;
}) {
  const errorMessage =
    typeof error === 'string' ? error : error?.message || 'Failed to load data';

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-red-800">{errorMessage}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-3 text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
