/**
 * Redux Error Handling Utilities
 *
 * Comprehensive error handling patterns for Redux actions and components.
 */

import React, { Component, ReactNode } from 'react';
import { AsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { useAppSelector } from '../hooks';
import type { RootState } from '../reduxStore';

/**
 * Standard error types in the application
 */
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTH_ERROR',
  AUTHORIZATION = 'PERMISSION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER_ERROR',
  TIMEOUT = 'TIMEOUT_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR',
}

/**
 * Standard error structure
 */
export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
  timestamp: string;
}

/**
 * Parse and classify errors from API responses
 */
export function parseError(error: any): AppError {
  const timestamp = new Date().toISOString();

  // Network errors
  if (!error.response && error.request) {
    return {
      type: ErrorType.NETWORK,
      message: 'Unable to connect to the server. Please check your internet connection.',
      timestamp,
    };
  }

  // HTTP status-based errors
  const status = error.response?.status || error.status;

  switch (status) {
    case 400:
      return {
        type: ErrorType.VALIDATION,
        message: error.response?.data?.message || 'Invalid request data',
        status,
        details: error.response?.data?.errors,
        timestamp,
      };

    case 401:
      return {
        type: ErrorType.AUTHENTICATION,
        message: 'Your session has expired. Please log in again.',
        status,
        timestamp,
      };

    case 403:
      return {
        type: ErrorType.AUTHORIZATION,
        message: 'You do not have permission to perform this action.',
        status,
        timestamp,
      };

    case 404:
      return {
        type: ErrorType.NOT_FOUND,
        message: error.response?.data?.message || 'Resource not found',
        status,
        timestamp,
      };

    case 408:
    case 504:
      return {
        type: ErrorType.TIMEOUT,
        message: 'Request timed out. Please try again.',
        status,
        timestamp,
      };

    case 500:
    case 502:
    case 503:
      return {
        type: ErrorType.SERVER,
        message: 'Server error. Please try again later.',
        status,
        details: import.meta.env.DEV ? error.response?.data : undefined,
        timestamp,
      };

    default:
      return {
        type: ErrorType.UNKNOWN,
        message: error.message || 'An unexpected error occurred',
        status,
        timestamp,
      };
  }
}

/**
 * Handle async thunk errors with consistent patterns
 *
 * @example
 * const handleCreateStudent = handleAsyncError(
 *   async (data) => await dispatch(createStudent(data)).unwrap(),
 *   {
 *     successMessage: 'Student created successfully',
 *     errorMessage: 'Failed to create student',
 *     onSuccess: (result) => navigate(`/students/${result.id}`),
 *     onError: (error) => setFormErrors(error.details),
 *   }
 * );
 */
export function handleAsyncError<T>(
  asyncFn: () => Promise<T>,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    showToast?: boolean;
    onSuccess?: (result: T) => void;
    onError?: (error: AppError) => void;
    retryable?: boolean;
    maxRetries?: number;
  }
): Promise<T | void> {
  const {
    successMessage,
    errorMessage,
    showToast = true,
    onSuccess,
    onError,
    retryable = false,
    maxRetries = 3,
  } = options || {};

  let retryCount = 0;

  const execute = async (): Promise<T | void> => {
    try {
      const result = await asyncFn();

      if (showToast && successMessage) {
        toast.success(successMessage);
      }

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error: any) {
      const appError = parseError(error);

      // Retry logic for retryable errors
      if (
        retryable &&
        retryCount < maxRetries &&
        (appError.type === ErrorType.NETWORK || appError.type === ErrorType.TIMEOUT)
      ) {
        retryCount++;
        console.log(`Retrying... (${retryCount}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        return execute();
      }

      // Show error toast
      if (showToast) {
        const message = errorMessage || appError.message;
        toast.error(message);
      }

      // Custom error handler
      if (onError) {
        onError(appError);
      }

      // Log error in development
      if (import.meta.env.DEV) {
        console.error('[AsyncError]', appError);
      }

      throw appError;
    }
  };

  return execute();
}

/**
 * React Error Boundary for Redux-connected components
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ReduxErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to error tracking service (e.g., Sentry)
    if (import.meta.env.PROD && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: { react: { componentStack: errorInfo.componentStack } },
      });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-fallback" style={fallbackStyles.container}>
          <div style={fallbackStyles.content}>
            <h1 style={fallbackStyles.title}>⚠️ Something went wrong</h1>
            <p style={fallbackStyles.message}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              style={fallbackStyles.button}
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const fallbackStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
  content: {
    textAlign: 'center' as const,
    maxWidth: '500px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333',
  },
  message: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '24px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

/**
 * Hook for managing error states in components
 *
 * @example
 * const { error, setError, clearError, hasError } = useErrorState();
 *
 * const handleSubmit = async (data) => {
 *   clearError();
 *   try {
 *     await submitData(data);
 *   } catch (err) {
 *     setError(err);
 *   }
 * };
 */
export function useErrorState() {
  const [error, setErrorState] = React.useState<AppError | null>(null);

  const setError = (err: any) => {
    setErrorState(parseError(err));
  };

  const clearError = () => {
    setErrorState(null);
  };

  return {
    error,
    setError,
    clearError,
    hasError: error !== null,
  };
}

/**
 * Hook for collecting errors from multiple Redux slices
 *
 * @example
 * const { errors, hasErrors, clearAllErrors } = useReduxErrors([
 *   'students',
 *   'medications',
 *   'appointments',
 * ]);
 */
export function useReduxErrors(slices: string[]) {
  const errors = useAppSelector((state: RootState) => {
    const result: Record<string, string | null> = {};

    slices.forEach(slice => {
      const sliceState = (state as any)[slice];
      if (sliceState?.loading) {
        // Check all loading states for errors
        Object.keys(sliceState.loading).forEach(key => {
          const loadingState = sliceState.loading[key];
          if (loadingState?.error) {
            result[`${slice}.${key}`] = loadingState.error;
          }
        });
      }
    });

    return result;
  });

  const hasErrors = Object.values(errors).some(error => error !== null);

  return {
    errors,
    hasErrors,
    errorCount: Object.values(errors).filter(e => e !== null).length,
  };
}

/**
 * Error display component with different styles based on error type
 */
interface ErrorMessageProps {
  error: AppError | string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorMessage({
  error,
  onRetry,
  onDismiss,
  className = '',
}: ErrorMessageProps) {
  if (!error) return null;

  const appError = typeof error === 'string'
    ? { type: ErrorType.UNKNOWN, message: error, timestamp: new Date().toISOString() }
    : error;

  const getErrorStyle = () => {
    switch (appError.type) {
      case ErrorType.VALIDATION:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case ErrorType.AUTHENTICATION:
      case ErrorType.AUTHORIZATION:
        return 'bg-red-50 border-red-200 text-red-800';
      case ErrorType.NETWORK:
      case ErrorType.TIMEOUT:
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getErrorStyle()} ${className}`}>
      <div className="flex items-start">
        <div className="flex-1">
          <h4 className="font-semibold mb-1">Error</h4>
          <p className="text-sm">{appError.message}</p>

          {appError.details && import.meta.env.DEV && (
            <details className="mt-2 text-xs">
              <summary className="cursor-pointer">Details</summary>
              <pre className="mt-1 p-2 bg-white/50 rounded">
                {JSON.stringify(appError.details, null, 2)}
              </pre>
            </details>
          )}
        </div>

        <div className="flex gap-2 ml-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm underline hover:no-underline"
            >
              Retry
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Global error monitor that logs all Redux errors
 * Can be integrated with error tracking services
 */
export function createErrorMonitor(options?: {
  logToConsole?: boolean;
  sendToService?: (error: AppError) => void;
}) {
  const { logToConsole = true, sendToService } = options || {};

  return (error: AppError) => {
    if (logToConsole) {
      console.error('[Redux Error]', error);
    }

    if (sendToService) {
      sendToService(error);
    }

    // Send to Sentry or similar service
    if (import.meta.env.PROD && (window as any).Sentry) {
      (window as any).Sentry.captureException(new Error(error.message), {
        tags: {
          errorType: error.type,
          errorCode: error.code,
        },
        extra: {
          status: error.status,
          details: error.details,
          timestamp: error.timestamp,
        },
      });
    }
  };
}

/**
 * Validation error handling for forms
 */
export function extractValidationErrors(error: AppError): Record<string, string> {
  if (error.type !== ErrorType.VALIDATION || !error.details) {
    return {};
  }

  // Convert validation errors to field-level errors
  const fieldErrors: Record<string, string> = {};

  if (Array.isArray(error.details)) {
    error.details.forEach((err: any) => {
      if (err.field && err.message) {
        fieldErrors[err.field] = err.message;
      }
    });
  } else if (typeof error.details === 'object') {
    Object.entries(error.details).forEach(([field, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        fieldErrors[field] = messages[0];
      } else if (typeof messages === 'string') {
        fieldErrors[field] = messages;
      }
    });
  }

  return fieldErrors;
}

/**
 * Retry wrapper for failed operations
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options?: {
    maxRetries?: number;
    delay?: number;
    backoff?: boolean;
    shouldRetry?: (error: any, attempt: number) => boolean;
  }
): Promise<T> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = true,
    shouldRetry = () => true,
  } = options || {};

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries && shouldRetry(error, attempt)) {
        const waitTime = backoff ? delay * Math.pow(2, attempt) : delay;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      break;
    }
  }

  throw lastError;
}
