import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { EMERGENCY_CACHE_CONFIG } from '../config';
import { mockEmergencyAPI } from './mockEmergencyAPI';

// Analytics and Dashboard Queries
export const useEmergencyDashboard = (
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'dashboard'],
    queryFn: () => mockEmergencyAPI.getEmergencyDashboard(),
    staleTime: EMERGENCY_CACHE_CONFIG.DEFAULT_STALE_TIME,
    refetchInterval: 60000, // Refresh every minute
    ...options,
  });
};

export const useIncidentStatistics = (
  timeframe?: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'statistics', 'incidents', timeframe],
    queryFn: () => mockEmergencyAPI.getIncidentStatistics(timeframe),
    staleTime: EMERGENCY_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
  });
};

export const useReadinessReport = (
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'readiness'],
    queryFn: () => mockEmergencyAPI.getReadinessReport(),
    staleTime: EMERGENCY_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
  });
};

// Bulk query for emergency overview
export const useEmergencyOverview = (
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'overview'],
    queryFn: async () => {
      const [dashboard, activeIncidents, criticalIncidents, activePlans] = await Promise.all([
        mockEmergencyAPI.getEmergencyDashboard(),
        mockEmergencyAPI.getActiveIncidents(),
        mockEmergencyAPI.getCriticalIncidents(),
        mockEmergencyAPI.getActivePlans(),
      ]);

      return {
        dashboard,
        activeIncidents: activeIncidents.slice(0, 5),
        criticalIncidents: criticalIncidents.slice(0, 3),
        activePlans: activePlans.slice(0, 5),
        alerts: [
          ...criticalIncidents.map(incident => ({
            type: 'critical_incident',
            message: `Critical incident: ${incident.title}`,
            timestamp: incident.reportedAt,
          })),
        ],
      };
    },
    staleTime: EMERGENCY_CACHE_CONFIG.DEFAULT_STALE_TIME,
    refetchInterval: 30000, // Frequent updates for overview
    ...options,
  });
};
