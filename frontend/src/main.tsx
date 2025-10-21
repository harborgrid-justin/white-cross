/**
 * WF-MAIN-149 | main.tsx - Application entry point and React DOM rendering
 * Purpose: application entry point and react dom rendering
 * Upstream: ./App.tsx | Dependencies: react, react-dom/client, ./App.tsx
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: React components/utilities | Key Features: Standard module
 * Last Updated: 2025-10-21 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: application entry point and react dom rendering, part of React frontend architecture
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize monitoring infrastructure
import { initializeMonitoring } from './services/monitoring'

// Initialize monitoring before rendering app
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
