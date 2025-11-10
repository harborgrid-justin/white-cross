/**
 * @fileoverview Sentry Error Tracking Service
 * @module infrastructure/monitoring/sentry
 * @description Production-ready Sentry integration for error tracking and monitoring
 *
 * Features:
 * - Automatic error capture and reporting
 * - User context tracking
 * - Environment-based configuration
 * - Performance monitoring
 * - Release tracking
 * - Custom error metadata
 * - HIPAA-compliant (no PHI in error reports)
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { ConfigService } from '@nestjs/config';

/**
 * Sentry Service
 *
 * @class SentryService
 * @description Manages Sentry error tracking integration
 *
 * @example
 * // In a service
 * constructor(private readonly sentry: SentryService) {}
 *
 * try {
 *   // risky operation
 * } catch (error) {
 *   this.sentry.captureException(error, { userId: '123' });
 * }
 */
@Injectable()
export class SentryService implements OnModuleInit {
  private readonly logger = new Logger(SentryService.name);
  private isInitialized = false;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    this.initialize();
  }

  /**
   * Initialize Sentry SDK
   */
  private initialize(): void {
    const dsn = this.configService.get<string>('SENTRY_DSN');
    const environment = this.configService.get<string>(
      'NODE_ENV',
      'development',
    );
    const release = this.configService.get<string>('APP_VERSION', '1.0.0');

    // Only initialize if DSN is configured and not in test environment
    if (!dsn || environment === 'test') {
      this.logger.warn(
        'Sentry not initialized: DSN not configured or test environment',
      );
      return;
    }

    try {
      Sentry.init({
        dsn,
        environment,
        release: `white-cross-api@${release}`,
        tracesSampleRate: environment === 'production' ? 0.1 : 1.0, // 10% sampling in prod, 100% in dev
        profilesSampleRate: environment === 'production' ? 0.1 : 1.0,
        integrations: [
          // Express integration for request tracking
          Sentry.httpIntegration(),
        ],
        beforeSend: (event, hint) => {
          // HIPAA Compliance: Remove any potential PHI from error reports
          return this.sanitizeEvent(event) as Sentry.ErrorEvent | null;
        },
        beforeBreadcrumb: (breadcrumb) => {
          // HIPAA Compliance: Sanitize breadcrumbs
          return this.sanitizeBreadcrumb(breadcrumb);
        },
        // Don't send default PII
        sendDefaultPii: false,
        // Error filtering
        ignoreErrors: [
          // Ignore client-side validation errors
          'ValidationError',
          // Ignore expected business logic errors
          'UnauthorizedException',
          'NotFoundException',
        ],
      });

      this.isInitialized = true;
      this.logger.log(`Sentry initialized for environment: ${environment}`);
    } catch (error) {
      this.logger.error('Failed to initialize Sentry', error);
    }
  }

  /**
   * Capture an exception in Sentry
   *
   * @param exception - Error or exception to capture
   * @param context - Additional context (userId, tags, etc.)
   */
  captureException(
    exception: Error | string,
    context?: {
      userId?: string;
      organizationId?: string;
      tags?: Record<string, string>;
      extra?: Record<string, any>;
      level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
    },
  ): void {
    if (!this.isInitialized) return;

    try {
      Sentry.withScope((scope) => {
        // Set user context (non-PHI identifiers only)
        if (context?.userId) {
          scope.setUser({
            id: context.userId,
            // Do NOT include: name, email, ip_address, etc. (potential PHI)
          });
        }

        // Set organization context
        if (context?.organizationId) {
          scope.setTag('organization_id', context.organizationId);
        }

        // Set custom tags
        if (context?.tags) {
          Object.entries(context.tags).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }

        // Set extra context (sanitized)
        if (context?.extra) {
          Object.entries(context.extra).forEach(([key, value]) => {
            scope.setExtra(key, this.sanitizeValue(value));
          });
        }

        // Set level
        if (context?.level) {
          scope.setLevel(context.level);
        }

        // Capture the exception
        if (typeof exception === 'string') {
          Sentry.captureMessage(exception, context?.level || 'error');
        } else {
          Sentry.captureException(exception);
        }
      });
    } catch (error) {
      this.logger.error('Failed to capture exception in Sentry', error);
    }
  }

  /**
   * Capture a message in Sentry
   *
   * @param message - Message to capture
   * @param level - Severity level
   * @param context - Additional context
   */
  captureMessage(
    message: string,
    level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
    context?: {
      userId?: string;
      tags?: Record<string, string>;
      extra?: Record<string, any>;
    },
  ): void {
    if (!this.isInitialized) return;

    try {
      Sentry.withScope((scope) => {
        if (context?.userId) {
          scope.setUser({ id: context.userId });
        }

        if (context?.tags) {
          Object.entries(context.tags).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }

        if (context?.extra) {
          Object.entries(context.extra).forEach(([key, value]) => {
            scope.setExtra(key, this.sanitizeValue(value));
          });
        }

        Sentry.captureMessage(message, level);
      });
    } catch (error) {
      this.logger.error('Failed to capture message in Sentry', error);
    }
  }

  /**
   * Add breadcrumb for debugging context
   *
   * @param breadcrumb - Breadcrumb to add
   */
  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
    data?: Record<string, any>;
  }): void {
    if (!this.isInitialized) return;

    try {
      Sentry.addBreadcrumb({
        message: breadcrumb.message,
        category: breadcrumb.category || 'custom',
        level: breadcrumb.level || 'info',
        data: breadcrumb.data ? this.sanitizeValue(breadcrumb.data) : undefined,
        timestamp: Date.now() / 1000,
      });
    } catch (error) {
      this.logger.error('Failed to add breadcrumb to Sentry', error);
    }
  }

  /**
   * Set user context for subsequent error reports
   *
   * @param userId - Non-PHI user identifier
   * @param organizationId - Organization identifier
   */
  setUser(userId: string | null, organizationId?: string): void {
    if (!this.isInitialized) return;

    try {
      if (userId) {
        Sentry.setUser({
          id: userId,
          // Do NOT include PHI fields
        });

        if (organizationId) {
          Sentry.setTag('organization_id', organizationId);
        }
      } else {
        Sentry.setUser(null);
      }
    } catch (error) {
      this.logger.error('Failed to set user in Sentry', error);
    }
  }

  /**
   * Clear user context
   */
  clearUser(): void {
    if (!this.isInitialized) return;
    Sentry.setUser(null);
  }

  /**
   * Sanitize Sentry event to remove PHI
   */
  private sanitizeEvent(event: Sentry.Event): Sentry.Event | null {
    // Remove potentially sensitive data from request
    if (event.request) {
      // Remove cookies (may contain session tokens)
      delete event.request.cookies;

      // Sanitize headers
      if (event.request.headers) {
        const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
        sensitiveHeaders.forEach((header) => {
          if (event.request?.headers?.[header]) {
            event.request.headers[header] = '[REDACTED]';
          }
        });
      }

      // Sanitize query parameters
      if (event.request.query_string) {
        event.request.query_string = this.sanitizeQueryString(
          event.request.query_string,
        );
      }

      // Sanitize request body
      if (event.request.data) {
        event.request.data = this.sanitizeValue(event.request.data);
      }
    }

    // Sanitize breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((breadcrumb) =>
        this.sanitizeBreadcrumb(breadcrumb),
      );
    }

    // Sanitize extra data
    if (event.extra) {
      event.extra = this.sanitizeValue(event.extra) as Record<string, any>;
    }

    return event;
  }

  /**
   * Sanitize breadcrumb to remove PHI
   */
  private sanitizeBreadcrumb(breadcrumb: Sentry.Breadcrumb): Sentry.Breadcrumb {
    if (breadcrumb.data) {
      breadcrumb.data = this.sanitizeValue(breadcrumb.data) as Record<
        string,
        any
      >;
    }
    return breadcrumb;
  }

  /**
   * Sanitize query string to remove sensitive parameters
   */
  private sanitizeQueryString(
    queryString: string | Record<string, string> | [string, string][],
  ): string {
    if (typeof queryString === 'string') {
      const sensitiveParams = ['token', 'password', 'ssn', 'dob', 'mrn'];
      let sanitized = queryString;

      sensitiveParams.forEach((param) => {
        const regex = new RegExp(`(${param}=)[^&]*`, 'gi');
        sanitized = sanitized.replace(regex, `$1[REDACTED]`);
      });

      return sanitized;
    } else if (Array.isArray(queryString)) {
      // Handle array format
      return queryString
        .map(([key, value]) => {
          const sensitiveParams = ['token', 'password', 'ssn', 'dob', 'mrn'];
          if (sensitiveParams.includes(key.toLowerCase())) {
            return `${key}=[REDACTED]`;
          }
          return `${key}=${value}`;
        })
        .join('&');
    } else {
      // Handle object format
      const params = Object.entries(queryString);
      return params
        .map(([key, value]) => {
          const sensitiveParams = ['token', 'password', 'ssn', 'dob', 'mrn'];
          if (sensitiveParams.includes(key.toLowerCase())) {
            return `${key}=[REDACTED]`;
          }
          return `${key}=${value}`;
        })
        .join('&');
    }
  }

  /**
   * Recursively sanitize values to remove PHI
   */
  private sanitizeValue(value: unknown): unknown {
    if (value === null || value === undefined) return value;

    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.sanitizeValue(item));
    }

    if (typeof value === 'object') {
      const sanitized: Record<string, unknown> = {};
      const sensitiveFields = [
        'password',
        'ssn',
        'socialSecurityNumber',
        'dateOfBirth',
        'dob',
        'medicalRecordNumber',
        'mrn',
        'token',
        'accessToken',
        'refreshToken',
        'email',
        'phone',
        'address',
        'firstName',
        'lastName',
        'name',
      ];

      for (const [key, val] of Object.entries(value)) {
        const keyLower = key.toLowerCase();
        if (sensitiveFields.some((field) => keyLower.includes(field))) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeValue(val);
        }
      }

      return sanitized;
    }

    return value;
  }

  /**
   * Sanitize string to remove potential PHI patterns
   */
  private sanitizeString(str: string): string {
    let sanitized = str;

    // Redact email addresses
    sanitized = sanitized.replace(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      '[EMAIL]',
    );

    // Redact phone numbers
    sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');

    // Redact SSN patterns
    sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');

    // Redact potential MRN/ID patterns (6-12 alphanumeric)
    sanitized = sanitized.replace(/\b[A-Z0-9]{8,12}\b/g, '[ID]');

    return sanitized;
  }

  /**
   * Flush pending events (useful before shutdown)
   *
   * @param timeout - Timeout in milliseconds (default 2000)
   * @returns Promise that resolves when flush is complete
   */
  async flush(timeout = 2000): Promise<boolean> {
    if (!this.isInitialized) return true;

    try {
      return await Sentry.close(timeout);
    } catch (error) {
      this.logger.error('Failed to flush Sentry', error);
      return false;
    }
  }
}
