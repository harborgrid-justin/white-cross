/**
 * Default export for statistics hooks
 *
 * Provides a default export object for backward compatibility
 * with the original statistics.ts file structure.
 *
 * @module hooks/students/statistics/default
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useEnrollmentStats } from './useEnrollmentStats';
import { useHealthStats } from './useHealthStats';
import { useActivityStats, useRiskStats } from './useActivityRiskStats';
import { useComplianceStats } from './useComplianceStats';
import { useDashboardMetrics } from './useDashboardMetrics';
import { useTrendAnalysis, useComparativeStats } from './useAnalyticsStats';

/**
 * Default export object containing all statistics hooks
 */
export default {
  useEnrollmentStats,
  useHealthStats,
  useActivityStats,
  useRiskStats,
  useComplianceStats,
  useDashboardMetrics,
  useTrendAnalysis,
  useComparativeStats,
};
