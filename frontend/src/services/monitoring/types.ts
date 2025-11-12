/**
 * Monitoring Service Types
 *
 * Centralized type definitions for monitoring functionality
 */

export interface MonitoringConfig {
  sentry?: {
    dsn?: string;
    environment?: string;
    release?: string;
    tracesSampleRate?: number;
    profilesSampleRate?: number;
    replaysSessionSampleRate?: number;
    replaysOnErrorSampleRate?: number;
  };
  errorTracker?: {
    enabled?: boolean;
    sampleRate?: number;
    maxBreadcrumbs?: number;
  };
  metrics?: {
    enabled?: boolean;
    flushInterval?: number;
  };
  healthChecks?: {
    enabled?: boolean;
    interval?: number;
  };
  performance?: {
    enabled?: boolean;
    webVitals?: boolean;
  };
  logging?: {
    level?: 'debug' | 'info' | 'warn' | 'error';
    remote?: boolean;
  };
}

export interface ErrorContext {
  user?: {
    id?: string;
    role?: string;
  };
  session?: {
    id: string;
    duration: number;
  };
  operation?: string;
  resource?: string;
  metadata?: Record<string, unknown>;
}

export interface MonitoringEvent {
  type: 'error' | 'metric' | 'performance' | 'health' | 'log';
  timestamp: number;
  data: unknown;
  context?: ErrorContext;
}

export type ErrorCategory = 'security' | 'audit' | 'resilience' | 'cache' | 'network' | 'validation' | 'business' | 'unknown';