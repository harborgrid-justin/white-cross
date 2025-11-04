'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Props for the ErrorBoundary component
 */
interface ErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode;
  /** Optional custom fallback UI */
  fallback?: ReactNode;
  /** Optional callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Optional context name for error logging */
  context?: string;
}

/**
 * State for the ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 *
 * A reusable error boundary component that catches JavaScript errors anywhere in the
 * child component tree, logs those errors, and displays a fallback UI instead of the
 * component tree that crashed.
 *
 * Features:
 * - Catches rendering errors in child components
 * - Displays user-friendly error message
 * - Provides retry functionality
 * - Integrates with error logging services
 * - Prevents entire app crash from component errors
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary context="AppointmentsPage" onError={(error) => logToService(error)}>
 *   <AppointmentsContent />
 * </ErrorBoundary>
 * ```
 *
 * @example
 * // Basic usage
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * @example
 * // With custom fallback and error logging
 * <ErrorBoundary
 *   fallback={<CustomErrorUI />}
 *   onError={(error) => sendToSentry(error)}
 *   context="CriticalFeature"
 * >
 *   <CriticalComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Static method called when an error is thrown in a descendant component.
   * Updates state to trigger fallback UI rendering.
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Lifecycle method called after an error has been thrown.
   * Logs error details and calls optional error callback.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, context } = this.props;

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }

    // Store error info in state
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (onError) {
      try {
        onError(error, errorInfo);
      } catch (callbackError) {
        console.error('Error in ErrorBoundary onError callback:', callbackError);
      }
    }

    // Log to external service (Sentry, DataDog, etc.) in production
    if (process.env.NODE_ENV === 'production') {
      try {
        // Integration point for error monitoring services
        // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
        console.error(`[ErrorBoundary${context ? ` - ${context}` : ''}]:`, {
          error: error.toString(),
          errorInfo: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
        });
      } catch (loggingError) {
        console.error('Failed to log error to monitoring service:', loggingError);
      }
    }
  }

  /**
   * Reset error boundary state to retry rendering
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, context } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <div
          className="flex items-center justify-center min-h-[400px] p-6"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full bg-white border border-red-200 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Something went wrong
            </h2>

            <p className="text-gray-600 text-center mb-4">
              {context
                ? `An error occurred in ${context}. We are sorry for the inconvenience.`
                : 'An unexpected error occurred. We are sorry for the inconvenience.'
              }
            </p>

            {/* Show error message in development */}
            {process.env.NODE_ENV === 'development' && error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm">
                <p className="font-semibold text-red-800 mb-1">Error Details:</p>
                <p className="text-red-700 font-mono text-xs break-all">
                  {error.message}
                </p>
                {errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-red-700 font-semibold">
                      Component Stack
                    </summary>
                    <pre className="mt-2 text-xs overflow-auto max-h-40 text-red-600">
                      {errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                aria-label="Try to recover from error"
              >
                <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                Try Again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                aria-label="Return to home page"
              >
                Go to Home
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return children;
  }
}

/**
 * Hook-friendly wrapper for ErrorBoundary with default error logging
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
};

export default ErrorBoundary;
