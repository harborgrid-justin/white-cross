/**
 * WF-COMP-332 | performance-reports.ts - Performance metrics report type definitions
 * Purpose: Type definitions for nurse workload, system usage, and performance tracking
 * Upstream: report-filters.ts, common.ts | Dependencies: DateRangeFilter, BaseEntity
 * Downstream: Performance dashboard components | Called by: Performance monitoring services
 * Related: dashboard-reports.ts, compliance-reports.ts
 * Exports: Performance metrics, nurse workload data, system usage statistics
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Performance data collection → Metric calculation → Efficiency analysis → Reporting
 * LLM Context: Healthcare system performance monitoring and nurse workload analytics
 */

import type { BaseEntity } from '../common';
import type { DateRangeFilter } from './report-filters';

/**
 * Performance metrics with workload and system usage
 */
export interface PerformanceMetrics {
  nurseWorkload: Array<{
    nurseId: string;
    nurseName: string;
    appointmentsCompleted: number;
    medicationsAdministered: number;
    incidentsHandled: number;
    efficiency: number;
  }>;
  systemUsage: {
    activeUsers: number;
    documentsCreated: number;
    recordsUpdated: number;
    averageResponseTime: number;
  };
  complianceScores: Array<{
    category: string;
    score: number;
    target: number;
    status: 'good' | 'warning' | 'critical';
  }>;
}

/**
 * Performance metric data point
 */
export interface PerformanceMetric extends BaseEntity {
  metricType: string;
  metricValue: number;
  unit?: string;
  recordedAt: Date | string;
  context?: Record<string, unknown>;
  threshold?: number;
  isAlert?: boolean;
}

/**
 * Nurse performance metrics
 */
export interface NursePerformanceMetric {
  nurseId: string;
  nurseName: string;
  appointmentsCompleted: number;
  medicationsAdministered: number;
  incidentsHandled: number;
  studentsServed: number;
  averageResponseTime?: number;
  efficiency?: number;
  complianceScore?: number;
}

/**
 * System usage metrics
 */
export interface SystemUsageMetrics {
  activeUsers: number;
  totalLogins: number;
  documentsCreated: number;
  recordsUpdated: number;
  apiCalls: number;
  averageResponseTime: number;
  errorRate: number;
  uptime?: number;
}

/**
 * Performance metrics report aggregate data
 */
export interface PerformanceMetricsReport {
  metrics: PerformanceMetric[];
  nursePerformance?: NursePerformanceMetric[];
  systemUsage?: SystemUsageMetrics;
  period?: DateRangeFilter;
  generatedAt?: Date | string;
}
