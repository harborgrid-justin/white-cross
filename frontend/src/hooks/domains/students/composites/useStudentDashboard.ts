/**
 * Student Dashboard Composite Hook
 *
 * Combines all necessary data for student dashboard including metrics,
 * enrollment stats, health stats, and recent activity.
 *
 * @module hooks/students/composites/useStudentDashboard
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useMemo } from 'react';
import { useStudents } from '../coreQueries';
import { useDashboardMetrics, useEnrollmentStats, useHealthStats } from '../statistics';

/**
 * Enhanced API error type
 */
interface ApiError extends Error {
  status?: number;
  response?: any;
}

/**
 * Time range for dashboard metrics
 */
export type DashboardTimeRange = 'today' | 'week' | 'month' | 'year';

/**
 * Dashboard hook that combines all necessary data for student dashboard
 *
 * @param timeRange - Time range for dashboard metrics
 * @returns Complete dashboard data
 *
 * @example
 * ```tsx
 * const dashboard = useStudentDashboard('month');
 *
 * if (dashboard.isLoading) return <DashboardSkeleton />;
 *
 * return (
 *   <Dashboard
 *     metrics={dashboard.metrics}
 *     recentStudents={dashboard.recentStudents}
 *     alerts={dashboard.alerts}
 *     quickActions={dashboard.quickActions}
 *   />
 * );
 * ```
 */
export const useStudentDashboard = (timeRange: DashboardTimeRange = 'month') => {
  // Core dashboard data
  const dashboardMetrics = useDashboardMetrics(timeRange);
  const enrollmentStats = useEnrollmentStats(timeRange);
  const healthStats = useHealthStats(timeRange);

  // Recent students
  const recentStudentsQuery = useStudents({
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    limit: 10
  });

  // Quick stats
  const quickStats = useMemo(() => {
    if (!dashboardMetrics.metrics) return null;

    return {
      totalStudents: dashboardMetrics.metrics.enrollment.total,
      activeStudents: dashboardMetrics.metrics.enrollment.active,
      newThisMonth: dashboardMetrics.metrics.enrollment.newThisMonth,
      highRiskStudents: dashboardMetrics.metrics.risk.highRiskStudents,
      criticalAlerts: dashboardMetrics.metrics.risk.criticalAlerts,
      complianceScore: dashboardMetrics.metrics.compliance.auditReadiness,
    };
  }, [dashboardMetrics.metrics]);

  // Quick actions with analytics
  const quickActions = useMemo(() => [
    {
      id: 'add-student',
      label: 'Add New Student',
      icon: 'UserPlus',
      count: 0,
      priority: 'high' as const,
    },
    {
      id: 'pending-approvals',
      label: 'Pending Approvals',
      icon: 'Clock',
      count: dashboardMetrics.metrics?.risk.studentsNeedingAttention || 0,
      priority: 'medium' as const,
    },
    {
      id: 'health-alerts',
      label: 'Health Alerts',
      icon: 'AlertTriangle',
      count: dashboardMetrics.metrics?.risk.criticalAlerts || 0,
      priority: 'high' as const,
    },
    {
      id: 'reports',
      label: 'Generate Reports',
      icon: 'FileText',
      count: 0,
      priority: 'low' as const,
    },
  ], [dashboardMetrics.metrics]);

  // Combined loading state
  const isLoading =
    dashboardMetrics.isLoading ||
    enrollmentStats.isLoading ||
    healthStats.isLoading ||
    recentStudentsQuery.isLoading;

  // Combined error state
  const error =
    dashboardMetrics.error ||
    enrollmentStats.error ||
    healthStats.error ||
    recentStudentsQuery.error;

  return {
    // Primary metrics
    metrics: dashboardMetrics.metrics,
    enrollment: enrollmentStats.data,
    health: healthStats.data,

    // Quick overview
    quickStats,
    quickActions,
    alerts: dashboardMetrics.metrics?.alerts || [],

    // Recent activity
    recentStudents: recentStudentsQuery.data?.students.slice(0, 5) || [],

    // State
    isLoading,
    error: error as ApiError | null,
    lastUpdated: dashboardMetrics.metrics?.lastUpdated,

    // Actions
    refetch: () => {
      dashboardMetrics.refetch();
      enrollmentStats.refetch();
      healthStats.refetch();
      recentStudentsQuery.refetch();
    },
  };
};
