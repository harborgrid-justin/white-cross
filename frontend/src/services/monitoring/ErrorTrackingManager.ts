/**
 * Error Tracking Manager
 *
 * Handles error tracking, categorization, and global error handlers
 */

import type * as SentryTypes from '@sentry/nextjs';
import { logger } from './Logger';
import { metricsService } from './MetricsService';
import type { ErrorContext, ErrorCategory } from './types';

export class ErrorTrackingManager {
  private sentryManager: { loadSentry: () => Promise<typeof SentryTypes | null>; isInitialized: () => boolean };

  constructor(sentryManager: { loadSentry: () => Promise<typeof SentryTypes | null>; isInitialized: () => boolean }) {
    this.sentryManager = sentryManager;
  }

  /**
   * Initialize error tracking components
   */
  public async initialize(): Promise<void> {
    // Set up global error handlers
    this.setupGlobalErrorHandlers();

    // Add initial breadcrumb
    await this.addBreadcrumb({
      message: 'Error tracking initialized',
      category: 'system',
      level: 'info',
    });
  }

  /**
   * Set up global error handlers
   */
  private setupGlobalErrorHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(event.reason, {
        category: 'unknown',
        context: {
          operation: 'unhandled_promise_rejection',
        },
      });
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.captureError(event.error || event.message, {
        category: 'unknown',
        context: {
          operation: 'global_error',
          metadata: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        },
      });
    });
  }

  /**
   * Capture exception with context
   */
  public async captureException(
    error: Error,
    context?: {
      tags?: Record<string, string>;
      extra?: Record<string, unknown>;
      level?: SentryTypes.SeverityLevel;
      category?: string;
    }
  ): Promise<void> {
    // Track in metrics
    this.trackErrorMetrics((context?.category || 'unknown') as ErrorCategory);

    // Send to Sentry if available
    if (this.sentryManager.isInitialized()) {
      const Sentry = await this.sentryManager.loadSentry();
      if (Sentry) {
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
    }

    // Also log to structured logger
    logger.error('Exception captured:', error instanceof Error ? error : undefined, {
      context,
    });
  }

  /**
   * Capture message with context
   */
  public async captureMessage(
    message: string,
    context?: {
      tags?: Record<string, string>;
      extra?: Record<string, unknown>;
      level?: SentryTypes.SeverityLevel;
      category?: string;
    }
  ): Promise<void> {
    const sanitizedMessage = this.sanitizePHI(message);

    // Send to Sentry if available
    if (this.sentryManager.isInitialized()) {
      const Sentry = await this.sentryManager.loadSentry();
      if (Sentry) {
        if (context?.tags) {
          Sentry.setTags(context.tags);
        }

        if (context?.extra) {
          Sentry.setExtras(context.extra);
        }

        Sentry.captureMessage(sanitizedMessage, context?.level || 'info');
      }
    }

    // Also log to structured logger
    const logMethod = context?.level === 'error' ? 'error' :
                     context?.level === 'warning' ? 'warn' : 'info';
    const logData = { ...context };
    delete logData?.level; // Remove level as it's not needed for logger

    if (logMethod === 'error') {
      logger.error(sanitizedMessage, undefined, logData);
    } else if (logMethod === 'warn') {
      logger.warn(sanitizedMessage, logData);
    } else {
      logger.info(sanitizedMessage, logData);
    }
  }

  /**
   * Capture error with enhanced context
   */
  public captureError(
    error: Error | string,
    options: {
      level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
      category?: ErrorCategory;
      context?: Partial<ErrorContext>;
      fingerprint?: string[];
    } = {}
  ): void {
    const errorMessage = error instanceof Error ? error.message : error;
    const category = this.categorizeError(error, options.category);

    // Track in metrics
    this.trackErrorMetrics(category);

    // Send to Sentry
    this.captureException(error instanceof Error ? error : new Error(errorMessage), {
      level: options.level || 'error',
      tags: {
        category,
        operation: options.context?.operation || '',
        resource: options.context?.resource || '',
      },
      extra: {
        context: options.context,
        fingerprint: options.fingerprint,
      },
    });
  }

  /**
   * Add breadcrumb for debugging
   */
  public async addBreadcrumb(
    breadcrumb: {
      message: string;
      category?: string;
      level?: SentryTypes.SeverityLevel;
      data?: Record<string, unknown>;
    }
  ): Promise<void> {
    const sanitizedMessage = this.sanitizePHI(breadcrumb.message);

    // Add to Sentry if available
    if (this.sentryManager.isInitialized()) {
      const Sentry = await this.sentryManager.loadSentry();
      if (Sentry) {
        Sentry.addBreadcrumb({
          message: sanitizedMessage,
          category: breadcrumb.category || 'custom',
          level: breadcrumb.level || 'info',
          data: breadcrumb.data,
          timestamp: Date.now() / 1000,
        });
      }
    }

    // Also add to structured logger
    logger.info(`Breadcrumb: ${sanitizedMessage}`, {
      category: breadcrumb.category,
      data: breadcrumb.data,
    });
  }

  /**
   * Set user context (no PHI)
   */
  public async setUserContext(user: {
    id: string;
    role?: string;
    organizationId?: string;
  } | null): Promise<void> {
    // Send to Sentry if available
    if (this.sentryManager.isInitialized()) {
      const Sentry = await this.sentryManager.loadSentry();
      if (Sentry) {
        Sentry.setUser(user ? {
          id: user.id,
          role: user.role,
          organizationId: user.organizationId,
        } : null);
      }
    }

    // Also set in logger context
    if (user) {
      logger.setContext({
        userId: user.id,
        // Note: role and organizationId not supported in LogContext
      });
    } else {
      logger.clearContext();
    }
  }

  /**
   * Categorize error based on type and context
   */
  private categorizeError(error: Error | string, providedCategory?: ErrorCategory): ErrorCategory {
    if (providedCategory) return providedCategory;

    const message = error instanceof Error ? error.message : error;
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('auth') || lowerMessage.includes('token') || lowerMessage.includes('csrf') || lowerMessage.includes('permission')) {
      return 'security';
    }

    if (lowerMessage.includes('audit') || lowerMessage.includes('log')) {
      return 'audit';
    }

    if (lowerMessage.includes('circuit') || lowerMessage.includes('timeout') || lowerMessage.includes('retry')) {
      return 'resilience';
    }

    if (lowerMessage.includes('cache')) {
      return 'cache';
    }

    if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('api')) {
      return 'network';
    }

    if (lowerMessage.includes('validat')) {
      return 'validation';
    }

    return 'unknown';
  }

  /**
   * Track error metrics
   */
  private trackErrorMetrics(category: ErrorCategory): void {
    switch (category) {
      case 'security':
        metricsService.trackSuspiciousActivity('error');
        break;
      case 'audit':
        metricsService.trackAuditEvent(false, 'error');
        break;
      case 'resilience':
        metricsService.trackTimeout('error');
        break;
      case 'cache':
        metricsService.trackCacheInvalidation('error', 'error');
        break;
    }
  }

  /**
   * Sanitize PHI from strings
   */
  private sanitizePHI(text: string): string {
    if (!text) return text;

    return text
      // Remove email addresses
      .replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL_REDACTED]')
      // Remove phone numbers
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REDACTED]')
      // Remove SSN-like patterns
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN_REDACTED]')
      // Remove dates that might be DOB
      .replace(/\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-]\d{4}\b/g, '[DATE_REDACTED]')
      // Remove potential medical record numbers
      .replace(/\bMRN[:\s]*\d+\b/gi, '[MRN_REDACTED]')
      // Remove potential patient IDs
      .replace(/\bpatient[_\s]?id[:\s]*\d+\b/gi, '[PATIENT_ID_REDACTED]');
  }
}