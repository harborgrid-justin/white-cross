/**
 * Dashboard Composite Hooks
 * 
 * Combined hooks that provide complete dashboard functionality by orchestrating
 * multiple queries and mutations for common dashboard use cases.
 * 
 * @module hooks/domains/dashboard/composites/useDashboardComposites
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useMemo } from 'react';
import { 
  useDashboardStatistics,
  useDashboardOverview,
  useDashboardAnalytics,
  useDashboardAlerts,
  useDashboardActivities,
} from '../queries/useDashboardQueries';
import {
  useAppointmentStatistics,
  useStudentStatistics,
  useHealthRecordsStatistics,
  useMedicationStatistics,
  useInventoryStatistics,
  useInventoryAlerts,
} from '../queries/useStatisticsQueries';
import { useDashboardMutations } from '../mutations/useDashboardMutations';
import type { DashboardStatisticsFilters } from '../config';

/**
 * Complete dashboard data hook - provides all dashboard information
 */
export function useDashboardData(
  filters?: DashboardStatisticsFilters,
  userId?: string
) {
  // Queries
  const overview = useDashboardOverview(userId);
  const generalStats = useDashboardStatistics(filters);
  const analytics = useDashboardAnalytics('week', filters);
  const alerts = useDashboardAlerts();
  const activities = useDashboardActivities(10);
  
  // Detailed statistics
  const appointmentStats = useAppointmentStatistics(filters);
  const studentStats = useStudentStatistics(filters);
  const healthStats = useHealthRecordsStatistics(filters);
  const medicationStats = useMedicationStatistics(filters);
  const inventoryStats = useInventoryStatistics(filters);
  const inventoryAlerts = useInventoryAlerts();

  // Mutations
  const mutations = useDashboardMutations();

  // Aggregate loading and error states
  const isLoading = overview.isLoading || 
                   generalStats.isLoading || 
                   analytics.isLoading || 
                   alerts.isLoading || 
                   activities.isLoading ||
                   appointmentStats.isLoading ||
                   studentStats.isLoading ||
                   healthStats.isLoading ||
                   medicationStats.isLoading ||
                   inventoryStats.isLoading ||
                   inventoryAlerts.isLoading;

  const isError = overview.isError || 
                 generalStats.isError || 
                 analytics.isError || 
                 alerts.isError || 
                 activities.isError ||
                 appointmentStats.isError ||
                 studentStats.isError ||
                 healthStats.isError ||
                 medicationStats.isError ||
                 inventoryStats.isError ||
                 inventoryAlerts.isError;

  // Refetch all data
  const refetchAll = () => {
    overview.refetch();
    generalStats.refetch();
    analytics.refetch();
    alerts.refetch();
    activities.refetch();
    appointmentStats.refetch();
    studentStats.refetch();
    healthStats.refetch();
    medicationStats.refetch();
    inventoryStats.refetch();
    inventoryAlerts.refetch();
  };

  return {
    // Data
    overview: overview.data,
    generalStats: generalStats.data,
    analytics: analytics.data,
    alerts: alerts.data,
    activities: activities.data,
    
    // Detailed statistics
    statistics: {
      appointments: appointmentStats.data,
      students: studentStats.data,
      health: healthStats.data,
      medications: medicationStats.data,
      inventory: inventoryStats.data,
    },
    
    inventoryAlerts: inventoryAlerts.data,
    
    // States
    isLoading,
    isError,
    
    // Actions
    refetchAll,
    mutations,
  };
}

/**
 * Dashboard management hook - provides dashboard control functionality
 */
export function useDashboardManagement(
  onLayoutUpdate?: (layout: any) => void,
  onExportComplete?: (result: any) => void
) {
  const mutations = useDashboardMutations({
    onSuccess: (data) => {
      if (data.layout) {
        onLayoutUpdate?.(data.layout);
      }
      if (data.downloadUrl) {
        onExportComplete?.(data);
      }
    }
  });

  // Utility functions
  const refreshDashboard = () => {
    mutations.refreshAll.mutate();
  };

  const exportDashboard = (options: any) => {
    mutations.exportData.mutate(options);
  };

  const updateLayout = (layout: any) => {
    mutations.updateLayout.mutate(layout);
  };

  const clearCache = () => {
    mutations.clearCache.mutate();
  };

  return {
    // Actions
    refreshDashboard,
    exportDashboard,
    updateLayout,
    clearCache,
    
    // States
    isRefreshing: mutations.refreshAll.isLoading,
    isExporting: mutations.exportData.isLoading,
    isUpdatingLayout: mutations.updateLayout.isLoading,
    isClearingCache: mutations.clearCache.isLoading,
    
    // Errors
    refreshError: mutations.refreshAll.error,
    exportError: mutations.exportData.error,
    layoutError: mutations.updateLayout.error,
    cacheError: mutations.clearCache.error,
  };
}

/**
 * Dashboard overview hook - provides summary data for dashboard widgets
 */
export function useDashboardOverviewData(filters?: DashboardStatisticsFilters) {
  const appointmentStats = useAppointmentStatistics(filters);
  const studentStats = useStudentStatistics(filters);
  const inventoryAlerts = useInventoryAlerts();
  const activities = useDashboardActivities(5);

  // Transform data for overview widgets
  const overviewData = useMemo(() => {
    if (!appointmentStats.data || !studentStats.data) return null;

    return {
      quickStats: {
        totalPatients: studentStats.data.totalStudents || 0,
        totalAppointments: appointmentStats.data.totalAppointments || 0,
        criticalAlerts: inventoryAlerts.data?.criticalAlerts || 0,
        completedToday: appointmentStats.data.completedAppointments || 0,
      },
      trends: {
        patientsTrend: studentStats.data.trend || 0,
        appointmentsTrend: appointmentStats.data.trend || 0,
        alertsTrend: inventoryAlerts.data?.alertsTrend || 0,
        completionsTrend: appointmentStats.data.completionsTrend || 0,
      },
      recentActivities: activities.data?.activities || [],
    };
  }, [appointmentStats.data, studentStats.data, inventoryAlerts.data, activities.data]);

  return {
    data: overviewData,
    isLoading: appointmentStats.isLoading || 
               studentStats.isLoading || 
               inventoryAlerts.isLoading || 
               activities.isLoading,
    isError: appointmentStats.isError || 
             studentStats.isError || 
             inventoryAlerts.isError || 
             activities.isError,
    refetch: () => {
      appointmentStats.refetch();
      studentStats.refetch();
      inventoryAlerts.refetch();
      activities.refetch();
    },
  };
}

/**
 * Dashboard alerts summary hook - provides consolidated alert information
 */
export function useDashboardAlertsSummary() {
  const generalAlerts = useDashboardAlerts();
  const inventoryAlerts = useInventoryAlerts();

  const alertsSummary = useMemo(() => {
    const general = generalAlerts.data || { critical: [], warnings: [], info: [] };
    const inventory = inventoryAlerts.data?.alerts || [];

    return {
      critical: [
        ...general.critical,
        ...inventory.filter((alert: any) => alert.severity === 'critical')
      ],
      warnings: [
        ...general.warnings,
        ...inventory.filter((alert: any) => alert.severity === 'warning')
      ],
      info: [
        ...general.info,
        ...inventory.filter((alert: any) => alert.severity === 'info')
      ],
      totalCount: general.critical.length + general.warnings.length + general.info.length + inventory.length,
      criticalCount: general.critical.length + inventory.filter((alert: any) => alert.severity === 'critical').length,
    };
  }, [generalAlerts.data, inventoryAlerts.data]);

  return {
    data: alertsSummary,
    isLoading: generalAlerts.isLoading || inventoryAlerts.isLoading,
    isError: generalAlerts.isError || inventoryAlerts.isError,
    refetch: () => {
      generalAlerts.refetch();
      inventoryAlerts.refetch();
    },
  };
}
