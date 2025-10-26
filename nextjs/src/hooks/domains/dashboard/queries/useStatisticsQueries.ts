/**
 * Dashboard Statistics Query Hooks
 * 
 * Specialized hooks for fetching various healthcare statistics for dashboard display.
 * 
 * @module hooks/domains/dashboard/queries/useStatisticsQueries
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { 
  appointmentsApi,
  studentsApi,
  healthRecordsApi,
  medicationsApi,
  inventoryApi,
  incidentReportsApi
} from '@/services';
import { useApiError } from '../../../shared/useApiError';
import { 
  dashboardQueryKeys, 
  DASHBOARD_CACHE_CONFIG,
  type DashboardStatisticsFilters
} from '../config';

/**
 * Get appointment statistics for dashboard
 */
export function useAppointmentStatistics(
  filters?: DashboardStatisticsFilters,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.statistics.appointments(filters),
    queryFn: async () => {
      try {
        const result = await appointmentsApi.getStatistics({
          dateFrom: filters?.dateRange?.startDate,
          dateTo: filters?.dateRange?.endDate,
          nurseId: filters?.nurseId,
        });
        
        // Transform to consistent format - using safe property access
        return {
          totalAppointments: result.total || result.totalCount || 0,
          completedAppointments: result.completed || result.completedCount || 0,
          upcomingAppointments: result.upcoming || result.upcomingCount || 0,
          cancelledAppointments: result.cancelled || result.cancelledCount || 0,
          completionRate: result.completionRate || 0,
          trend: result.trend || result.percentageChange || 0,
          completionsTrend: result.completionRate || 0,
        };
      } catch (error: any) {
        throw handleError(error, 'fetch_appointment_statistics');
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.statistics.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.statistics.gcTime,
    ...options,
  });
}

/**
 * Get student statistics for dashboard
 */
export function useStudentStatistics(
  filters?: DashboardStatisticsFilters,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.statistics.students(filters),
    queryFn: async () => {
      try {
        // Get total students with minimal data to get count
        const studentsResult = await studentsApi.getAll({ 
          page: 1, 
          limit: 1,
          includeInactive: filters?.includeInactive 
        });
        
        // Get additional student metrics if dashboard API exists
        let additionalStats = {};
        try {
          const dashboardStats = await dashboardApi.getStudentMetrics(filters);
          additionalStats = dashboardStats;
        } catch {
          // Fallback if dashboard API doesn't exist
        }
        
        return {
          totalStudents: studentsResult.total || 0,
          activeStudents: studentsResult.total || 0,
          newStudents: 0, // Would come from dashboardApi
          trend: 0, // Would come from dashboardApi
          ...additionalStats,
        };
      } catch (error: any) {
        throw handleApiError(error, 'fetch_student_statistics');
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.statistics.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.statistics.gcTime,
    ...options,
  });
}

/**
 * Get health records statistics for dashboard
 */
export function useHealthRecordsStatistics(
  filters?: DashboardStatisticsFilters,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.statistics.health(filters),
    queryFn: async () => {
      try {
        // Since there's no direct statistics endpoint, we'll aggregate from available APIs
        const [recordsResult] = await Promise.all([
          healthRecordsApi.getRecords('', { 
            page: 1, 
            limit: 1,
            dateFrom: filters?.dateRange?.startDate,
            dateTo: filters?.dateRange?.endDate,
          }).catch(() => ({ records: [], total: 0 })),
        ]);
        
        return {
          totalHealthRecords: recordsResult.total || 0,
          pendingHealthScreenings: 0, // Would need specific endpoint
          completedScreenings: 0, // Would need specific endpoint
          screeningsTrend: 0, // Would need historical data
          alertsCount: 0, // Would need alerts endpoint
        };
      } catch (error: any) {
        throw handleApiError(error, 'fetch_health_statistics');
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.statistics.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.statistics.gcTime,
    ...options,
  });
}

/**
 * Get medication statistics for dashboard
 */
export function useMedicationStatistics(
  filters?: DashboardStatisticsFilters,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.statistics.medications(filters),
    queryFn: async () => {
      try {
        // Get medication data from available endpoints
        const [medicationsResult, scheduleResult] = await Promise.all([
          medicationsApi.getAll({ page: 1, limit: 1 }).catch(() => ({ medications: [], total: 0 })),
          medicationsApi.getSchedule(
            filters?.dateRange?.startDate,
            filters?.dateRange?.endDate,
            filters?.nurseId
          ).catch(() => ({ schedule: [] })),
        ]);
        
        return {
          activePrescriptions: medicationsResult.pagination?.total || 0,
          scheduledToday: scheduleResult.schedule?.length || 0,
          completedToday: 0, // Would need completion tracking
          prescriptionsTrend: 0, // Would need historical data
          adherenceRate: 0, // Would need adherence tracking
        };
      } catch (error: any) {
        throw handleApiError(error, 'fetch_medication_statistics');
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.statistics.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.statistics.gcTime,
    ...options,
  });
}

/**
 * Get inventory statistics for dashboard
 */
export function useInventoryStatistics(
  filters?: DashboardStatisticsFilters,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.statistics.inventory(filters),
    queryFn: async () => {
      try {
        const [statsResult, alertsResult] = await Promise.all([
          inventoryApi.getStats().catch(() => ({})),
          inventoryApi.getAlerts().catch(() => []),
        ]);
        
        return {
          totalItems: statsResult.totalItems || 0,
          lowStockItems: statsResult.lowStockCount || 0,
          criticalAlerts: Array.isArray(alertsResult) 
            ? alertsResult.filter((alert: any) => alert.severity === 'critical').length 
            : 0,
          alertsTrend: 0, // Would need historical data
          inventoryValue: statsResult.totalValue || 0,
        };
      } catch (error: any) {
        throw handleApiError(error, 'fetch_inventory_statistics');
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.statistics.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.statistics.gcTime,
    ...options,
  });
}

/**
 * Get incident statistics for dashboard
 */
export function useIncidentStatistics(
  filters?: DashboardStatisticsFilters,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.statistics.incidents(filters),
    queryFn: async () => {
      try {
        const incidentsResult = await incidentReportsApi.getAll({
          page: 1,
          limit: 1,
          startDate: filters?.dateRange?.startDate,
          endDate: filters?.dateRange?.endDate,
        }).catch(() => ({ incidents: [], total: 0 }));
        
        return {
          totalIncidents: incidentsResult.total || 0,
          openIncidents: 0, // Would need status filtering
          resolvedIncidents: 0, // Would need status filtering
          incidentsTrend: 0, // Would need historical data
          severity: {
            low: 0,
            medium: 0,
            high: 0,
            critical: 0,
          },
        };
      } catch (error: any) {
        throw handleApiError(error, 'fetch_incident_statistics');
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.statistics.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.statistics.gcTime,
    ...options,
  });
}

/**
 * Combined hook for all dashboard statistics
 */
export function useDashboardStatistics(
  filters?: DashboardStatisticsFilters
) {
  const appointments = useAppointmentStatistics(filters);
  const students = useStudentStatistics(filters);
  const health = useHealthRecordsStatistics(filters);
  const medications = useMedicationStatistics(filters);
  const inventory = useInventoryStatistics(filters);
  const incidents = useIncidentStatistics(filters);

  return {
    appointments,
    students,
    health,
    medications,
    inventory,
    incidents,
    
    // Aggregate states
    isLoading: appointments.isLoading || students.isLoading || 
               health.isLoading || medications.isLoading || 
               inventory.isLoading || incidents.isLoading,
               
    isError: appointments.isError || students.isError || 
             health.isError || medications.isError || 
             inventory.isError || incidents.isError,
             
    // Utility functions
    refetchAll: () => {
      appointments.refetch();
      students.refetch();
      health.refetch();
      medications.refetch();
      inventory.refetch();
      incidents.refetch();
    },
  };
}

/**
 * Hook specifically for inventory alerts (used by dashboard components)
 */
export function useInventoryAlerts(
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();

  return useQuery({
    queryKey: dashboardQueryKeys.alerts.byType('inventory'),
    queryFn: async () => {
      try {
        const alerts = await inventoryApi.getAlerts();
        
        return {
          alerts: Array.isArray(alerts) ? alerts : [],
          loading: false,
          error: null,
          refresh: async () => {
            // This would normally be handled by react-query refetch
          },
          criticalAlerts: Array.isArray(alerts) 
            ? alerts.filter((alert: any) => alert.severity === 'critical').length 
            : 0,
          alertsTrend: 0, // Would need historical comparison
        };
      } catch (error: any) {
        throw handleApiError(error, 'fetch_inventory_alerts');
      }
    },
    staleTime: DASHBOARD_CACHE_CONFIG.alerts.staleTime,
    gcTime: DASHBOARD_CACHE_CONFIG.alerts.gcTime,
    ...options,
  });
}
