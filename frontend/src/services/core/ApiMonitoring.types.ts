/**
 * WF-TYPES-259 | ApiMonitoring.types.ts - Type definitions for API monitoring
 * Purpose: Centralized type definitions for API monitoring and performance tracking
 * Upstream: None | Dependencies: None
 * Downstream: ApiMonitoring, ApiMonitoring.metrics, ApiMonitoring.logging
 * Exports: Type definitions and interfaces
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Type-safe definitions for monitoring configuration and metrics
 */

/**
 * API Monitoring Types
 * Provides type definitions for request/response monitoring, performance metrics, and error tracking
 */

// ==========================================
// TYPE DEFINITIONS
// ==========================================

/**
 * Metrics for a single API request/response cycle
 */
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

/**
 * Aggregated performance statistics across all requests
 */
export interface PerformanceStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  slowestRequest: ApiMetrics | null;
  fastestRequest: ApiMetrics | null;
  errorRate: number;
}

/**
 * Configuration options for API monitoring behavior
 */
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
