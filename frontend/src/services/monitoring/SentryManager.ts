/**
 * Sentry Manager
 *
 * Handles Sentry SDK lazy loading and initialization
 */

import type * as SentryTypes from '@sentry/nextjs';
import type { MonitoringConfig } from './types';

export class SentryManager {
  private config: MonitoringConfig['sentry'];
  private sentryInitialized = false;
  private sentryInitPromise: Promise<typeof SentryTypes> | null = null;

  constructor(config: MonitoringConfig['sentry']) {
    this.config = config;
  }

  private get isProduction(): boolean {
    return this.config?.environment === 'production';
  }

  /**
   * Lazy load and initialize Sentry SDK
   */
  public async initialize(): Promise<void> {
    if (this.sentryInitialized) return;

    // Skip in development to save bundle size
    if (!this.isProduction) {
      return;
    }

    if (!this.config?.dsn) {
      console.warn('Sentry DSN not configured, error tracking disabled');
      return;
    }

    // Return existing promise if already loading
    if (this.sentryInitPromise) {
      await this.sentryInitPromise;
      return;
    }

    // Load Sentry dynamically
    this.sentryInitPromise = import('@sentry/nextjs');
    const Sentry = await this.sentryInitPromise;

    Sentry.init({
      dsn: this.config.dsn,
      environment: this.config.environment,
      release: this.config.release,

      // Performance Monitoring
      tracesSampleRate: this.config.tracesSampleRate,
      profilesSampleRate: this.config.profilesSampleRate,

      // Session Replay
      replaysSessionSampleRate: this.config.replaysSessionSampleRate,
      replaysOnErrorSampleRate: this.config.replaysOnErrorSampleRate,

      // Error filtering
      beforeSend: (event: unknown) => this.sanitizeSentryEvent(event),

      // Additional configuration
      integrations: [
        Sentry.browserTracingIntegration({
          tracePropagationTargets: ['localhost', /^https:\/\/.*\.whitecross\.com/],
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
    });

    this.sentryInitialized = true;
  }

  /**
   * Check if Sentry is initialized
   */
  public isInitialized(): boolean {
    return this.sentryInitialized;
  }

  /**
   * Lazy load Sentry SDK
   */
  public async loadSentry(): Promise<typeof SentryTypes | null> {
    if (!this.isProduction) return null;
    if (this.sentryInitPromise) return await this.sentryInitPromise;

    this.sentryInitPromise = import('@sentry/nextjs');
    return await this.sentryInitPromise;
  }

  /**
   * Sanitize PHI from Sentry events
   */
  private sanitizeSentryEvent(event: unknown): unknown {
    if (!event || typeof event !== 'object') return event;

    const evt = event as Record<string, unknown>;
    return {
      ...evt,
      message: this.sanitizePHI(String(evt.message || '')),
      exception: evt.exception && typeof evt.exception === 'object'
        ? {
            ...(evt.exception as Record<string, unknown>),
            values: (evt.exception as Record<string, unknown>).values && Array.isArray((evt.exception as Record<string, unknown>).values)
              ? ((evt.exception as Record<string, unknown>).values as unknown[]).map((ex: unknown) =>
                  typeof ex === 'object' ? {
                    ...(ex as Record<string, unknown>),
                    value: this.sanitizePHI(String((ex as Record<string, unknown>).value || '')),
                  } : ex
                )
              : undefined,
          }
        : undefined,
      request: evt.request && typeof evt.request === 'object'
        ? {
            ...(evt.request as Record<string, unknown>),
            data: this.sanitizeObject((evt.request as Record<string, unknown>).data),
            query_string: this.sanitizePHI(String((evt.request as Record<string, unknown>).query_string || '')),
          }
        : undefined,
      user: evt.user && typeof evt.user === 'object'
        ? {
            id: (evt.user as Record<string, unknown>).id ? this.hashValue(String((evt.user as Record<string, unknown>).id)) : undefined,
            role: (evt.user as Record<string, unknown>).role,
          }
        : undefined,
      breadcrumbs: Array.isArray(evt.breadcrumbs)
        ? evt.breadcrumbs.map((b: unknown) =>
            typeof b === 'object' ? ({
              ...(b as Record<string, unknown>),
              message: this.sanitizePHI(String((b as Record<string, unknown>).message || '')),
              data: this.sanitizeObject((b as Record<string, unknown>).data),
            }) : b
          )
        : undefined,
    };
  }

  /**
   * Sanitize object to remove PHI fields
   */
  private sanitizeObject(obj: unknown): unknown {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeValue(item));
    }

    const sanitized: Record<string, unknown> = {};
    const phiPatterns = [/name/i, /email/i, /phone/i, /ssn/i, /dob/i, /date.*birth/i, /address/i, /student/i, /patient/i, /medical/i, /diagnosis/i, /medication/i, /health/i];

    for (const [key, value] of Object.entries(obj)) {
      const isPHI = phiPatterns.some((pattern) => pattern.test(key));
      sanitized[key] = isPHI ? '[REDACTED]' : this.sanitizeValue(value);
    }
    return sanitized;
  }

  /**
   * Sanitize a single value
   */
  private sanitizeValue(value: unknown): unknown {
    if (value === null || value === undefined) return value;

    if (typeof value === 'string') {
      return this.sanitizePHI(value);
    }

    if (typeof value === 'object') {
      return this.sanitizeObject(value);
    }

    return value;
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
}