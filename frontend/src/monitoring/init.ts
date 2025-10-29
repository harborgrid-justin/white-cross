/**
 * Monitoring Initialization
 *
 * Initialize all monitoring services with production configuration
 */

'use client';

import { initMonitoring, setUserContext as setMonitoringUserContext } from './index';
import { initializeDefaultAlerts } from './alerts';
import { startHealthMonitoring } from './health-check';

let isInitialized = false;

/**
 * Initialize monitoring for the application
 */
export function initializeMonitoring(): void {
  if (isInitialized) {
    console.warn('Monitoring already initialized');
    return;
  }

  // Only initialize in browser
  if (typeof window === 'undefined') return;

  try {
    // Initialize core monitoring services
    initMonitoring({
      sentry: {
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
        environment: process.env.NEXT_PUBLIC_ENV || 'production',
        release: process.env.NEXT_PUBLIC_VERSION,
        tracesSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || '0.1'),
        replaysSessionSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE || '0.01'),
        replaysOnErrorSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ERROR_SAMPLE_RATE || '1.0'),
      },
      datadog: {
        applicationId: process.env.NEXT_PUBLIC_DATADOG_APP_ID || '',
        clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || '',
        site: process.env.NEXT_PUBLIC_DATADOG_SITE || 'datadoghq.com',
        service: 'white-cross-frontend',
        env: process.env.NEXT_PUBLIC_ENV || 'production',
        version: process.env.NEXT_PUBLIC_VERSION,
        sessionSampleRate: parseFloat(process.env.NEXT_PUBLIC_DATADOG_SESSION_SAMPLE_RATE || '100'),
        sessionReplaySampleRate: parseFloat(process.env.NEXT_PUBLIC_DATADOG_REPLAY_SAMPLE_RATE || '20'),
        enableLogs: process.env.NEXT_PUBLIC_DATADOG_ENABLE_LOGS === 'true',
      },
      analytics: {
        autoTrack: true,
      },
      logging: {
        level: (process.env.NEXT_PUBLIC_LOG_LEVEL as any) || 'info',
        enableConsole: process.env.NODE_ENV === 'development',
        enableRemote: process.env.NODE_ENV === 'production',
      },
      performance: {
        enabled: true,
      },
      healthCheck: {
        enabled: true,
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
      },
    });

    // Initialize alert system
    initializeDefaultAlerts();

    // Start health monitoring
    startHealthMonitoring(process.env.NEXT_PUBLIC_API_URL);

    isInitialized = true;

    console.log('Monitoring initialized successfully');
  } catch (error) {
    console.error('Failed to initialize monitoring:', error);
  }
}

/**
 * Set user context for monitoring
 */
export function setUserContext(user: {
  id: string;
  role: string;
  districtId?: string;
  schoolId?: string;
} | null): void {
  if (!isInitialized) {
    console.warn('Monitoring not initialized yet');
    return;
  }

  setMonitoringUserContext(user);
}

/**
 * Auto-initialize on import (client-side only)
 */
if (typeof window !== 'undefined') {
  // Initialize after a short delay to not block initial render
  setTimeout(() => {
    initializeMonitoring();
  }, 100);
}

export default {
  initializeMonitoring,
  setUserContext,
};
