/**
 * Student Dashboard Metrics Hook
 *
 * Provides comprehensive dashboard metrics combining enrollment, health,
 * activity, risk, and compliance statistics with alert generation.
 *
 * @module hooks/students/statistics/useDashboardMetrics
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useMemo } from 'react';
import { useEnrollmentStats } from './useEnrollmentStats';
import { useHealthStats } from './useHealthStats';
import { useActivityStats, useRiskStats } from './useActivityRiskStats';
import { useComplianceStats } from './useComplianceStats';
import type { DashboardMetrics, TimeRange, ApiError } from './types';

/**
 * Hook for comprehensive dashboard metrics
 *
 * @param timeRange - Time range for analytics
 * @returns Complete dashboard metrics
 *
 * @example
 * ```tsx
 * const { metrics, isLoading, error } = useDashboardMetrics('month');
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *   <Dashboard
 *     enrollment={metrics.enrollment}
 *     health={metrics.health}
 *     activity={metrics.activity}
 *     alerts={metrics.alerts}
 *   />
 * );
 * ```
 */
export const useDashboardMetrics = (timeRange: TimeRange = 'month') => {
  const enrollmentQuery = useEnrollmentStats(timeRange);
  const healthQuery = useHealthStats(timeRange);
  const activityQuery = useActivityStats(timeRange);
  const riskQuery = useRiskStats(timeRange);
  const complianceQuery = useComplianceStats(timeRange);

  const metrics = useMemo((): DashboardMetrics | null => {
    if (!enrollmentQuery.data || !healthQuery.data || !activityQuery.data ||
        !riskQuery.data || !complianceQuery.data) {
      return null;
    }

    // Generate alerts based on data
    const alerts = [];

    if (riskQuery.data.criticalAlerts > 0) {
      alerts.push({
        id: 'critical-alerts',
        type: 'critical' as const,
        message: `${riskQuery.data.criticalAlerts} students require immediate attention`,
        count: riskQuery.data.criticalAlerts,
        actionRequired: true,
      });
    }

    if (complianceQuery.data.vaccinationCompliance < 90) {
      alerts.push({
        id: 'vaccination-compliance',
        type: 'warning' as const,
        message: `Vaccination compliance is ${complianceQuery.data.vaccinationCompliance}% (target: 90%)`,
        actionRequired: true,
      });
    }

    if (enrollmentQuery.data.trends.monthlyGrowth > 10) {
      alerts.push({
        id: 'high-growth',
        type: 'info' as const,
        message: `Student enrollment increased by ${enrollmentQuery.data.trends.monthlyGrowth.toFixed(1)}% this month`,
      });
    }

    return {
      enrollment: enrollmentQuery.data,
      health: healthQuery.data,
      activity: activityQuery.data,
      risk: riskQuery.data,
      compliance: complianceQuery.data,
      lastUpdated: new Date().toISOString(),
      alerts,
    };
  }, [
    enrollmentQuery.data,
    healthQuery.data,
    activityQuery.data,
    riskQuery.data,
    complianceQuery.data,
  ]);

  const isLoading =
    enrollmentQuery.isLoading ||
    healthQuery.isLoading ||
    activityQuery.isLoading ||
    riskQuery.isLoading ||
    complianceQuery.isLoading;

  const error =
    enrollmentQuery.error ||
    healthQuery.error ||
    activityQuery.error ||
    riskQuery.error ||
    complianceQuery.error;

  const refetch = () => {
    enrollmentQuery.refetch();
    healthQuery.refetch();
    activityQuery.refetch();
    riskQuery.refetch();
    complianceQuery.refetch();
  };

  return {
    metrics,
    isLoading,
    error: error as ApiError | null,
    refetch,

    // Individual query status for granular loading states
    enrollment: {
      data: enrollmentQuery.data,
      isLoading: enrollmentQuery.isLoading,
      error: enrollmentQuery.error,
    },
    health: {
      data: healthQuery.data,
      isLoading: healthQuery.isLoading,
      error: healthQuery.error,
    },
    activity: {
      data: activityQuery.data,
      isLoading: activityQuery.isLoading,
      error: activityQuery.error,
    },
    risk: {
      data: riskQuery.data,
      isLoading: riskQuery.isLoading,
      error: riskQuery.error,
    },
    compliance: {
      data: complianceQuery.data,
      isLoading: complianceQuery.isLoading,
      error: complianceQuery.error,
    },
  };
};
