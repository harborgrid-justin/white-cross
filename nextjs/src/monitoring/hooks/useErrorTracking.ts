/**
 * Error Tracking Hook
 *
 * React hook for error tracking and reporting
 */

'use client';

import { useEffect, useCallback } from 'react';
import { captureException, setTag, setContext } from '../sentry';
import { trackError } from '../analytics';
import { error as logError } from '../logger';

export interface UseErrorTrackingOptions {
  context?: Record<string, any>;
  tags?: Record<string, string>;
  onError?: (error: Error) => void;
}

export function useErrorTracking(options: UseErrorTrackingOptions = {}) {
  const { context, tags, onError } = options;

  // Set context on mount
  useEffect(() => {
    if (context) {
      setContext('component', context);
    }

    if (tags) {
      Object.entries(tags).forEach(([key, value]) => {
        setTag(key, value);
      });
    }
  }, [context, tags]);

  /**
   * Report error to monitoring services
   */
  const reportError = useCallback(
    (error: Error, errorContext?: Record<string, any>) => {
      const fullContext = {
        ...context,
        ...errorContext,
      };

      // Report to Sentry
      captureException(error, fullContext);

      // Track in analytics
      trackError(error, fullContext);

      // Log error
      logError(error.message, error, fullContext);

      // Call custom error handler
      onError?.(error);
    },
    [context, onError]
  );

  /**
   * Wrap async function with error handling
   */
  const wrapAsync = useCallback(
    <T extends (...args: any[]) => Promise<any>>(fn: T): T => {
      return (async (...args: any[]) => {
        try {
          return await fn(...args);
        } catch (error) {
          reportError(error as Error, {
            function: fn.name,
            args: args.length,
          });
          throw error;
        }
      }) as T;
    },
    [reportError]
  );

  /**
   * Wrap synchronous function with error handling
   */
  const wrapSync = useCallback(
    <T extends (...args: any[]) => any>(fn: T): T => {
      return ((...args: any[]) => {
        try {
          return fn(...args);
        } catch (error) {
          reportError(error as Error, {
            function: fn.name,
            args: args.length,
          });
          throw error;
        }
      }) as T;
    },
    [reportError]
  );

  return {
    reportError,
    wrapAsync,
    wrapSync,
  };
}
