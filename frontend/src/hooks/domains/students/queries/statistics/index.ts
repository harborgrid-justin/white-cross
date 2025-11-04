/**
 * Student Statistics and Analytics Hooks - Index
 *
 * Re-exports all statistics hooks and types for backward compatibility.
 * This file maintains the same API as the original statistics.ts file.
 *
 * @module hooks/students/statistics
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

// Export all type definitions
export type {
  ApiError,
  EnrollmentStats,
  HealthStats,
  ActivityStats,
  RiskStats,
  ComplianceStats,
  DashboardMetrics,
  TimeRange,
  CustomTimeRange,
} from './types';

// Export individual statistics hooks
export { useEnrollmentStats } from './useEnrollmentStats';
export { useHealthStats } from './useHealthStats';
export { useActivityStats, useRiskStats } from './useActivityRiskStats';
export { useComplianceStats } from './useComplianceStats';
export { useDashboardMetrics } from './useDashboardMetrics';
export { useTrendAnalysis, useComparativeStats } from './useAnalyticsStats';

// Default export for backward compatibility
export { default } from './default';
