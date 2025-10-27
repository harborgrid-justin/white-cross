/**
 * WF-COMP-256 | ApiMonitoring.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./ApiClient | Dependencies: axios, ./ApiClient
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces, classes | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * API Monitoring and Performance Tracking
 * Provides request/response monitoring, performance metrics, and error tracking
 */

import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestInterceptor, ResponseInterceptor } from './ApiClient';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ApiMetrics {
  requestId: string;
  method: string;
  url: string;
  status?: number;
  duration: number;
  timestamp: number;
  success: boolean;
  error?: string;
  size?: number;
}

export interface PerformanceStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  slowestRequest: ApiMetrics | null;
  fastestRequest: ApiMetrics | null;
  errorRate: number;
}

export interface MonitoringConfig {
  enabled: boolean;
  logRequests: boolean;
  logResponses: boolean;
  logErrors: boolean;
  trackPerformance: boolean;
  slowRequestThreshold: number; // ms
  onSlowRequest?: (metrics: ApiMetrics) => void;
  onError?: (metrics: ApiMetrics) => void;
}

// ==========================================
// API MONITORING CLASS
// ==========================================

export class ApiMonitoring {
  private config: MonitoringConfig;
  private metrics: Map<string, ApiMetrics> = new Map();
  private metricsHistory: ApiMetrics[] = [];
  private maxHistorySize = 100;

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
  }

  // ==========================================
  // INTERCEPTOR CREATION
  // ==========================================

  /**
   * Create request interceptor for monitoring
   */
  public createRequestInterceptor(): RequestInterceptor {
    return {
      onFulfilled: (config: AxiosRequestConfig) => {
        if (!this.config.enabled) return config;

        const requestId = config.headers?.['X-Request-ID'] as string || this.generateRequestId();
        const startTime = Date.now();

        // Store request start time
        this.metrics.set(requestId, {
          requestId,
          method: config.method?.toUpperCase() || 'UNKNOWN',
          url: this.sanitizeUrl(config.url || ''),
          duration: 0,
          timestamp: startTime,
          success: false,
        });

        // Attach metadata to config for response interceptor
        (config as any).__monitoringStartTime = startTime;
        (config as any).__monitoringRequestId = requestId;

        // Log request
        if (this.config.logRequests) {
          this.logRequest(config);
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
            url: this.sanitizeUrl(config.url || ''),
            status: response.status,
            duration,
            timestamp: startTime,
            success: true,
            size: this.calculateResponseSize(response),
          };

          this.recordMetrics(metrics);

          // Log response
          if (this.config.logResponses) {
            this.logResponse(response, duration);
          }

          // Check for slow requests
          if (duration > this.config.slowRequestThreshold) {
            this.handleSlowRequest(metrics);
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
            url: this.sanitizeUrl(config.url || ''),
            status: error.response?.status,
            duration,
            timestamp: startTime,
            success: false,
            error: error.message || 'Unknown error',
          };

          this.recordMetrics(metrics);

          // Log error
          if (this.config.logErrors) {
            this.logError(error, duration);
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
  // METRICS RECORDING
  // ==========================================

  private recordMetrics(metrics: ApiMetrics): void {
    if (!this.config.trackPerformance) return;

    // Update current metrics
    this.metrics.set(metrics.requestId, metrics);

    // Add to history
    this.metricsHistory.push(metrics);

    // Limit history size
    if (this.metricsHistory.length > this.maxHistorySize) {
      this.metricsHistory.shift();
    }

    // Cleanup old metrics
    this.metrics.delete(metrics.requestId);
  }

  // ==========================================
  // LOGGING
  // ==========================================

  private logRequest(config: AxiosRequestConfig): void {
    const method = config.method?.toUpperCase();
    const url = this.sanitizeUrl(config.url || '');

    console.group(`🚀 [API Request] ${method} ${url}`);
    console.log('Headers:', config.headers);
    if (config.data) {
      console.log('Body:', config.data);
    }
    if (config.params) {
      console.log('Params:', config.params);
    }
    console.groupEnd();
  }

  private logResponse(response: AxiosResponse, duration: number): void {
    const method = response.config.method?.toUpperCase();
    const url = this.sanitizeUrl(response.config.url || '');
    const status = response.status;

    const emoji = status >= 200 && status < 300 ? '✅' : '⚠️';

    console.group(`${emoji} [API Response] ${method} ${url} (${duration}ms)`);
    console.log('Status:', status);
    console.log('Duration:', `${duration}ms`);
    console.log('Size:', this.formatBytes(this.calculateResponseSize(response)));
    console.log('Data:', response.data);
    console.groupEnd();
  }

  private logError(error: any, duration: number): void {
    const method = error.config?.method?.toUpperCase();
    const url = this.sanitizeUrl(error.config?.url || '');
    const status = error.response?.status || 'Network Error';

    console.group(`❌ [API Error] ${method} ${url} (${duration}ms)`);
    console.log('Status:', status);
    console.log('Duration:', `${duration}ms`);
    console.log('Message:', error.message);
    if (error.response?.data) {
      console.log('Response Data:', error.response.data);
    }
    console.groupEnd();
  }

  private handleSlowRequest(metrics: ApiMetrics): void {
    console.warn(
      `⏱️ [Slow Request] ${metrics.method} ${metrics.url} took ${metrics.duration}ms`,
      metrics
    );

    if (this.config.onSlowRequest) {
      this.config.onSlowRequest(metrics);
    }
  }

  // ==========================================
  // PERFORMANCE STATS
  // ==========================================

  /**
   * Get performance statistics
   */
  public getPerformanceStats(): PerformanceStats {
    const history = this.metricsHistory;

    if (history.length === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        slowestRequest: null,
        fastestRequest: null,
        errorRate: 0,
      };
    }

    const successfulRequests = history.filter(m => m.success).length;
    const failedRequests = history.filter(m => !m.success).length;
    const totalRequests = history.length;

    const durations = history.map(m => m.duration);
    const averageResponseTime = durations.reduce((a, b) => a + b, 0) / durations.length;

    const sortedByDuration = [...history].sort((a, b) => a.duration - b.duration);
    const slowestRequest = sortedByDuration[sortedByDuration.length - 1];
    const fastestRequest = sortedByDuration[0];

    const errorRate = failedRequests / totalRequests;

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime: Math.round(averageResponseTime),
      slowestRequest,
      fastestRequest,
      errorRate: Math.round(errorRate * 100) / 100,
    };
  }

  /**
   * Get metrics for a specific endpoint
   */
  public getEndpointMetrics(endpoint: string): ApiMetrics[] {
    return this.metricsHistory.filter(m => m.url.includes(endpoint));
  }

  /**
   * Get recent errors
   */
  public getRecentErrors(limit: number = 10): ApiMetrics[] {
    return this.metricsHistory
      .filter(m => !m.success)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get slow requests
   */
  public getSlowRequests(limit: number = 10): ApiMetrics[] {
    return [...this.metricsHistory]
      .filter(m => m.duration > this.config.slowRequestThreshold)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Clear metrics history
   */
  public clearHistory(): void {
    this.metricsHistory = [];
    this.metrics.clear();
  }

  /**
   * Export metrics to JSON
   */
  public exportMetrics(): string {
    return JSON.stringify({
      stats: this.getPerformanceStats(),
      history: this.metricsHistory,
      timestamp: new Date().toISOString(),
    }, null, 2);
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  private sanitizeUrl(url: string): string {
    // Remove sensitive query parameters
    try {
      const urlObj = new URL(url, 'http://dummy.com');
      const sensitiveParams = ['token', 'password', 'secret', 'key', 'apiKey'];

      sensitiveParams.forEach(param => {
        if (urlObj.searchParams.has(param)) {
          urlObj.searchParams.set(param, '***');
        }
      });

      return urlObj.pathname + urlObj.search;
    } catch {
      return url;
    }
  }

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

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  public getConfig(): MonitoringConfig {
    return { ...this.config };
  }
}

// ==========================================
// SINGLETON INSTANCE
// ==========================================

export const apiMonitoring = new ApiMonitoring({
  enabled: true,
  logRequests: process.env.NODE_ENV === 'development',
  logResponses: process.env.NODE_ENV === 'development',
  logErrors: true,
  trackPerformance: true,
  slowRequestThreshold: 3000,
});
