/**
 * ErrorTracker - Centralized error tracking and reporting
 *
 * Integrates with Sentry and other error tracking services
 * with HIPAA-compliant error handling (no PHI in error reports).
 *
 * Features:
 * - Automatic error categorization
 * - Contextual breadcrumbs
 * - User session tracking (anonymized)
 * - Performance monitoring
 * - Release tracking
 */

import { metricsService } from './MetricsService';

export interface ErrorContext {
  user?: {
    id?: string; // Anonymized user ID
    role?: string;
  };
  session?: {
    id: string; // Anonymized session ID
    duration: number;
  };
  operation?: string;
  resource?: string;
  metadata?: Record<string, any>;
}

export interface ErrorTrackerConfig {
  enabled: boolean;
  dsn?: string; // Sentry DSN or other service endpoint
  environment: 'development' | 'staging' | 'production';
  release?: string;
  sampleRate: number; // 0-1
  tracesSampleRate: number; // 0-1
  beforeSend?: (event: ErrorEvent) => ErrorEvent | null;
  denyUrls?: RegExp[];
  allowUrls?: RegExp[];
}

export interface ErrorEvent {
  message: string;
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  timestamp: number;
  category: ErrorCategory;
  exception?: {
    type: string;
    value: string;
    stacktrace?: string;
  };
  context: ErrorContext;
  breadcrumbs: Breadcrumb[];
  fingerprint?: string[];
}

export type ErrorCategory =
  | 'security'
  | 'audit'
  | 'resilience'
  | 'cache'
  | 'network'
  | 'validation'
  | 'business'
  | 'unknown';

export interface Breadcrumb {
  timestamp: number;
  message: string;
  category: string;
  level: 'info' | 'warning' | 'error';
  data?: Record<string, any>;
}

/**
 * ErrorTracker - Track and report errors with context
 */
export class ErrorTracker {
  private static instance: ErrorTracker;
  private config: ErrorTrackerConfig;
  private breadcrumbs: Breadcrumb[] = [];
  private maxBreadcrumbs = 100;
  private context: ErrorContext = {};
  private isInitialized = false;

  // PHI field patterns to sanitize
  private readonly phiPatterns = [
    /name/i,
    /email/i,
    /phone/i,
    /ssn/i,
    /dob/i,
    /date.*birth/i,
    /address/i,
    /student/i,
    /patient/i,
    /medical/i,
    /diagnosis/i,
    /medication/i,
    /health/i,
  ];

  private constructor(config: Partial<ErrorTrackerConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      dsn: config.dsn,
      environment: config.environment ?? 'development',
      release: config.release ?? process.env.NEXT_PUBLIC_APP_VERSION,
      sampleRate: config.sampleRate ?? 1.0,
      tracesSampleRate: config.tracesSampleRate ?? 0.1,
      beforeSend: config.beforeSend,
      denyUrls: config.denyUrls,
      allowUrls: config.allowUrls,
    };
  }

  public static getInstance(config?: Partial<ErrorTrackerConfig>): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker(config);
    }
    return ErrorTracker.instance;
  }

  /**
   * Initialize error tracking
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized || !this.config.enabled) return;

    try {
      // Initialize Sentry if DSN is provided
      if (this.config.dsn && typeof window !== 'undefined') {
        await this.initializeSentry();
      }

      // Set up global error handlers
      this.setupGlobalHandlers();

      this.isInitialized = true;
      this.addBreadcrumb({
        message: 'Error tracker initialized',
        category: 'system',
        level: 'info',
      });
    } catch (error) {
      console.error('Failed to initialize error tracker:', error);
    }
  }

  /**
   * Initialize Sentry integration
   */
  private async initializeSentry(): Promise<void> {
    try {
      // Dynamically import Sentry to avoid bundling if not needed
      const Sentry = await import('@sentry/browser');
      const { BrowserTracing } = await import('@sentry/tracing');

      Sentry.init({
        dsn: this.config.dsn,
        environment: this.config.environment,
        release: this.config.release,
        sampleRate: this.config.sampleRate,
        tracesSampleRate: this.config.tracesSampleRate,
        integrations: [new BrowserTracing()],
        beforeSend: (event, hint) => {
          // Sanitize event to remove PHI
          const sanitized = this.sanitizeEvent(event);

          // Apply custom beforeSend if provided
          if (this.config.beforeSend) {
            return this.config.beforeSend(sanitized as any);
          }

          return sanitized;
        },
        denyUrls: this.config.denyUrls,
        allowUrls: this.config.allowUrls,
      });
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
    }
  }

  /**
   * Set up global error handlers
   */
  private setupGlobalHandlers(): void {
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
   * Set user context (anonymized)
   */
  public setUser(user: { id?: string; role?: string } | null): void {
    if (user) {
      // Anonymize user ID (hash it)
      this.context.user = {
        id: user.id ? this.hashValue(user.id) : undefined,
        role: user.role,
      };
    } else {
      delete this.context.user;
    }

    // Update Sentry context if available
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.setUser(this.context.user);
    }
  }

  /**
   * Set session context
   */
  public setSession(sessionId: string, startTime: number): void {
    this.context.session = {
      id: this.hashValue(sessionId),
      duration: Date.now() - startTime,
    };
  }

  /**
   * Set operation context
   */
  public setOperation(operation: string, resource?: string): void {
    this.context.operation = operation;
    this.context.resource = resource;
  }

  /**
   * Add contextual metadata
   */
  public setMetadata(key: string, value: any): void {
    if (!this.context.metadata) {
      this.context.metadata = {};
    }
    this.context.metadata[key] = this.sanitizeValue(value);
  }

  /**
   * Add breadcrumb for error context
   */
  public addBreadcrumb(breadcrumb: Omit<Breadcrumb, 'timestamp'>): void {
    const fullBreadcrumb: Breadcrumb = {
      ...breadcrumb,
      timestamp: Date.now(),
      data: breadcrumb.data ? this.sanitizeObject(breadcrumb.data) : undefined,
    };

    this.breadcrumbs.push(fullBreadcrumb);

    // Limit breadcrumb buffer size
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }

    // Add to Sentry if available
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.addBreadcrumb(fullBreadcrumb);
    }
  }

  /**
   * Capture an error
   */
  public captureError(
    error: Error | string,
    options: {
      level?: ErrorEvent['level'];
      category?: ErrorCategory;
      context?: Partial<ErrorContext>;
      fingerprint?: string[];
    } = {}
  ): void {
    if (!this.config.enabled) return;

    // Apply sampling
    if (Math.random() > this.config.sampleRate) return;

    const errorMessage = error instanceof Error ? error.message : error;
    const category = this.categorizeError(error, options.category);

    const errorEvent: ErrorEvent = {
      message: errorMessage,
      level: options.level || 'error',
      timestamp: Date.now(),
      category,
      exception:
        error instanceof Error
          ? {
              type: error.name,
              value: error.message,
              stacktrace: error.stack,
            }
          : undefined,
      context: {
        ...this.context,
        ...options.context,
      },
      breadcrumbs: [...this.breadcrumbs],
      fingerprint: options.fingerprint,
    };

    // Sanitize the event
    const sanitizedEvent = this.sanitizeErrorEvent(errorEvent);

    // Track error in metrics
    this.trackErrorMetrics(category);

    // Send to Sentry if available
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        level: sanitizedEvent.level,
        contexts: {
          custom: sanitizedEvent.context,
        },
        fingerprint: sanitizedEvent.fingerprint,
      });
    } else {
      // Fallback to console in development
      if (this.config.environment === 'development') {
        console.error('Error tracked:', sanitizedEvent);
      }
    }

    // Send to custom endpoint if needed
    this.sendToCustomEndpoint(sanitizedEvent);
  }

  /**
   * Capture a message (non-error)
   */
  public captureMessage(
    message: string,
    level: ErrorEvent['level'] = 'info',
    context?: Partial<ErrorContext>
  ): void {
    if (!this.config.enabled) return;

    const event: ErrorEvent = {
      message,
      level,
      timestamp: Date.now(),
      category: 'unknown',
      context: {
        ...this.context,
        ...context,
      },
      breadcrumbs: [...this.breadcrumbs],
    };

    const sanitizedEvent = this.sanitizeErrorEvent(event);

    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureMessage(message, level);
    } else if (this.config.environment === 'development') {
      console.log('Message tracked:', sanitizedEvent);
    }
  }

  /**
   * Categorize error based on type and context
   */
  private categorizeError(error: Error | string, providedCategory?: ErrorCategory): ErrorCategory {
    if (providedCategory) return providedCategory;

    const message = error instanceof Error ? error.message : error;
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes('auth') ||
      lowerMessage.includes('token') ||
      lowerMessage.includes('csrf') ||
      lowerMessage.includes('permission')
    ) {
      return 'security';
    }

    if (lowerMessage.includes('audit') || lowerMessage.includes('log')) {
      return 'audit';
    }

    if (
      lowerMessage.includes('circuit') ||
      lowerMessage.includes('timeout') ||
      lowerMessage.includes('retry')
    ) {
      return 'resilience';
    }

    if (lowerMessage.includes('cache')) {
      return 'cache';
    }

    if (
      lowerMessage.includes('network') ||
      lowerMessage.includes('fetch') ||
      lowerMessage.includes('api')
    ) {
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
   * Sanitize error event to remove PHI
   */
  private sanitizeErrorEvent(event: ErrorEvent): ErrorEvent {
    return {
      ...event,
      message: this.sanitizeString(event.message),
      exception: event.exception
        ? {
            ...event.exception,
            value: this.sanitizeString(event.exception.value),
            stacktrace: event.exception.stacktrace
              ? this.sanitizeString(event.exception.stacktrace)
              : undefined,
          }
        : undefined,
      context: this.sanitizeObject(event.context) as ErrorContext,
      breadcrumbs: event.breadcrumbs.map((b) => ({
        ...b,
        message: this.sanitizeString(b.message),
        data: b.data ? this.sanitizeObject(b.data) : undefined,
      })),
    };
  }

  /**
   * Sanitize Sentry event
   */
  private sanitizeEvent(event: any): any {
    if (!event) return event;

    return {
      ...event,
      message: this.sanitizeString(event.message),
      exception: event.exception
        ? {
            values: event.exception.values?.map((ex: any) => ({
              ...ex,
              value: this.sanitizeString(ex.value),
            })),
          }
        : undefined,
      request: event.request
        ? {
            ...event.request,
            data: this.sanitizeObject(event.request.data),
            query_string: this.sanitizeString(event.request.query_string),
          }
        : undefined,
      user: event.user
        ? {
            id: event.user.id ? this.hashValue(event.user.id) : undefined,
            role: event.user.role,
          }
        : undefined,
      breadcrumbs: event.breadcrumbs?.map((b: any) => ({
        ...b,
        message: this.sanitizeString(b.message),
        data: this.sanitizeObject(b.data),
      })),
    };
  }

  /**
   * Sanitize object to remove PHI fields
   */
  private sanitizeObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeValue(item));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const isPHI = this.phiPatterns.some((pattern) => pattern.test(key));
      sanitized[key] = isPHI ? '[REDACTED]' : this.sanitizeValue(value);
    }
    return sanitized;
  }

  /**
   * Sanitize a single value
   */
  private sanitizeValue(value: any): any {
    if (value === null || value === undefined) return value;

    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }

    if (typeof value === 'object') {
      return this.sanitizeObject(value);
    }

    return value;
  }

  /**
   * Sanitize string to remove potential PHI
   */
  private sanitizeString(str: string): string {
    if (!str) return str;

    // Remove email addresses
    let sanitized = str.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL_REDACTED]');

    // Remove phone numbers
    sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REDACTED]');

    // Remove SSN-like patterns
    sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN_REDACTED]');

    // Remove dates that might be DOB
    sanitized = sanitized.replace(
      /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-]\d{4}\b/g,
      '[DATE_REDACTED]'
    );

    return sanitized;
  }

  /**
   * Hash a value for anonymization
   */
  private hashValue(value: string): string {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Send error to custom endpoint
   */
  private async sendToCustomEndpoint(event: ErrorEvent): Promise<void> {
    // Implement custom error reporting endpoint if needed
    // This could send to an internal logging service
  }

  /**
   * Clear breadcrumbs
   */
  public clearBreadcrumbs(): void {
    this.breadcrumbs = [];
  }

  /**
   * Get current breadcrumbs
   */
  public getBreadcrumbs(): Breadcrumb[] {
    return [...this.breadcrumbs];
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    this.breadcrumbs = [];
    this.context = {};
    this.isInitialized = false;
  }
}

// Export singleton instance
export const errorTracker = ErrorTracker.getInstance();
