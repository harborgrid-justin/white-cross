/**
 * LOC: WC-MID-METRICS-TYPES-001
 * Type definitions for metrics collection system
 *
 * Contains all type definitions, interfaces, and enums used across
 * the metrics collection middleware and related components.
 */

import type { Request } from 'express';

/**
 * Metric types for categorization
 */
export enum MetricType {
  COUNTER = 'counter',
  GAUGE = 'gauge',
  HISTOGRAM = 'histogram',
  TIMER = 'timer',
  RATE = 'rate',
}

/**
 * Healthcare-specific metric categories
 */
export enum HealthcareMetricCategory {
  PATIENT_ACCESS = 'patient_access',
  PHI_ACCESS = 'phi_access',
  MEDICATION_ADMIN = 'medication_administration',
  EMERGENCY_ACCESS = 'emergency_access',
  AUDIT_EVENTS = 'audit_events',
  COMPLIANCE = 'compliance',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  USAGE = 'usage',
}

/**
 * Metric data structure
 */
export interface MetricData {
  name: string;
  type: MetricType;
  category: HealthcareMetricCategory;
  value: number;
  timestamp: Date;
  tags: Record<string, string>;
  unit?: string;
  description?: string;
}

/**
 * User information from authenticated request
 */
export interface MetricsUser {
  userId: string;
  role: string;
  facilityId?: string | null;
}

/**
 * Extended Express Request with optional user authentication
 */
export interface MetricsRequest extends Request {
  user?: MetricsUser;
}

/**
 * Metrics context for request processing
 */
export interface MetricsContext {
  requestId: string;
  startTime: number;
  timestamp: Date;
  user?: MetricsUser;
  method: string;
  path: string;
  statusCode?: number;
  responseTime?: number;
  facility?: string | null;
  userAgent: string;
  clientIP: string;
  bytes?: {
    in: number;
    out: number;
  };
}

/**
 * Metrics summary for monitoring and reporting
 */
export interface MetricsSummary {
  requestCounts: Record<string, number>;
  errorCounts: Record<string, number>;
  config: {
    enabled: boolean;
    sampleRate: number;
    enableHealthcareMetrics: boolean;
    enablePerformanceMetrics: boolean;
    enableUserMetrics: boolean;
    enableErrorMetrics: boolean;
  };
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  timestamp: string;
}

/**
 * Response end function signature for instrumentation
 */
export type ResponseEndFunction = (
  chunk?: Buffer | string | (() => void),
  encodingOrCallback?: BufferEncoding | (() => void),
  callback?: () => void,
) => void;
