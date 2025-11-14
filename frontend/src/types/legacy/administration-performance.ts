/**
 * WF-COMP-315 | administration-performance.ts - Performance Monitoring Type Definitions
 * Purpose: Type definitions for system performance monitoring and health checks
 * Upstream: administration-enums.ts | Dependencies: None
 * Downstream: Performance monitoring components | Called by: Admin dashboard, monitoring UI
 * Related: administration-audit.ts (performance alerts may be logged)
 * Exports: Performance metric types, system health interfaces
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: System health monitoring and metrics collection
 * LLM Context: Type definitions for performance metrics and system health monitoring
 */

import type { MetricType } from './administration-enums';

/**
 * Performance Monitoring Types
 *
 * Type definitions for:
 * - Performance metric collection
 * - System health monitoring
 * - Service status tracking
 * - Alert management
 */

// ==================== PERFORMANCE METRIC TYPES ====================

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
 * Record metric request
 */
export interface RecordMetricData {
  metricType: MetricType;
  value: number;
  unit?: string;
  context?: Record<string, unknown>;
}

// ==================== SYSTEM HEALTH TYPES ====================

/**
 * Service status information
 */
export interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
  lastCheck: Date | string;
  errorRate?: number;
}

/**
 * System alert information
 */
export interface SystemAlert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  service: string;
  message: string;
  timestamp: Date | string;
  acknowledged: boolean;
}

/**
 * CPU metrics
 */
export interface CpuMetrics {
  usage: number;
  cores: number;
  temperature?: number;
}

/**
 * Memory metrics
 */
export interface MemoryMetrics {
  used: number;
  total: number;
  percentage: number;
}

/**
 * Disk metrics
 */
export interface DiskMetrics {
  used: number;
  total: number;
  percentage: number;
}

/**
 * System metrics collection
 */
export interface SystemMetrics {
  cpu?: number | CpuMetrics;
  memory?: number | MemoryMetrics;
  disk?: number | DiskMetrics;
  database?: string;
  apiResponseTime?: number;
  uptime?: string;
  connections?: number;
  errorRate?: number;
  queuedJobs?: number;
  cacheHitRate?: number;
}

/**
 * Overall system information
 */
export interface SystemOverallInfo {
  uptime: number;
  lastRestart: Date | string;
  version: string;
}

/**
 * System statistics
 */
export interface SystemStatistics {
  totalUsers: number;
  activeUsers: number;
  totalDistricts: number;
  totalSchools: number;
}

/**
 * System platform information
 */
export interface SystemPlatformInfo {
  platform: string;
  arch: string;
  nodeVersion: string;
  totalMemoryGB: string;
  freeMemoryGB: string;
  cpuCount: number;
  cpuModel: string;
  processHeapUsedMB: string;
  processHeapTotalMB: string;
}

/**
 * System health metrics
 */
export interface SystemHealth {
  status: string;
  timestamp: Date | string;
  overall?: SystemOverallInfo;
  services?: ServiceStatus[];
  alerts?: SystemAlert[];
  metrics: SystemMetrics;
  statistics?: SystemStatistics;
  system?: SystemPlatformInfo;
}
