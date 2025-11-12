/**
 * WF-COMP-315 | administration/performance.ts - Type definitions
 * Purpose: Performance monitoring type definitions for administration module
 * Upstream: enums.ts | Dependencies: MetricType
 * Downstream: Performance monitoring components | Called by: React components
 * Related: Other administration type files
 * Exports: Interfaces | Key Features: Type definitions
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type definitions for performance monitoring
 * LLM Context: Performance metrics and system health monitoring types
 */

import type { MetricType } from './enums';

/**
 * Performance Monitoring Types
 *
 * Type definitions for performance monitoring including:
 * - Performance metric entities
 * - System health comprehensive monitoring
 * - Metric recording
 */

// ==================== PERFORMANCE MONITORING TYPES ====================

/**
 * Performance metric entity
 *
 * @aligned_with backend/src/database/models/administration/PerformanceMetric.ts
 * @note Backend has timestamps: false, so no createdAt field
 */
export interface PerformanceMetric {
  id: string;
  metricType: MetricType;
  value: number;
  unit?: string;
  context?: Record<string, unknown>;
  recordedAt: string;
}

/**
 * System health metrics
 */
export interface SystemHealth {
  status: string;
  timestamp: Date | string;
  overall?: {
    uptime: number;
    lastRestart: Date | string;
    version: string;
  };
  services?: Array<{
    name: string;
    status: 'operational' | 'degraded' | 'down';
    responseTime: number;
    uptime: number;
    lastCheck: Date | string;
    errorRate?: number;
  }>;
  alerts?: Array<{
    id: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    service: string;
    message: string;
    timestamp: Date | string;
    acknowledged: boolean;
  }>;
  metrics: {
    cpu?: number | {
      usage: number;
      cores: number;
      temperature?: number;
    };
    memory?: number | {
      used: number;
      total: number;
      percentage: number;
    };
    disk?: number | {
      used: number;
      total: number;
      percentage: number;
    };
    database?: string;
    apiResponseTime?: number;
    uptime?: string;
    connections?: number;
    errorRate?: number;
    queuedJobs?: number;
    cacheHitRate?: number;
  };
  statistics?: {
    totalUsers: number;
    activeUsers: number;
    totalDistricts: number;
    totalSchools: number;
  };
  system?: {
    platform: string;
    arch: string;
    nodeVersion: string;
    totalMemoryGB: string;
    freeMemoryGB: string;
    cpuCount: number;
    cpuModel: string;
    processHeapUsedMB: string;
    processHeapTotalMB: string;
  };
}

/**
 * Record metric request
 */
export interface RecordMetricData {
  metricType: MetricType;
  value: number;
  unit?: string;
  context?: Record<string, unknown>;
}
