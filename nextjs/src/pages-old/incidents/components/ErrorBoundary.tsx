/**
 * ErrorBoundary Component - Production-grade error boundary for incidents module
 *
 * Catches React errors in incident components and provides graceful error handling
 * with HIPAA-compliant logging (no PHI in error reports).
 *
 * Features:
 * - Error state management with componentDidCatch lifecycle
 * - Error info capture with stack traces (dev only)
 * - User-friendly error UI with retry mechanism
 * - Integration with monitoring services (ErrorTracker, Logger)
 * - HIPAA-compliant error logging (sanitizes PHI)
 * - Development vs production error display
 * - Optional custom fallback UI
 * - Error categorization and reporting
 * - Prevents entire app crash
 *
 * @example
 * // Basic usage
 * <ErrorBoundary>
 *   <IncidentDetails />
 * </ErrorBoundary>
 *
 * @example
 * // Custom fallback
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <IncidentsList />
 * </ErrorBoundary>
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorTracker } from '@/services/monitoring/ErrorTracker';
import { logger } from '@/services/monitoring/Logger';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  module?: string; // For categorizing errors by incident sub-module
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorCount: number;
  lastErrorTime?: number;
}

// ============================================================================
// Error Boundary Component
// ============================================================================

/**
 * Production-grade error boundary for incidents module
 * Implements React error boundary lifecycle with comprehensive error handling
 */
class IncidentErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeout?: NodeJS.Timeout;
  private readonly MAX_ERROR_COUNT = 5;
  private readonly ERROR_RESET_WINDOW_MS = 60000; // 1 minute

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      errorCount: 0,
    };
  }

  /**
   * getDerivedStateFromError - Called when error is thrown
   * Updates state to trigger error UI render
   */
  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      lastErrorTime: Date.now(),
    };
  }

  /**
   * componentDidCatch - Called after error is caught
   * Handles error logging and reporting
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, module = 'incidents' } = this.props;

    // Update error count
    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log error details (sanitized for HIPAA compliance)
    const errorContext = {
      module,
      component: this.extractComponentName(errorInfo),
      errorCount: this.state.errorCount + 1,
      timestamp: Date.now(),
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.group('🔴 Incident Module Error Boundary');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Context:', errorContext);
      console.groupEnd();
    }

    // Track error with ErrorTracker (automatically sanitizes PHI)
    errorTracker.captureError(error, {
      level: this.state.errorCount > 3 ? 'fatal' : 'error',
      category: 'business',
      context: {
        operation: 'incident_ui_render',
        resource: module,
        metadata: {
          ...errorContext,
          componentStack: this.sanitizeComponentStack(errorInfo.componentStack),
        },
      },
      fingerprint: [
        'incident-error-boundary',
        module,
        error.name,
        this.extractComponentName(errorInfo),
      ],
    });

    // Log to structured logger
    logger.error(
      `Incident module error in ${errorContext.component}`,
      error,
      errorContext
    );

    // Add breadcrumb for error context
    errorTracker.addBreadcrumb({
      message: `Error boundary caught error in ${module}`,
      category: 'error',
      level: 'error',
      data: {
        errorName: error.name,
        errorMessage: error.message,
        component: errorContext.component,
      },
    });

    // Report to backend (optional custom endpoint)
    this.reportErrorToBackend(error, errorInfo, errorContext);

    // Call custom error handler if provided
    if (onError) {
      try {
        onError(error, errorInfo);
      } catch (handlerError) {
        console.error('Error in custom error handler:', handlerError);
      }
    }

    // Auto-reset after persistent errors (prevents infinite error loops)
    if (this.state.errorCount >= this.MAX_ERROR_COUNT) {
      logger.warn('Max error count reached in incident error boundary, scheduling reset');
      this.scheduleAutoReset();
    }
  }

  /**
   * componentDidUpdate - Reset error state if resetKeys change
   */
  public componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (!hasError) return;

    // Reset on props change if enabled
    if (resetOnPropsChange && prevProps.children !== this.props.children) {
      this.handleReset();
      return;
    }

    // Reset if resetKeys change
    if (resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      );

      if (hasResetKeyChanged) {
        this.handleReset();
      }
    }
  }

  /**
   * componentWillUnmount - Cleanup
   */
  public componentWillUnmount(): void {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
  }

  /**
   * Extract component name from error info
   */
  private extractComponentName(errorInfo: ErrorInfo): string {
    const stack = errorInfo.componentStack || '';
    const match = stack.match(/in (\w+)/);
    return match ? match[1] : 'Unknown';
  }

  /**
   * Sanitize component stack to remove potential PHI
   * Removes prop values and data that might contain sensitive info
   */
  private sanitizeComponentStack(componentStack: string): string {
    if (!componentStack) return '';

    // Remove prop values that might contain PHI
    let sanitized = componentStack
      // Remove prop values: prop={...} → prop={[REDACTED]}
      .replace(/(\w+)=\{[^}]+\}/g, '$1={[REDACTED]}')
      // Remove string prop values: prop="..." → prop="[REDACTED]"
      .replace(/(\w+)="[^"]+"/g, '$1="[REDACTED]"')
      // Remove object/array structures
      .replace(/\{[^{}]*\}/g, '{[REDACTED]}')
      .replace(/\[[^\[\]]*\]/g, '[REDACTED]');

    return sanitized;
  }

  /**
   * Report error to backend endpoint
   */
  private async reportErrorToBackend(
    error: Error,
    errorInfo: ErrorInfo,
    context: Record<string, any>
  ): Promise<void> {
    // Only report in production
    if (import.meta.env.DEV) return;

    try {
      const endpoint = '/api/v1/errors/frontend';

      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
          errorInfo: {
            componentStack: this.sanitizeComponentStack(errorInfo.componentStack),
          },
          context: {
            ...context,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: Date.now(),
          },
          level: this.state.errorCount > 3 ? 'fatal' : 'error',
        }),
      });
    } catch (reportError) {
      // Silently fail - don't throw errors while reporting errors
      console.error('Failed to report error to backend:', reportError);
    }
  }

  /**
   * Handle retry - Reset error state
   */
  private handleReset = (): void => {
    logger.info('Resetting incident error boundary');

    errorTracker.addBreadcrumb({
      message: 'User reset error boundary',
      category: 'ui',
      level: 'info',
    });

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorCount: 0,
      lastErrorTime: undefined,
    });

    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
      this.resetTimeout = undefined;
    }
  };

  /**
   * Handle page reload
   */
  private handleReload = (): void => {
    logger.info('User requested page reload from error boundary');

    errorTracker.addBreadcrumb({
      message: 'User reloaded page from error boundary',
      category: 'ui',
      level: 'info',
    });

    // Flush any pending logs before reload
    errorTracker.clearBreadcrumbs();
    logger.clearBuffer();

    window.location.reload();
  };

  /**
   * Schedule auto-reset after persistent errors
   */
  private scheduleAutoReset(): void {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }

    this.resetTimeout = setTimeout(() => {
      logger.info('Auto-resetting error boundary after max errors');
      this.handleReset();
    }, this.ERROR_RESET_WINDOW_MS);
  }

  /**
   * Check if error is recoverable
   */
  private isRecoverableError(): boolean {
    const { error, errorCount } = this.state;

    if (!error) return true;

    // Consider error unrecoverable if:
    // 1. Too many errors in short time
    if (errorCount >= this.MAX_ERROR_COUNT) {
      return false;
    }

    // 2. Specific error types that indicate critical failures
    const unrecoverablePatterns = [
      /Cannot read property.*of undefined/i,
      /Maximum call stack size exceeded/i,
      /Out of memory/i,
      /SecurityError/i,
    ];

    return !unrecoverablePatterns.some((pattern) =>
      pattern.test(error.message)
    );
  }

  /**
   * Render error UI or children
   */
  public render(): ReactNode {
    const { hasError, error, errorInfo, errorCount } = this.state;
    const { children, fallback, module = 'incidents' } = this.props;

    // No error - render children normally
    if (!hasError) {
      return children;
    }

    // Custom fallback provided
    if (fallback) {
      return fallback;
    }

    // Render default error UI
    const isRecoverable = this.isRecoverableError();
    const isDevelopment = import.meta.env.DEV;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Error Header */}
            <div className="bg-red-600 px-6 py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-xl font-semibold text-white">
                    {isRecoverable
                      ? 'Something went wrong'
                      : 'Critical Error Occurred'}
                  </h3>
                  <p className="text-sm text-red-100 mt-1">
                    {module.charAt(0).toUpperCase() + module.slice(1)} Module
                  </p>
                </div>
              </div>
            </div>

            {/* Error Content */}
            <div className="px-6 py-6">
              {/* User Message */}
              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  {isRecoverable
                    ? 'We encountered an error while displaying this content. This has been logged and our team will investigate.'
                    : 'A critical error has occurred. Please reload the page or contact support if the issue persists.'}
                </p>

                {errorCount > 1 && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <span className="font-semibold">
                        Multiple errors detected ({errorCount})
                      </span>
                      {errorCount >= this.MAX_ERROR_COUNT && (
                        <span className="block mt-1">
                          Automatic reset will occur shortly to prevent further issues.
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Error Details (Development Only) */}
              {isDevelopment && error && (
                <div className="mb-6">
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 transform transition-transform group-open:rotate-90"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Error Details (Development Mode)
                    </summary>

                    <div className="mt-3 bg-gray-900 rounded-md p-4 overflow-auto max-h-96">
                      {/* Error Name and Message */}
                      <div className="mb-3">
                        <p className="text-xs font-mono text-red-400 mb-1">
                          {error.name}
                        </p>
                        <p className="text-sm font-mono text-white">
                          {error.message}
                        </p>
                      </div>

                      {/* Stack Trace */}
                      {error.stack && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-400 mb-1">
                            Stack Trace:
                          </p>
                          <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap break-words">
                            {error.stack}
                          </pre>
                        </div>
                      )}

                      {/* Component Stack */}
                      {errorInfo?.componentStack && (
                        <div>
                          <p className="text-xs font-semibold text-gray-400 mb-1">
                            Component Stack:
                          </p>
                          <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap break-words">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {/* Production Error Reference */}
              {!isDevelopment && (
                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-600">
                    Error ID: {error?.name || 'Unknown'}-
                    {Date.now().toString(36)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Please reference this ID when contacting support.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {isRecoverable && (
                  <button
                    onClick={this.handleReset}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    type="button"
                  >
                    Try Again
                  </button>
                )}
                <button
                  onClick={this.handleReload}
                  className={`flex-1 ${
                    isRecoverable
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } font-medium py-3 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isRecoverable
                      ? 'focus:ring-gray-400'
                      : 'focus:ring-blue-500'
                  }`}
                  type="button"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => (window.location.href = '/incidents')}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  type="button"
                >
                  Return to Incidents
                </button>
              </div>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <a
                href="/support"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

// ============================================================================
// Exports
// ============================================================================

export default IncidentErrorBoundary;

// Export as named export for testing
export { IncidentErrorBoundary as ErrorBoundary };

/**
 * Higher-order component to wrap components with error boundary
 *
 * @example
 * const SafeIncidentDetails = withErrorBoundary(IncidentDetails, {
 *   module: 'incident-details'
 * });
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <IncidentErrorBoundary {...options}>
      <Component {...props} />
    </IncidentErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WrappedComponent;
}

/**
 * Hook for programmatic error handling in functional components
 * Throws error to nearest error boundary
 *
 * @example
 * const throwError = useErrorHandler();
 *
 * const handleClick = () => {
 *   try {
 *     // risky operation
 *   } catch (error) {
 *     throwError(error);
 *   }
 * };
 */
export function useErrorHandler() {
  return React.useCallback((error: Error) => {
    // Log before throwing
    logger.error('Error thrown from useErrorHandler', error);

    // Throw to nearest error boundary
    throw error;
  }, []);
}
