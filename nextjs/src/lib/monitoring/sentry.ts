/**
 * Sentry Error Tracking and Performance Monitoring
 *
 * Provides comprehensive error tracking, performance monitoring,
 * and session replay for production environments.
 */

import * as Sentry from '@sentry/nextjs';

/**
 * Initialize Sentry for Next.js
 * Should be called in instrumentation.ts
 */
export function initSentry() {
  const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV;

  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured, error tracking disabled');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment,

    // Performance Monitoring
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
    profilesSampleRate: environment === 'production' ? 0.1 : 1.0,

    // Session Replay
    replaysSessionSampleRate: environment === 'production' ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,

    // Error filtering
    beforeSend(event, hint) {
      // Filter out non-critical errors in production
      if (environment === 'production') {
        // Don't send browser extension errors
        if (event.exception?.values?.[0]?.value?.includes('extension://')) {
          return null;
        }

        // Don't send canceled requests
        if (event.exception?.values?.[0]?.type === 'AbortError') {
          return null;
        }
      }

      // Sanitize PHI from error messages (HIPAA compliance)
      if (event.message) {
        event.message = sanitizePHI(event.message);
      }

      if (event.exception?.values) {
        event.exception.values = event.exception.values.map(exception => ({
          ...exception,
          value: sanitizePHI(exception.value || ''),
        }));
      }

      return event;
    },

    // Additional configuration
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ['localhost', /^https:\/\/.*\.whitecross\.com/],
      }),
      new Sentry.Replay({
        maskAllText: true, // HIPAA compliance: mask all text
        blockAllMedia: true, // HIPAA compliance: block all media
      }),
    ],

    // Ignore common errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Network request failed',
      'Failed to fetch',
      'Load failed',
      'NetworkError',
    ],

    // Release tracking
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || process.env.VERCEL_GIT_COMMIT_SHA,
  });
}

/**
 * Sanitize PHI from error messages
 * Removes patient names, SSNs, DOBs, and other identifiable information
 */
function sanitizePHI(text: string): string {
  if (!text) return text;

  return (
    text
      // Remove SSN patterns (XXX-XX-XXXX)
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN-REDACTED]')
      // Remove email addresses
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL-REDACTED]')
      // Remove phone numbers
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE-REDACTED]')
      // Remove dates that might be DOB (MM/DD/YYYY, MM-DD-YYYY)
      .replace(/\b\d{1,2}[/-]\d{1,2}[/-]\d{4}\b/g, '[DATE-REDACTED]')
      // Remove potential medical record numbers (MRN)
      .replace(/\bMRN[:\s]*\d+\b/gi, '[MRN-REDACTED]')
      // Remove potential patient IDs
      .replace(/\bpatient[_\s]?id[:\s]*\d+\b/gi, '[PATIENT-ID-REDACTED]')
  );
}

/**
 * Capture exception with context
 */
export function captureException(
  error: Error,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    level?: Sentry.SeverityLevel;
  }
) {
  if (context?.tags) {
    Sentry.setTags(context.tags);
  }

  if (context?.extra) {
    Sentry.setExtras(context.extra);
  }

  Sentry.captureException(error, {
    level: context?.level || 'error',
  });
}

/**
 * Capture message with context
 */
export function captureMessage(
  message: string,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    level?: Sentry.SeverityLevel;
  }
) {
  const sanitizedMessage = sanitizePHI(message);

  if (context?.tags) {
    Sentry.setTags(context.tags);
  }

  if (context?.extra) {
    Sentry.setExtras(context.extra);
  }

  Sentry.captureMessage(sanitizedMessage, context?.level || 'info');
}

/**
 * Set user context (no PHI)
 */
export function setUserContext(user: {
  id: string;
  role?: string;
  organizationId?: string;
}) {
  Sentry.setUser({
    id: user.id,
    // DO NOT include name, email, or other PHI
    role: user.role,
    organizationId: user.organizationId,
  });
}

/**
 * Clear user context
 */
export function clearUserContext() {
  Sentry.setUser(null);
}

/**
 * Start transaction for performance monitoring
 */
export function startTransaction(
  name: string,
  operation: string,
  data?: Record<string, unknown>
) {
  return Sentry.startTransaction({
    name,
    op: operation,
    data,
  });
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category?: string,
  level?: Sentry.SeverityLevel,
  data?: Record<string, unknown>
) {
  const sanitizedMessage = sanitizePHI(message);

  Sentry.addBreadcrumb({
    message: sanitizedMessage,
    category: category || 'custom',
    level: level || 'info',
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Wrap async function with error tracking
 */
export function withSentry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  functionName?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureException(error as Error, {
        tags: {
          function: functionName || fn.name,
        },
      });
      throw error;
    }
  }) as T;
}

/**
 * Export Sentry for advanced usage
 */
export { Sentry };
