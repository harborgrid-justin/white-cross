/**
 * Performance Monitoring Hooks
 *
 * Specialized React hooks for system monitoring:
 * - System health monitoring
 * - Performance metrics tracking
 * - Enterprise dashboard selectors
 * - Performance trend analysis
 *
 * @module monitoringHooks
 */

import { useMemo } from 'react';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../reduxStore';

// Use core hooks locally to avoid circular dependency
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Import API hooks
import {
  useGetPerformanceMetricsQuery,
  useGetSystemHealthQuery,
  handlePhase3ApiError,
} from '../api/advancedApiIntegration';

/**
 * Hook for monitoring system performance and health
 */
export const useSystemMonitoring = () => {
  const {
    data: performanceMetrics,
    error: metricsError,
    isLoading: isLoadingMetrics
  } = useGetPerformanceMetricsQuery({
    timeframe: 'HOUR'
  });

  const {
    data: systemHealth,
    error: healthError,
    isLoading: isLoadingHealth
  } = useGetSystemHealthQuery();

  const healthStatus = useMemo(() => {
    if (!systemHealth) return null;

    const criticalAlerts = systemHealth.alerts.filter(alert => alert.severity === 'CRITICAL');
    const highAlerts = systemHealth.alerts.filter(alert => alert.severity === 'HIGH');

    return {
      status: systemHealth.status,
      services: systemHealth.services,
      totalAlerts: systemHealth.alerts.length,
      criticalAlerts: criticalAlerts.length,
      highAlerts: highAlerts.length,
      isHealthy: systemHealth.status === 'HEALTHY' && criticalAlerts.length === 0
    };
  }, [systemHealth]);

  const performance = useMemo(() => {
    if (!performanceMetrics) return null;

    const metrics = Object.values(performanceMetrics);
    const avgResponseTime = metrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / metrics.length;
    const avgErrorRate = metrics.reduce((sum, m) => sum + m.errorRate, 0) / metrics.length;
    const avgCacheHitRate = metrics.reduce((sum, m) => sum + m.cacheHitRate, 0) / metrics.length;

    return {
      averageResponseTime: avgResponseTime,
      averageErrorRate: avgErrorRate,
      averageCacheHitRate: avgCacheHitRate,
      totalRequests: metrics.reduce((sum, m) => sum + m.totalRequests, 0),
      byEntity: performanceMetrics
    };
  }, [performanceMetrics]);

  return {
    healthStatus,
    performance,
    isLoading: isLoadingMetrics || isLoadingHealth,
    error: metricsError || healthError ? handlePhase3ApiError(metricsError || healthError) : null
  };
};

/**
 * Memoized selector for enterprise dashboard data
 */
export const useEnterpriseDashboard = () => {
  return useAppSelector(
    useMemo(
      () => createSelector(
        [(state: RootState) => state.enterprise, (state: RootState) => state.orchestration],
        (enterprise, orchestration) => {
          const activeBulkOps = Object.values(enterprise.bulkOperations).filter(
            op => op.status === 'IN_PROGRESS'
          );

          const activeWorkflows = Object.values(orchestration.executions).filter(
            exec => exec.status === 'RUNNING'
          );

          const recentAuditEntries = enterprise.auditTrail.slice(0, 10);

          const criticalRiskEntries = recentAuditEntries.filter(
            entry => entry.riskLevel === 'CRITICAL'
          );

          return {
            activeBulkOperations: activeBulkOps.length,
            activeWorkflows: activeWorkflows.length,
            recentAuditEntries: recentAuditEntries.length,
            criticalRiskEntries: criticalRiskEntries.length,
            totalOperations: Object.keys(enterprise.bulkOperations).length,
            totalExecutions: Object.keys(orchestration.executions).length
          };
        }
      ),
      []
    )
  );
};

/**
 * Performance metrics selector with trends
 */
export const usePerformanceTrends = () => {
  return useAppSelector(
    useMemo(
      () => createSelector(
        [(state: RootState) => state.enterprise.performanceMetrics],
        (performanceMetrics) => {
          const metrics = Object.values(performanceMetrics);

          // Calculate trends (simplified)
          const responseTimeTrend = metrics.map(m => ({
            entity: m.entity,
            responseTime: m.averageResponseTime,
            trend: m.averageResponseTime > 1000 ? 'SLOW' : m.averageResponseTime > 500 ? 'MODERATE' : 'FAST'
          }));

          const errorRateTrend = metrics.map(m => ({
            entity: m.entity,
            errorRate: m.errorRate,
            trend: m.errorRate > 5 ? 'HIGH' : m.errorRate > 1 ? 'MODERATE' : 'LOW'
          }));

          const cacheEfficiency = metrics.map(m => ({
            entity: m.entity,
            hitRate: m.cacheHitRate,
            efficiency: m.cacheHitRate > 80 ? 'EXCELLENT' : m.cacheHitRate > 60 ? 'GOOD' : 'POOR'
          }));

          return {
            responseTimeTrend,
            errorRateTrend,
            cacheEfficiency,
            overallHealth: metrics.every(m => m.errorRate < 5 && m.averageResponseTime < 1000) ? 'HEALTHY' : 'NEEDS_ATTENTION'
          };
        }
      ),
      []
    )
  );
};
