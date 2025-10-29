/**
 * Error Boundary Component
 *
 * Catches React errors and reports them to monitoring services
 */

'use client';

import React, { Component, type ReactNode, type ErrorInfo } from 'react';
import { captureException, setContext } from '../sentry';
import { trackError } from '../analytics';
import { error as logError } from '../logger';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  context?: Record<string, any>;
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { context, onError } = this.props;

    this.setState({ errorInfo });

    // Set error context
    if (context) {
      setContext('errorBoundary', context);
    }

    // Report to Sentry
    captureException(error, {
      ...context,
      componentStack: errorInfo.componentStack,
    });

    // Track in analytics
    trackError(error, {
      ...context,
      componentStack: errorInfo.componentStack,
    });

    // Log error
    logError('React Error Boundary caught error', error, {
      ...context,
      componentStack: errorInfo.componentStack,
    });

    // Call custom error handler
    onError?.(error, errorInfo);
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { children, fallback, showDetails = false } = this.props;
    const { hasError, error, errorInfo } = this.state;

    if (hasError && error) {
      // Custom fallback
      if (typeof fallback === 'function') {
        return fallback(error, errorInfo!);
      }

      if (fallback) {
        return fallback;
      }

      // Default fallback
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Something went wrong
                </h2>
              </div>

              <p className="text-gray-600 mb-4">
                We're sorry, but something unexpected happened. The error has been
                logged and we'll look into it.
              </p>

              {showDetails && process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm font-mono text-red-800 mb-2">
                    {error.toString()}
                  </p>
                  {errorInfo?.componentStack && (
                    <details className="text-xs text-red-700">
                      <summary className="cursor-pointer font-semibold">
                        Component Stack
                      </summary>
                      <pre className="mt-2 overflow-auto whitespace-pre-wrap">
                        {errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={this.reset}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

/**
 * Functional wrapper for Error Boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
