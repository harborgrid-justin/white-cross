/**
 * WF-COMP-362 | vite-env.d.ts - Vite environment type definitions
 * Purpose: TypeScript type definitions for Vite environment variables and import.meta
 * Upstream: Vite | Dependencies: vite/client
 * Downstream: All components and services using environment variables
 * Related: Configuration, API clients, feature flags, monitoring services
 * Exports: Extended ImportMetaEnv and ImportMeta interfaces
 * Key Features: Type safety for environment variables and Vite HMR API
 * Last Updated: 2025-10-26 | File Type: .d.ts
 * Critical Path: Build time type checking → Runtime environment access
 * LLM Context: Vite environment type definitions extending base vite/client types
 */

/// <reference types="vite/client" />

/**
 * Extends Vite's default ImportMetaEnv interface with application-specific environment variables.
 * All custom VITE_* variables must be declared here for TypeScript type safety.
 */
interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_URL: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_APP_VERSION: string

  // Environment & Node Configuration
  readonly VITE_ENV: string
  readonly VITE_NODE_ENV: string

  // Feature Flags - Core Features
  readonly VITE_ENABLE_API_DOCS: string
  readonly VITE_ENABLE_DEBUG_MODE: string
  readonly VITE_ENABLE_MOCK_DATA: string

  // Feature Flags - Healthcare Features
  readonly VITE_ENABLE_ADVANCED_HEALTH_RECORDS: string
  readonly VITE_ENABLE_TELEHEALTH: string
  readonly VITE_ENABLE_MEDICATION_REMINDERS: string
  readonly VITE_ENABLE_HEALTH_ANALYTICS: string

  // Feature Flags - Communication Features
  readonly VITE_ENABLE_EMERGENCY_NOTIFICATIONS: string
  readonly VITE_ENABLE_BULK_COMMUNICATION: string

  // Feature Flags - System Features
  readonly VITE_ENABLE_ACCESS_CONTROL_UI: string
  readonly VITE_ENABLE_INTEGRATIONS: string
  readonly VITE_ENABLE_FHIR_EXPORT: string
  readonly VITE_ENABLE_OFFLINE_MODE: string
  readonly VITE_ENABLE_PWA: string
  readonly VITE_ENABLE_AI_ASSISTANT: string
  readonly VITE_ENABLE_PREDICTIVE_ANALYTICS: string

  // Monitoring & Metrics - General
  readonly VITE_METRICS_ENABLED: string
  readonly VITE_METRICS_SAMPLE_RATE: string
  readonly VITE_PERFORMANCE_MONITORING_ENABLED: string

  // Monitoring - DataDog
  readonly VITE_DATADOG_ENDPOINT: string
  readonly VITE_DATADOG_API_KEY: string

  // Monitoring - New Relic
  readonly VITE_NEWRELIC_ENDPOINT: string
  readonly VITE_NEWRELIC_API_KEY: string

  // Error Tracking - Sentry
  readonly VITE_ERROR_TRACKING_ENABLED: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_ERROR_SAMPLE_RATE: string

  // Logging Configuration
  readonly VITE_LOG_LEVEL: string
  readonly VITE_LOG_REMOTE_ENDPOINT: string
  readonly VITE_LOG_REMOTE_API_KEY: string

  // Health Check Configuration
  readonly VITE_HEALTH_CHECK_ENABLED: string
  readonly VITE_HEALTH_CHECK_INTERVAL: string

  // Vite Built-in Environment Variables
  // These are provided by Vite automatically but explicitly declared for clarity
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
  readonly BASE_URL: string
}

/**
 * Extends ImportMeta interface to include Vite-specific properties.
 * This interface merges with the base ImportMeta from lib.es5.d.ts.
 */
interface ImportMeta {
  readonly env: ImportMetaEnv

  /**
   * Vite Hot Module Replacement API
   * Available in development mode for hot reloading functionality
   * @see https://vitejs.dev/guide/api-hmr.html
   */
  readonly hot?: {
    readonly data: any
    accept(): void
    accept(cb: (mod: any) => void): void
    accept(dep: string, cb: (mod: any) => void): void
    accept(deps: readonly string[], cb: (mods: any[]) => void): void
    dispose(cb: (data: any) => void): void
    decline(): void
    invalidate(): void
    on(event: string, cb: (...args: any[]) => void): void
  }
}