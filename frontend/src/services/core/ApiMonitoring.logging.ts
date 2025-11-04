/**
 * WF-LOG-260 | ApiMonitoring.logging.ts - Logging utilities for API monitoring
 * Purpose: Centralized logging functions for API requests, responses, and errors
 * Upstream: ApiMonitoring.types, ApiMonitoring.utils | Dependencies: axios, ApiMonitoring.utils
 * Downstream: ApiMonitoring | Called by: ApiMonitoring class
 * Exports: Logging functions
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Request/response logging with sanitization and formatting
 */

import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiMetrics } from './ApiMonitoring.types';
import { sanitizeUrl, formatBytes, calculateResponseSize } from './ApiMonitoring.utils';

// ==========================================
// LOGGING FUNCTIONS
// ==========================================

/**
 * Log an outgoing API request with headers, body, and params
 * @param config - Axios request configuration
 */
export function logRequest(config: AxiosRequestConfig): void {
  const method = config.method?.toUpperCase();
  const url = sanitizeUrl(config.url || '');

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

/**
 * Log a successful API response with status, duration, and size
 * @param response - Axios response object
 * @param duration - Request duration in milliseconds
 */
export function logResponse(response: AxiosResponse, duration: number): void {
  const method = response.config.method?.toUpperCase();
  const url = sanitizeUrl(response.config.url || '');
  const status = response.status;

  const emoji = status >= 200 && status < 300 ? '✅' : '⚠️';

  console.group(`${emoji} [API Response] ${method} ${url} (${duration}ms)`);
  console.log('Status:', status);
  console.log('Duration:', `${duration}ms`);
  console.log('Size:', formatBytes(calculateResponseSize(response)));
  console.log('Data:', response.data);
  console.groupEnd();
}

/**
 * Log an API error with status, duration, and error details
 * @param error - Axios error object
 * @param duration - Request duration in milliseconds
 */
export function logError(error: any, duration: number): void {
  const method = error.config?.method?.toUpperCase();
  const url = sanitizeUrl(error.config?.url || '');
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

/**
 * Log a slow request warning with metrics
 * @param metrics - API metrics for the slow request
 * @param onSlowRequest - Optional callback for slow request handling
 */
export function logSlowRequest(
  metrics: ApiMetrics,
  onSlowRequest?: (metrics: ApiMetrics) => void
): void {
  console.warn(
    `⏱️ [Slow Request] ${metrics.method} ${metrics.url} took ${metrics.duration}ms`,
    metrics
  );

  if (onSlowRequest) {
    onSlowRequest(metrics);
  }
}
