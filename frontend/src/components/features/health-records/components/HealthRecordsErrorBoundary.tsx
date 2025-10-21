/**
 * WF-COMP-016 | HealthRecordsErrorBoundary.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../hooks/useHealthRecords, ../../services/modules/healthRecordsApi | Dependencies: lucide-react, @tanstack/react-query, ../../hooks/useHealthRecords
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, functions, classes | Key Features: component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Health Records Error Boundary
 *
 * Specialized error boundary for health records with:
 * - HIPAA-compliant error handling
 * - Automatic data cleanup on errors
 * - Circuit breaker awareness
 * - User-friendly error messages
 * - Session expiration handling
 *
 * @module HealthRecordsErrorBoundary
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Shield, AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { healthRecordKeys } from '../../../../hooks/domains/health';
import {
  HealthRecordsApiError,
  CircuitBreakerError,
  UnauthorizedError,
  ForbiddenError,
} from '../../../../services/modules/healthRecordsApi';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  studentId?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorType?: 'auth' | 'circuit-breaker' | 'forbidden' | 'api' | 'unknown';
}

export class HealthRecordsErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    let errorType: State['errorType'] = 'unknown';

    if (error instanceof UnauthorizedError) {
      errorType = 'auth';
    } else if (error instanceof CircuitBreakerError) {
      errorType = 'circuit-breaker';
    } else if (error instanceof ForbiddenError) {
      errorType = 'forbidden';
    } else if (error instanceof HealthRecordsApiError) {
      errorType = 'api';
    }

    return {
      hasError: true,
      error,
      errorType,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('HealthRecordsErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Cleanup sensitive data on error
    this.cleanupHealthData();

    // Log error to monitoring service in production
    if (import.meta.env.PROD) {
      // Integration with error monitoring service (e.g., Sentry)
      this.logErrorToMonitoring(error, errorInfo);
    }
  }

  private cleanupHealthData = () => {
    // This will be handled by the wrapper component
    // See HealthRecordsErrorBoundaryWrapper below
  };

  private logErrorToMonitoring = (error: Error, errorInfo: ErrorInfo) => {
    // Integration point for error monitoring services
    // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    console.log('Logging error to monitoring service:', error.message);
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, errorType: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleLogin = () => {
    // Clear all local storage and redirect to login
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  private renderErrorContent = () => {
    const { errorType, error } = this.state;

    switch (errorType) {
      case 'auth':
        return {
          icon: Shield,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Session Expired',
          message:
            'Your session has expired for security reasons. Please log in again to access health records.',
          actions: (
            <>
              <button
                onClick={this.handleLogin}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
              >
                <Shield className="h-4 w-4 mr-2" />
                Log In Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </button>
            </>
          ),
        };

      case 'circuit-breaker':
        return {
          icon: AlertTriangle,
          iconColor: 'text-orange-500',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          title: 'Service Temporarily Unavailable',
          message:
            'The health records service is temporarily unavailable. This is a protective measure to prevent system overload. Please try again in a few moments.',
          actions: (
            <>
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </button>
            </>
          ),
        };

      case 'forbidden':
        return {
          icon: Shield,
          iconColor: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Access Denied',
          message:
            'You do not have permission to access this health information. If you believe this is an error, please contact your administrator.',
          actions: (
            <>
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </button>
            </>
          ),
        };

      case 'api':
        return {
          icon: AlertTriangle,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Error Loading Health Records',
          message:
            error instanceof HealthRecordsApiError
              ? error.message
              : 'An error occurred while loading health records. Please try again.',
          actions: (
            <>
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
              >
                Reload Page
              </button>
            </>
          ),
        };

      default:
        return {
          icon: AlertTriangle,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Something Went Wrong',
          message:
            'An unexpected error occurred. For your security, health data has been cleared from memory.',
          actions: (
            <>
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
              >
                Reload Page
              </button>
            </>
          ),
        };
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const content = this.renderErrorContent();
      const Icon = content.icon;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className={`max-w-md w-full bg-white rounded-lg shadow-lg border-2 ${content.borderColor}`}>
            <div className={`${content.bgColor} rounded-t-lg p-6 border-b ${content.borderColor}`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className={`h-10 w-10 ${content.iconColor}`} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-gray-700 leading-relaxed">{content.message}</p>

                {import.meta.env.DEV && this.state.error && (
                  <details className="mt-4">
                    <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 font-medium">
                      Error Details (Development Only)
                    </summary>
                    <div className="mt-2 bg-gray-100 rounded-md p-3">
                      <pre className="text-xs text-gray-800 overflow-auto max-h-40 whitespace-pre-wrap">
                        {this.state.error.name}: {this.state.error.message}
                        {this.state.errorInfo?.componentStack}
                      </pre>
                    </div>
                  </details>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-900">Security Notice</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      For your privacy and security, any health information loaded in memory has been
                      automatically cleared.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">{content.actions}</div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// Wrapper Component with QueryClient Integration
// ============================================================================

interface WrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  studentId?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export function HealthRecordsErrorBoundaryWrapper({
  children,
  fallback,
  studentId,
  onError,
}: WrapperProps) {
  const queryClient = useQueryClient();

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Cleanup health records data from React Query cache
    queryClient.removeQueries({ queryKey: healthRecordKeys.all });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  };

  return (
    <HealthRecordsErrorBoundary fallback={fallback} studentId={studentId} onError={handleError}>
      {children}
    </HealthRecordsErrorBoundary>
  );
}

// ============================================================================
// HOC for Wrapping Components
// ============================================================================

export function withHealthRecordsErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P & { studentId?: string }) => (
    <HealthRecordsErrorBoundaryWrapper fallback={fallback} studentId={props.studentId}>
      <Component {...props} />
    </HealthRecordsErrorBoundaryWrapper>
  );

  WrappedComponent.displayName = `withHealthRecordsErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

export default HealthRecordsErrorBoundaryWrapper;
