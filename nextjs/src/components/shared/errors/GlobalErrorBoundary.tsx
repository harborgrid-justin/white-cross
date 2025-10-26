'use client';

/**
 * WF-COMP-ERROR-001 | GlobalErrorBoundary.tsx - Application-wide Error Boundary
 * Purpose: Catch and handle React errors gracefully with audit logging
 *
 * Features:
 * - Catches all React component errors
 * - Integrates with audit logging
 * - User-friendly error messages
 * - Automatic error reporting
 * - Recovery options
 * - HIPAA-compliant error handling (no PHI in error messages)
 *
 * Last Updated: 2025-10-21 | File Type: .tsx
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { auditService } from '../../services/audit/AuditService';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface Props {
  children: ReactNode;
  /**
   * Fallback UI to show on error
   */
  fallback?: (error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode;
  /**
   * Callback when error is caught
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /**
   * Whether to log errors to audit service
   */
  enableAuditLogging?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

// ==========================================
// DEFAULT ERROR UI
// ==========================================

// Memoized error fallback component to prevent unnecessary re-renders
const DefaultErrorFallback = React.memo<{
  error: Error;
  errorInfo: ErrorInfo;
  onReset: () => void;
}>(({ error, errorInfo, onReset }) => {
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0">
            <svg
              className="h-12 w-12 text-red-500"
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
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Something went wrong
            </h1>
            <p className="mt-1 text-gray-600">
              We apologize for the inconvenience. The error has been logged and our team will investigate.
            </p>
          </div>
        </div>

        {/* Error Details (Dev Only) */}
        {isDev && (
          <div className="mb-6">
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
                Error Details (Development Only)
              </summary>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Error Message:</h3>
                  <pre className="bg-red-50 text-red-800 p-3 rounded text-xs overflow-auto">
                    {error.message}
                  </pre>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Stack Trace:</h3>
                  <pre className="bg-gray-100 text-gray-800 p-3 rounded text-xs overflow-auto max-h-64">
                    {error.stack}
                  </pre>
                </div>
                {errorInfo.componentStack && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Component Stack:</h3>
                    <pre className="bg-gray-100 text-gray-800 p-3 rounded text-xs overflow-auto max-h-64">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onReset}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Support Information */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Need help?</strong> Contact support at{' '}
            <a
              href="mailto:support@whitecross.com"
              className="underline hover:text-blue-900"
            >
              support@whitecross.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
});

DefaultErrorFallback.displayName = 'DefaultErrorFallback';

// ==========================================
// ERROR BOUNDARY COMPONENT
// ==========================================

/**
 * Global Error Boundary
 *
 * Catches all React component errors and provides graceful recovery.
 * Integrates with audit logging for error tracking.
 *
 * @example
 * ```tsx
 * <GlobalErrorBoundary enableAuditLogging>
 *   <App />
 * </GlobalErrorBoundary>
 * ```
 */
export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  /**
   * Update state when error is caught
   */
  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Handle error after catch
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error info
    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log to console
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);

    // Call custom error handler if provided
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (handlerError) {
        console.error('[ErrorBoundary] Error in custom error handler:', handlerError);
      }
    }

    // Log to audit service (HIPAA-compliant, no PHI in error messages)
    if (this.props.enableAuditLogging !== false) {
      this.logErrorToAudit(error, errorInfo);
    }

    // Send to error tracking service (future enhancement)
    // this.sendToErrorTracking(error, errorInfo);
  }

  /**
   * Log error to audit service
   * Sanitizes error messages to prevent PHI leakage
   */
  private logErrorToAudit(error: Error, errorInfo: ErrorInfo): void {
    try {
      // Sanitize error message (remove any potential PHI)
      const sanitizedMessage = this.sanitizeErrorMessage(error.message);

      auditService.logFailure(
        {
          action: 'UI_ERROR',
          resourceType: 'APPLICATION',
          status: 'FAILURE',
          context: {
            errorType: error.name,
            errorMessage: sanitizedMessage,
            componentStack: errorInfo.componentStack?.split('\n').slice(0, 5).join('\n'), // First 5 lines only
            errorCount: this.state.errorCount + 1,
            userAgent: navigator.userAgent,
            url: window.location.href,
          },
        },
        error
      );
    } catch (auditError) {
      // Don't let audit logging failure break error handling
      console.error('[ErrorBoundary] Failed to log error to audit service:', auditError);
    }
  }

  /**
   * Sanitize error message to prevent PHI leakage
   * Removes any text that might contain patient names, IDs, or health data
   */
  private sanitizeErrorMessage(message: string): string {
    // Remove any text that looks like IDs (numbers, UUIDs)
    let sanitized = message.replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[ID]');
    sanitized = sanitized.replace(/\b\d{3,}\b/g, '[NUMBER]');

    // Remove any potential names (capitalized words)
    sanitized = sanitized.replace(/\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, '[NAME]');

    // Keep only the first 200 characters to limit data exposure
    if (sanitized.length > 200) {
      sanitized = sanitized.substring(0, 200) + '...';
    }

    return sanitized;
  }

  /**
   * Reset error boundary state
   */
  private resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * Render error UI or children
   */
  render(): ReactNode {
    if (this.state.hasError && this.state.error && this.state.errorInfo) {
      // Too many errors in quick succession - show critical error
      if (this.state.errorCount > 5) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
              <div className="text-red-500 mb-4">
                <svg
                  className="h-16 w-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Critical Error
              </h1>
              <p className="text-gray-600 mb-6">
                Multiple errors have occurred. Please refresh the page or contact support.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        );
      }

      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error,
          this.state.errorInfo,
          this.resetErrorBoundary
        );
      }

      // Use default error UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.resetErrorBoundary}
        />
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

// ==========================================
// HOOK FOR THROWING ERRORS
// ==========================================

/**
 * Hook to throw errors that will be caught by error boundary
 * Useful for async error handling in components
 *
 * @example
 * ```tsx
 * const throwError = useErrorHandler();
 *
 * try {
 *   await someAsyncOperation();
 * } catch (error) {
 *   throwError(error);
 * }
 * ```
 */
export function useErrorHandler(): (error: Error) => void {
  const [, setError] = React.useState<Error>();

  return React.useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
}

// ==========================================
// EXPORTS
// ==========================================

export default GlobalErrorBoundary;
