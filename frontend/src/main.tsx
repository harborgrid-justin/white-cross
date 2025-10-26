/**
 * WF-MAIN-149 | main.tsx - Application Entry Point and React DOM Rendering
 *
 * This is the primary entry point for the White Cross healthcare platform frontend.
 * It initializes the monitoring infrastructure before rendering the React application,
 * ensuring all telemetry, error tracking, and performance monitoring are active from
 * the moment the application starts.
 *
 * @module main
 *
 * @remarks
 * **Initialization Sequence**:
 * 1. Initialize monitoring services (Sentry, DataDog, New Relic)
 * 2. Configure error tracking and performance monitoring
 * 3. Render React application with StrictMode
 *
 * **Monitoring Services**:
 * - Error Tracking: Sentry for exception monitoring
 * - Metrics: DataDog and New Relic for application metrics
 * - Performance: Web Vitals tracking for user experience monitoring
 * - Health Checks: Periodic backend health verification
 *
 * **HIPAA Compliance**: All monitoring services are configured to exclude PHI
 * data from telemetry. Error messages and logs are sanitized before transmission.
 *
 * Critical Path: Page load → Monitoring init → React render → App bootstrap → User interaction
 *
 * @see {@link App.tsx} for the root React component
 * @see {@link services/monitoring} for monitoring configuration
 * @see {@link bootstrap.ts} for application service initialization
 *
 * Last Updated: 2025-10-26 | File Type: .tsx
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize monitoring infrastructure
import { initializeMonitoring } from './services/monitoring'

/**
 * Initializes the application by setting up monitoring infrastructure and
 * rendering the React application to the DOM.
 *
 * This function is called immediately upon module load and handles:
 * 1. Monitoring service initialization with environment-specific configuration
 * 2. Error handling for monitoring failures (non-blocking)
 * 3. React application rendering with StrictMode enabled
 *
 * @async
 * @returns {Promise<void>} Resolves when the application is rendered
 *
 * @remarks
 * **Monitoring Configuration**:
 * The function configures multiple monitoring backends based on environment variables:
 * - DataDog: Application metrics and distributed tracing
 * - New Relic: Application performance monitoring
 * - Sentry: Error tracking and exception monitoring
 * - Custom Logger: Structured logging with remote endpoint support
 *
 * **Resilience**: If monitoring initialization fails, the application continues
 * to load normally. A warning is logged but the failure is non-blocking to ensure
 * the healthcare application remains available even if monitoring is degraded.
 *
 * **StrictMode**: React StrictMode is enabled to help identify potential problems
 * in the application during development, including unsafe lifecycle methods and
 * deprecated API usage.
 *
 * @throws {Error} Monitoring initialization errors are caught and logged, but
 * do not prevent application startup.
 *
 * @example
 * ```typescript
 * // This function is invoked automatically at the end of this file
 * await startApp();
 * // Application is now running
 * ```
 */
const startApp = async () => {
  try {
    // Initialize monitoring with environment configuration
    await initializeMonitoring({
      metrics: {
        enabled: import.meta.env.VITE_METRICS_ENABLED !== 'false',
        backends: [
          {
            type: 'datadog',
            endpoint: import.meta.env.VITE_DATADOG_ENDPOINT,
            apiKey: import.meta.env.VITE_DATADOG_API_KEY,
            enabled: !!import.meta.env.VITE_DATADOG_API_KEY,
          },
          {
            type: 'newrelic',
            endpoint: import.meta.env.VITE_NEWRELIC_ENDPOINT,
            apiKey: import.meta.env.VITE_NEWRELIC_API_KEY,
            enabled: !!import.meta.env.VITE_NEWRELIC_API_KEY,
          },
        ].filter(backend => backend.enabled),
        samplingRate: parseFloat(import.meta.env.VITE_METRICS_SAMPLE_RATE || '1.0'),
      },
      errors: {
        enabled: import.meta.env.VITE_ERROR_TRACKING_ENABLED !== 'false',
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        release: import.meta.env.VITE_APP_VERSION,
        sampleRate: parseFloat(import.meta.env.VITE_ERROR_SAMPLE_RATE || '1.0'),
      },
      logger: {
        enabled: true,
        level: (import.meta.env.VITE_LOG_LEVEL || 'INFO') as any,
        enableConsole: import.meta.env.MODE === 'development',
        enableRemote: import.meta.env.MODE === 'production',
        remoteEndpoint: import.meta.env.VITE_LOG_REMOTE_ENDPOINT,
        remoteApiKey: import.meta.env.VITE_LOG_REMOTE_API_KEY,
      },
      health: {
        enabled: import.meta.env.VITE_HEALTH_CHECK_ENABLED !== 'false',
        checkInterval: parseInt(import.meta.env.VITE_HEALTH_CHECK_INTERVAL || '30000'),
      },
      performance: {
        enabled: import.meta.env.VITE_PERFORMANCE_MONITORING_ENABLED !== 'false',
        trackWebVitals: true,
        trackResources: import.meta.env.MODE === 'production',
        trackLongTasks: true,
        trackMemory: true,
      },
    })

    console.log('✅ Monitoring infrastructure initialized')
  } catch (error) {
    console.error('⚠️ Failed to initialize monitoring:', error)
    // Continue with app initialization even if monitoring fails
  }

  // Render React app
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

// Start the application
startApp()
