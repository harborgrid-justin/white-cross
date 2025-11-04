/**
 * WF-COMP-256 | ApiMonitoring.ts - API Monitoring Core Module
 * Purpose: Provides request/response monitoring, performance metrics, and error tracking
 * Upstream: ./ApiClient | Dependencies: axios, ./ApiClient
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: ApiMonitoring.types, ApiMonitoring.metrics, ApiMonitoring.logging, ApiMonitoring.utils
 * Exports: ApiMonitoring class, singleton instance | Key Features: Request/response interceptors
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: API call → Request interceptor → Response interceptor → Metrics recording
 * LLM Context: API monitoring with metrics collection, part of React frontend architecture
 */

/**
 * API Monitoring and Performance Tracking
 * Provides request/response monitoring, performance metrics, and error tracking
 *
 * This module has been refactored into smaller, focused modules:
 * - ApiMonitoring.types.ts: Type definitions
 * - ApiMonitoring.utils.ts: Utility functions (sanitization, formatting)
 * - ApiMonitoring.logging.ts: Logging functions
 * - ApiMonitoring.metrics.ts: Metrics tracking and aggregation
 */

import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestInterceptor, ResponseInterceptor } from './ApiClient';

// Import from extracted modules
import type { ApiMetrics, PerformanceStats, MonitoringConfig } from './ApiMonitoring.types';
import { MetricsTracker } from './ApiMonitoring.metrics';
import { logRequest, logResponse, logError, logSlowRequest } from './ApiMonitoring.logging';
import { sanitizeUrl, generateRequestId } from './ApiMonitoring.utils';

// Re-export types for backward compatibility
export type { ApiMetrics, PerformanceStats, MonitoringConfig } from './ApiMonitoring.types';

// ==========================================
// API MONITORING CLASS
// ==========================================

/**
 * API Monitoring Service
 *
 * Provides comprehensive monitoring capabilities for HTTP API requests:
 * - Request/response interceptors for automatic tracking
 * - Performance metrics collection and aggregation
 * - Error tracking and slow request detection
 * - Configurable logging and callbacks
 * - Metrics export for analysis
 *
 * @example
 * ```typescript
 * // Create monitoring instance
 * const monitoring = new ApiMonitoring({
 *   enabled: true,
 *   logRequests: true,
 *   slowRequestThreshold: 3000,
 *   onSlowRequest: (metrics) => {
 *     console.warn('Slow request detected:', metrics);
 *   }
 * });
 *
 * // Attach to API client
 * apiClient.addRequestInterceptor(monitoring.createRequestInterceptor());
 * apiClient.addResponseInterceptor(monitoring.createResponseInterceptor());
 *
 * // Get performance stats
 * const stats = monitoring.getPerformanceStats();
 * console.log(`Average response time: ${stats.averageResponseTime}ms`);
 * ```
 */
export class ApiMonitoring {
  private static instance: ApiMonitoring | null = null;
  private config: MonitoringConfig;
  private metricsTracker: MetricsTracker;

  constructor(config: Partial<MonitoringConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      logRequests: config.logRequests ?? process.env.NODE_ENV === 'development',
      logResponses: config.logResponses ?? process.env.NODE_ENV === 'development',
      logErrors: config.logErrors ?? true,
      trackPerformance: config.trackPerformance ?? true,
      slowRequestThreshold: config.slowRequestThreshold ?? 3000, // 3 seconds
      onSlowRequest: config.onSlowRequest,
      onError: config.onError,
    };

    this.metricsTracker = new MetricsTracker(this.config);
  }

  // ==========================================
  // SINGLETON PATTERN
  // ==========================================

  /**
   * Get singleton instance (for backward compatibility with ServiceRegistry)
   * @returns ApiMonitoring singleton instance
   */
  public static getInstance(): ApiMonitoring {
    if (!ApiMonitoring.instance) {
      ApiMonitoring.instance = new ApiMonitoring();
    }
    return ApiMonitoring.instance;
  }

  /**
   * Set singleton instance (for testing or custom configuration)
   * @param instance - ApiMonitoring instance to use as singleton
   */
  public static setInstance(instance: ApiMonitoring): void {
    ApiMonitoring.instance = instance;
  }

  // ==========================================
  // INTERCEPTOR CREATION
  // ==========================================

  /**
   * Create request interceptor for monitoring
   * Tracks request start time and logs request details
   * @returns RequestInterceptor for Axios
   */
  public createRequestInterceptor(): RequestInterceptor {
    return {
      onFulfilled: (config: AxiosRequestConfig) => {
        if (!this.config.enabled) return config;

        const requestId = config.headers?.['X-Request-ID'] as string || generateRequestId();
        const startTime = Date.now();

        // Store request start time and basic info
        const metrics: ApiMetrics = {
          requestId,
          method: config.method?.toUpperCase() || 'UNKNOWN',
          url: sanitizeUrl(config.url || ''),
          duration: 0,
          timestamp: startTime,
          success: false,
        };

        // Attach metadata to config for response interceptor
        (config as any).__monitoringStartTime = startTime;
        (config as any).__monitoringRequestId = requestId;

        // Log request
        if (this.config.logRequests) {
          logRequest(config);
        }

        return config;
      },
      onRejected: (error: any) => {
        if (this.config.enabled && this.config.logErrors) {
          console.error('[API Monitoring] Request Error:', error);
        }
        return Promise.reject(error);
      },
    };
  }

  /**
   * Create response interceptor for monitoring
   * Records metrics, logs responses/errors, and detects slow requests
   * @returns ResponseInterceptor for Axios
   */
  public createResponseInterceptor(): ResponseInterceptor {
    return {
      onFulfilled: (response: AxiosResponse) => {
        if (!this.config.enabled) return response;

        const config = response.config as any;
        const requestId = config.__monitoringRequestId;
        const startTime = config.__monitoringStartTime;

        if (requestId && startTime) {
          const endTime = Date.now();
          const duration = endTime - startTime;

          const metrics: ApiMetrics = {
            requestId,
            method: config.method?.toUpperCase() || 'UNKNOWN',
            url: sanitizeUrl(config.url || ''),
            status: response.status,
            duration,
            timestamp: startTime,
            success: true,
            size: this.calculateResponseSize(response),
          };

          this.metricsTracker.recordMetrics(metrics);

          // Log response
          if (this.config.logResponses) {
            logResponse(response, duration);
          }

          // Check for slow requests
          if (duration > this.config.slowRequestThreshold) {
            logSlowRequest(metrics, this.config.onSlowRequest);
          }
        }

        return response;
      },
      onRejected: (error: any) => {
        if (!this.config.enabled) return Promise.reject(error);

        const config = error.config as any;
        const requestId = config?.__monitoringRequestId;
        const startTime = config?.__monitoringStartTime;

        if (requestId && startTime) {
          const endTime = Date.now();
          const duration = endTime - startTime;

          const metrics: ApiMetrics = {
            requestId,
            method: config.method?.toUpperCase() || 'UNKNOWN',
            url: sanitizeUrl(config.url || ''),
            status: error.response?.status,
            duration,
            timestamp: startTime,
            success: false,
            error: error.message || 'Unknown error',
          };

          this.metricsTracker.recordMetrics(metrics);

          // Log error
          if (this.config.logErrors) {
            logError(error, duration);
          }

          // Handle error callback
          if (this.config.onError) {
            this.config.onError(metrics);
          }
        }

        return Promise.reject(error);
      },
    };
  }

  // ==========================================
  // METRICS ACCESS METHODS
  // ==========================================

  /**
   * Get aggregated performance statistics
   * @returns Performance statistics including success rate, response times, error rate
   */
  public getPerformanceStats(): PerformanceStats {
    return this.metricsTracker.getPerformanceStats();
  }

  /**
   * Get metrics for a specific endpoint
   * @param endpoint - Endpoint URL or partial URL to filter by
   * @returns Array of metrics matching the endpoint
   */
  public getEndpointMetrics(endpoint: string): ApiMetrics[] {
    return this.metricsTracker.getEndpointMetrics(endpoint);
  }

  /**
   * Get recent errors
   * @param limit - Maximum number of errors to return (default: 10)
   * @returns Array of error metrics
   */
  public getRecentErrors(limit: number = 10): ApiMetrics[] {
    return this.metricsTracker.getRecentErrors(limit);
  }

  /**
   * Get slow requests
   * @param limit - Maximum number of slow requests to return (default: 10)
   * @returns Array of slow request metrics
   */
  public getSlowRequests(limit: number = 10): ApiMetrics[] {
    return this.metricsTracker.getSlowRequests(limit);
  }

  /**
   * Clear metrics history
   */
  public clearHistory(): void {
    this.metricsTracker.clearHistory();
  }

  /**
   * Export metrics to JSON
   * @returns JSON string containing stats, history, and timestamp
   */
  public exportMetrics(): string {
    return this.metricsTracker.exportMetrics();
  }

  // ==========================================
  // CONFIGURATION METHODS
  // ==========================================

  /**
   * Update monitoring configuration
   * @param config - Partial monitoring configuration to update
   */
  public updateConfig(config: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...config };
    this.metricsTracker.updateConfig(this.config);
  }

  /**
   * Get current configuration
   * @returns Current monitoring configuration
   */
  public getConfig(): MonitoringConfig {
    return { ...this.config };
  }

  // ==========================================
  // PRIVATE HELPER METHODS
  // ==========================================

  /**
   * Calculate response size from Axios response
   * @param response - Axios response object
   * @returns Response size in bytes
   */
  private calculateResponseSize(response: AxiosResponse): number {
    try {
      const contentLength = response.headers['content-length'];
      if (contentLength) {
        return parseInt(contentLength, 10);
      }

      // Estimate size from data
      const data = JSON.stringify(response.data);
      return new Blob([data]).size;
    } catch {
      return 0;
    }
  }
}

// ==========================================
// SINGLETON INSTANCE
// ==========================================

/**
 * Default singleton instance of ApiMonitoring
 * Pre-configured for development environment
 */
export const apiMonitoring = new ApiMonitoring({
  enabled: true,
  logRequests: process.env.NODE_ENV === 'development',
  logResponses: process.env.NODE_ENV === 'development',
  logErrors: true,
  trackPerformance: true,
  slowRequestThreshold: 3000,
});

// Set as singleton instance for getInstance() calls
ApiMonitoring.setInstance(apiMonitoring);
