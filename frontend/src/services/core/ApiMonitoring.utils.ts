/**
 * WF-UTIL-261 | ApiMonitoring.utils.ts - Utility functions for API monitoring
 * Purpose: Helper functions for URL sanitization, size calculation, and ID generation
 * Upstream: None | Dependencies: axios
 * Downstream: ApiMonitoring, ApiMonitoring.logging | Called by: Monitoring and logging modules
 * Exports: Utility functions
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Pure utility functions with no dependencies on monitoring state
 */

import { AxiosResponse } from 'axios';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Sanitize URL by removing sensitive query parameters
 * Masks common sensitive parameters like token, password, secret, key, apiKey
 * @param url - URL to sanitize
 * @returns Sanitized URL with sensitive params masked
 */
export function sanitizeUrl(url: string): string {
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

/**
 * Calculate the size of an API response in bytes
 * Attempts to read content-length header, falls back to estimating from data
 * @param response - Axios response object
 * @returns Response size in bytes
 */
export function calculateResponseSize(response: AxiosResponse): number {
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

/**
 * Format bytes into human-readable string (Bytes, KB, MB, GB)
 * @param bytes - Number of bytes
 * @returns Formatted string with appropriate unit
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Generate a unique request ID
 * Format: req_{timestamp}_{random}
 * @returns Unique request ID string
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
