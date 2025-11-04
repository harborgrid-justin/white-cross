import { UseQueryOptions } from '@tanstack/react-query';
import {
  useEmergencyDashboard,
  useEmergencyOverview,
  useActiveIncidents,
  useCriticalIncidents,
  useActivePlans,
  useReadinessReport,
  usePrimaryContacts,
  useAvailableResources,
  useIncidentStatistics,
} from '../queries/useEmergencyQueries';
import {
  useBulkUpdateIncidents,
  useBulkActivateResources,
} from '../mutations/useEmergencyMutations';

// Emergency dashboard with real-time monitoring
export const useEmergencyDashboardComposite = (
  options?: UseQueryOptions<any, Error>
) => {
  const dashboardQuery = useEmergencyDashboard(options);
  const overviewQuery = useEmergencyOverview(options);
  const activeIncidentsQuery = useActiveIncidents(options);
  const criticalIncidentsQuery = useCriticalIncidents(options);
  const activePlansQuery = useActivePlans(options);
  const readinessQuery = useReadinessReport(options);

  return {
    // Data
    dashboard: dashboardQuery.data,
    overview: overviewQuery.data,
    activeIncidents: activeIncidentsQuery.data || [],
    criticalIncidents: criticalIncidentsQuery.data || [],
    activePlans: activePlansQuery.data || [],
    readiness: readinessQuery.data,

    // Loading states
    isLoadingDashboard: dashboardQuery.isLoading,
    isLoadingOverview: overviewQuery.isLoading,
    isLoadingActiveIncidents: activeIncidentsQuery.isLoading,
    isLoadingCriticalIncidents: criticalIncidentsQuery.isLoading,
    isLoadingActivePlans: activePlansQuery.isLoading,
    isLoadingReadiness: readinessQuery.isLoading,
    isLoading: dashboardQuery.isLoading || overviewQuery.isLoading,

    // Error states
    dashboardError: dashboardQuery.error,
    overviewError: overviewQuery.error,
    activeIncidentsError: activeIncidentsQuery.error,
    criticalIncidentsError: criticalIncidentsQuery.error,
    activePlansError: activePlansQuery.error,
    readinessError: readinessQuery.error,

    // Computed values
    totalActiveIncidents: activeIncidentsQuery.data?.length || 0,
    totalCriticalIncidents: criticalIncidentsQuery.data?.length || 0,
    totalActivePlans: activePlansQuery.data?.length || 0,
    overallReadiness: readinessQuery.data?.overallScore || 0,
    hasActiveEmergencies: (activeIncidentsQuery.data?.length || 0) > 0,
    hasCriticalIncidents: (criticalIncidentsQuery.data?.length || 0) > 0,

    // Alert levels
    alertLevel: (() => {
      const criticalCount = criticalIncidentsQuery.data?.length || 0;
      const activeCount = activeIncidentsQuery.data?.length || 0;

      if (criticalCount > 0) return 'CRITICAL';
      if (activeCount >= 3) return 'HIGH';
      if (activeCount > 0) return 'MEDIUM';
      return 'LOW';
    })(),

    // Utility functions
    refetch: () => {
      dashboardQuery.refetch();
      overviewQuery.refetch();
      activeIncidentsQuery.refetch();
      criticalIncidentsQuery.refetch();
      activePlansQuery.refetch();
      readinessQuery.refetch();
    },
  };
};

// Emergency response coordinator view
export const useEmergencyResponseCoordinator = (
  options?: UseQueryOptions<any, Error>
) => {
  const activeIncidentsQuery = useActiveIncidents(options);
  const criticalIncidentsQuery = useCriticalIncidents(options);
  const activePlansQuery = useActivePlans(options);
  const primaryContactsQuery = usePrimaryContacts(options);
  const availableResourcesQuery = useAvailableResources(undefined, options);
  const dashboardQuery = useEmergencyDashboard(options);

  const bulkUpdateIncidents = useBulkUpdateIncidents();
  const bulkActivateResources = useBulkActivateResources();

  return {
    // Data
    activeIncidents: activeIncidentsQuery.data || [],
    criticalIncidents: criticalIncidentsQuery.data || [],
    activePlans: activePlansQuery.data || [],
    primaryContacts: primaryContactsQuery.data || [],
    availableResources: availableResourcesQuery.data || [],
    dashboard: dashboardQuery.data,

    // Loading states
    isLoading: activeIncidentsQuery.isLoading || criticalIncidentsQuery.isLoading || dashboardQuery.isLoading,

    // Error states
    hasError: !!(activeIncidentsQuery.error || criticalIncidentsQuery.error || dashboardQuery.error),

    // Mutations
    bulkUpdateIncidents: bulkUpdateIncidents.mutate,
    bulkActivateResources: bulkActivateResources.mutate,

    // Mutation states
    isBulkUpdating: bulkUpdateIncidents.isPending,
    isBulkActivating: bulkActivateResources.isPending,

    // Computed values
    requiresImmediateAttention: criticalIncidentsQuery.data?.length || 0,
    totalActiveEvents: (activeIncidentsQuery.data?.length || 0) + (activePlansQuery.data?.length || 0),
    resourceUtilization: (() => {
      const total = availableResourcesQuery.data?.length || 0;
      const available = availableResourcesQuery.data?.filter(r => r.status === 'AVAILABLE').length || 0;
      return total > 0 ? ((total - available) / total * 100) : 0;
    })(),

    // Priority actions
    priorityActions: [
      ...(criticalIncidentsQuery.data || []).map(incident => ({
        type: 'critical_incident',
        id: incident.id,
        title: incident.title,
        priority: 'CRITICAL',
        timestamp: incident.reportedAt,
      })),
      ...(activeIncidentsQuery.data || []).filter(i => i.severity === 'HIGH').map(incident => ({
        type: 'high_incident',
        id: incident.id,
        title: incident.title,
        priority: 'HIGH',
        timestamp: incident.reportedAt,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10),

    // Utility functions
    refetch: () => {
      activeIncidentsQuery.refetch();
      criticalIncidentsQuery.refetch();
      activePlansQuery.refetch();
      primaryContactsQuery.refetch();
      availableResourcesQuery.refetch();
      dashboardQuery.refetch();
    },
  };
};

// Emergency analytics and reporting
export const useEmergencyAnalytics = (
  timeframe?: string,
  options?: UseQueryOptions<any, Error>
) => {
  const incidentStatsQuery = useIncidentStatistics(timeframe, options);
  const readinessQuery = useReadinessReport(options);
  const dashboardQuery = useEmergencyDashboard(options);

  return {
    // Data
    incidentStatistics: incidentStatsQuery.data,
    readinessReport: readinessQuery.data,
    dashboard: dashboardQuery.data,

    // Loading states
    isLoadingStatistics: incidentStatsQuery.isLoading,
    isLoadingReadiness: readinessQuery.isLoading,
    isLoadingDashboard: dashboardQuery.isLoading,
    isLoading: incidentStatsQuery.isLoading || readinessQuery.isLoading || dashboardQuery.isLoading,

    // Error states
    statisticsError: incidentStatsQuery.error,
    readinessError: readinessQuery.error,
    dashboardError: dashboardQuery.error,

    // Computed values
    totalIncidents: incidentStatsQuery.data?.totalIncidents || 0,
    averageResponseTime: incidentStatsQuery.data?.averageResponseTime || 0,
    averageResolutionTime: incidentStatsQuery.data?.averageResolutionTime || 0,
    overallReadiness: readinessQuery.data?.overallScore || 0,

    // Trends
    incidentTrends: incidentStatsQuery.data?.trendsData || [],
    readinessTrends: readinessQuery.data?.recommendations || [],

    // Utility functions
    refetch: () => {
      incidentStatsQuery.refetch();
      readinessQuery.refetch();
      dashboardQuery.refetch();
    },
  };
};
