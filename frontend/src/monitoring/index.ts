/**
 * Monitoring Module
 *
 * Comprehensive monitoring, analytics, and observability
 */

// Types
export * from './types';

// PHI Sanitization
export * from './utils/phi-sanitizer';

// Services
export * as Sentry from './sentry';
export * as Performance from './performance';
export * as Analytics from './analytics';
export * as Logger from './logger';
export * as DataDog from './datadog';
export * as HealthCheck from './health-check';

// Hooks
export * from './hooks';

// Components
export * from './components';

/**
 * Initialize all monitoring services
 */
export interface MonitoringInitOptions {
  sentry?: {
    dsn: string;
    environment: string;
    release?: string;
    tracesSampleRate?: number;
    replaysSessionSampleRate?: number;
    replaysOnErrorSampleRate?: number;
  };
  datadog?: {
    applicationId: string;
    clientToken: string;
    site?: string;
    service: string;
    env: string;
    version?: string;
    sessionSampleRate?: number;
    sessionReplaySampleRate?: number;
    enableLogs?: boolean;
  };
  analytics?: {
    userId?: string;
    autoTrack?: boolean;
  };
  logging?: {
    level?: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    enableConsole?: boolean;
    enableRemote?: boolean;
  };
  performance?: {
    enabled?: boolean;
  };
  healthCheck?: {
    enabled?: boolean;
    apiUrl?: string;
  };
}

export function initMonitoring(options: MonitoringInitOptions = {}): void {
  // Initialize Sentry
  if (options.sentry?.dsn) {
    const { initSentry } = require('./sentry');
    initSentry({
      dsn: options.sentry.dsn,
      environment: options.sentry.environment || 'production',
      release: options.sentry.release,
      tracesSampleRate: options.sentry.tracesSampleRate,
      replaysSessionSampleRate: options.sentry.replaysSessionSampleRate,
      replaysOnErrorSampleRate: options.sentry.replaysOnErrorSampleRate,
    });
  }

  // Initialize DataDog
  if (options.datadog?.applicationId && options.datadog?.clientToken) {
    const { initDataDog } = require('./datadog');
    initDataDog({
      applicationId: options.datadog.applicationId,
      clientToken: options.datadog.clientToken,
      site: options.datadog.site,
      service: options.datadog.service,
      env: options.datadog.env,
      version: options.datadog.version,
      sessionSampleRate: options.datadog.sessionSampleRate,
      sessionReplaySampleRate: options.datadog.sessionReplaySampleRate,
      enableLogs: options.datadog.enableLogs,
    });
  }

  // Initialize Analytics
  if (options.analytics !== false) {
    const { initAnalytics } = require('./analytics');
    initAnalytics({
      userId: options.analytics?.userId,
      autoTrack: options.analytics?.autoTrack !== false,
    });
  }

  // Initialize Logger
  if (options.logging !== false) {
    const { initLogger } = require('./logger');
    initLogger({
      level: options.logging?.level || 'info',
      enableConsole: options.logging?.enableConsole !== false,
      enableRemote: options.logging?.enableRemote !== false,
    });
  }

  // Initialize Performance Monitoring
  if (options.performance?.enabled !== false) {
    const { initPerformanceMonitoring } = require('./performance');
    initPerformanceMonitoring();
  }

  // Start Health Monitoring
  if (options.healthCheck?.enabled !== false) {
    const { startHealthMonitoring } = require('./health-check');
    startHealthMonitoring(options.healthCheck?.apiUrl);
  }
}

/**
 * Set user context across all monitoring services
 */
export function setUserContext(user: {
  id: string;
  role: string;
  districtId?: string;
  schoolId?: string;
} | null): void {
  const { setUserContext: setSentryUser } = require('./sentry');
  const { setUser: setDataDogUser } = require('./datadog');
  const { setUserId } = require('./analytics');

  setSentryUser(user);
  setDataDogUser(user);
  setUserId(user?.id || null);
}

/**
 * Clear all user context
 */
export function clearUserContext(): void {
  const { clearContext: clearSentryContext } = require('./sentry');
  const { clearGlobalContext: clearDataDogContext } = require('./datadog');
  const { setUserId } = require('./analytics');

  clearSentryContext();
  clearDataDogContext();
  setUserId(null);
}

export default {
  initMonitoring,
  setUserContext,
  clearUserContext,
};
