/**
 * Sentry Error Tracking Configuration (Lazy Loaded)
 *
 * HIPAA-compliant error tracking with PHI sanitization
 *
 * PERFORMANCE OPTIMIZATION: Lazy loads Sentry SDK to reduce initial bundle size by ~150KB (gzipped)
 */

import type * as SentryTypes from '@sentry/nextjs';
import {
  sanitizeError,
  sanitizeUserContext,
  sanitizeBreadcrumb,
  sanitizeObject,
} from './utils/phi-sanitizer';
import type { UserContext } from './types';

// Initialize flag to prevent double initialization
let isInitialized = false;
let sentryLoadPromise: Promise<typeof SentryTypes> | null = null;

/**
 * Lazy load Sentry SDK
 * Only loads in production to minimize bundle size
 */
async function loadSentry(): Promise<typeof SentryTypes | null> {
  // Skip in development to save bundle size
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  // Return existing promise if already loading
  if (sentryLoadPromise) {
    return sentryLoadPromise;
  }

  // Load Sentry dynamically
  sentryLoadPromise = import('@sentry/nextjs');
  return sentryLoadPromise;
}

export interface SentryConfig {
  dsn: string;
  environment: string;
  release?: string;
  tracesSampleRate?: number;
  replaysSessionSampleRate?: number;
  replaysOnErrorSampleRate?: number;
  debug?: boolean;
}

/**
 * Initialize Sentry with HIPAA-compliant configuration (Lazy Loaded)
 */
export async function initSentry(config: SentryConfig): Promise<void> {
  if (isInitialized) {
    console.warn('Sentry already initialized');
    return;
  }

  if (!config.dsn) {
    console.warn('Sentry DSN not provided, skipping initialization');
    return;
  }

  // Lazy load Sentry
  const Sentry = await loadSentry();
  if (!Sentry) {
    return;
  }

  Sentry.init({
    dsn: config.dsn,
    environment: config.environment || 'production',
    release: config.release,

    // Performance Monitoring
    tracesSampleRate: config.tracesSampleRate || 0.1, // 10% of transactions

    // Session Replay (with PHI masking)
    replaysSessionSampleRate: config.replaysSessionSampleRate || 0.01, // 1% of sessions
    replaysOnErrorSampleRate: config.replaysOnErrorSampleRate || 1.0, // 100% of errors

    // Integration configuration
    integrations: [
      Sentry.browserTracingIntegration({
        // Trace navigation and interactions
        tracePropagationTargets: [
          'localhost',
          /^https:\/\/.*\.whitecross\.app/,
          process.env.NEXT_PUBLIC_API_URL || '',
        ],
      }),
      Sentry.replayIntegration({
        // Mask all text and input content by default
        maskAllText: true,
        maskAllInputs: true,
        // Block specific elements that might contain PHI
        block: [
          '[data-phi]',
          '[data-sensitive]',
          '.health-record',
          '.patient-info',
          '.medication-detail',
          '.emergency-contact',
        ],
      }),
    ],

    // PHI Sanitization - beforeSend hook
    beforeSend: (event, hint) => {
      // Sanitize error message and stack trace
      if (event.message) {
        event.message = sanitizeObject(event.message, { strictMode: true });
      }

      if (event.exception?.values) {
        event.exception.values = event.exception.values.map((exception) => {
          return {
            ...exception,
            value: sanitizeObject(exception.value || '', { strictMode: true }),
            stacktrace: exception.stacktrace
              ? {
                  ...exception.stacktrace,
                  frames: exception.stacktrace.frames?.map((frame) => ({
                    ...frame,
                    vars: sanitizeObject(frame.vars || {}, { strictMode: true }),
                  })),
                }
              : undefined,
          };
        });
      }

      // Sanitize request data
      if (event.request) {
        event.request = sanitizeObject(event.request, { strictMode: true });
      }

      // Sanitize extra context
      if (event.extra) {
        event.extra = sanitizeObject(event.extra, { strictMode: true });
      }

      // Sanitize contexts
      if (event.contexts) {
        event.contexts = sanitizeObject(event.contexts, { strictMode: true });
      }

      return event;
    },

    // Sanitize breadcrumbs
    beforeBreadcrumb: (breadcrumb, hint) => {
      return sanitizeBreadcrumb(breadcrumb);
    },

    // Error filtering - ignore non-critical errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'chrome-extension://',
      'moz-extension://',
      // Network errors that don't need tracking
      'NetworkError',
      'Failed to fetch',
      'Load failed',
      // React hydration warnings (development)
      'Hydration failed',
      'Text content does not match',
    ],

    // Don't report errors from certain URLs
    denyUrls: [
      /extensions\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i,
    ],

    debug: config.debug || false,
  });

  isInitialized = true;
}

/**
 * Set user context (sanitized) (Lazy Loaded)
 */
export async function setUserContext(user: UserContext | null): Promise<void> {
  if (!isInitialized) return;

  const Sentry = await loadSentry();
  if (!Sentry) return;

  if (user) {
    const sanitizedUser = sanitizeUserContext(user);
    Sentry.setUser({
      id: sanitizedUser.id,
      role: sanitizedUser.role,
      district_id: sanitizedUser.districtId,
      school_id: sanitizedUser.schoolId,
    });
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Add breadcrumb for user actions (Lazy Loaded)
 */
export async function addBreadcrumb(
  message: string,
  category: string,
  level: SentryTypes.SeverityLevel = 'info',
  data?: Record<string, any>
): Promise<void> {
  if (!isInitialized) return;

  const Sentry = await loadSentry();
  if (!Sentry) return;

  Sentry.addBreadcrumb({
    message: sanitizeObject(message, { strictMode: true }),
    category,
    level,
    data: data ? sanitizeObject(data, { strictMode: true }) : undefined,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Capture exception with sanitization (Lazy Loaded)
 */
export async function captureException(
  error: Error,
  context?: Record<string, any>,
  level?: SentryTypes.SeverityLevel
): Promise<string | undefined> {
  if (!isInitialized) {
    console.error('Sentry not initialized, logging error:', error);
    return undefined;
  }

  const Sentry = await loadSentry();
  if (!Sentry) return undefined;

  const sanitizedError = sanitizeError(error);

  return Sentry.captureException(sanitizedError, {
    level: level || 'error',
    contexts: context
      ? { extra: sanitizeObject(context, { strictMode: true }) }
      : undefined,
  });
}

/**
 * Capture message with sanitization (Lazy Loaded)
 */
export async function captureMessage(
  message: string,
  level: SentryTypes.SeverityLevel = 'info',
  context?: Record<string, any>
): Promise<string | undefined> {
  if (!isInitialized) return undefined;

  const Sentry = await loadSentry();
  if (!Sentry) return undefined;

  const sanitizedMessage = sanitizeObject(message, { strictMode: true });

  return Sentry.captureMessage(sanitizedMessage, {
    level,
    contexts: context
      ? { extra: sanitizeObject(context, { strictMode: true }) }
      : undefined,
  });
}

/**
 * Start a new transaction for performance monitoring (Lazy Loaded)
 */
export async function startTransaction(
  name: string,
  op: string,
  description?: string
): Promise<SentryTypes.Transaction | undefined> {
  if (!isInitialized) return undefined;

  const Sentry = await loadSentry();
  if (!Sentry) return undefined;

  return Sentry.startTransaction({
    name,
    op,
    description,
  });
}

/**
 * Set custom tags for error grouping (Lazy Loaded)
 */
export async function setTag(key: string, value: string): Promise<void> {
  if (!isInitialized) return;

  const Sentry = await loadSentry();
  if (!Sentry) return;

  Sentry.setTag(key, value);
}

/**
 * Set custom context (Lazy Loaded)
 */
export async function setContext(name: string, context: Record<string, any>): Promise<void> {
  if (!isInitialized) return;

  const Sentry = await loadSentry();
  if (!Sentry) return;

  Sentry.setContext(name, sanitizeObject(context, { strictMode: true }));
}

/**
 * Clear all context and user data (Lazy Loaded)
 */
export async function clearContext(): Promise<void> {
  if (!isInitialized) return;

  const Sentry = await loadSentry();
  if (!Sentry) return;

  Sentry.setUser(null);
  Sentry.setContext('extra', {});
}

/**
 * Wrap async function with error boundary
 */
export function withErrorBoundary<T extends (...args: any[]) => any>(
  fn: T,
  options?: {
    name?: string;
    onError?: (error: Error) => void;
  }
): T {
  return ((...args: any[]) => {
    try {
      const result = fn(...args);

      // Handle promises
      if (result instanceof Promise) {
        return result.catch((error) => {
          captureException(error, {
            function: options?.name || fn.name,
            args: sanitizeObject(args, { strictMode: true }),
          });
          options?.onError?.(error);
          throw error;
        });
      }

      return result;
    } catch (error) {
      captureException(error as Error, {
        function: options?.name || fn.name,
        args: sanitizeObject(args, { strictMode: true }),
      });
      options?.onError?.(error as Error);
      throw error;
    }
  }) as T;
}

/**
 * Healthcare-specific error tracking
 */
export const healthcare = {
  /**
   * Track medication administration error
   */
  medicationError: (error: Error, medicationId: string, studentId: string) => {
    captureException(error, {
      type: 'medication_error',
      medication_id: medicationId,
      student_id: studentId,
    }, 'error');

    setTag('error_type', 'medication');
  },

  /**
   * Track PHI access
   */
  phiAccess: (action: string, resourceType: string, resourceId: string) => {
    addBreadcrumb(
      `PHI Access: ${action}`,
      'healthcare',
      'info',
      {
        action,
        resource_type: resourceType,
        resource_id: resourceId,
      }
    );
  },

  /**
   * Track compliance violation
   */
  complianceViolation: (
    violation: string,
    severity: 'low' | 'medium' | 'high' | 'critical'
  ) => {
    captureMessage(`Compliance Violation: ${violation}`, 'warning', {
      type: 'compliance_violation',
      severity,
    });

    setTag('violation_type', 'compliance');
    setTag('severity', severity);
  },

  /**
   * Track emergency alert
   */
  emergencyAlert: (alertType: string, context: Record<string, any>) => {
    captureMessage(`Emergency Alert: ${alertType}`, 'warning', {
      type: 'emergency_alert',
      alert_type: alertType,
      ...sanitizeObject(context, { strictMode: true }),
    });

    setTag('alert_type', 'emergency');
  },
};

export default {
  initSentry,
  setUserContext,
  addBreadcrumb,
  captureException,
  captureMessage,
  startTransaction,
  setTag,
  setContext,
  clearContext,
  withErrorBoundary,
  healthcare,
};
