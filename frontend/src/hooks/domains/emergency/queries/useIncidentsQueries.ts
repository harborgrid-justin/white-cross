import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  EMERGENCY_QUERY_KEYS,
  EMERGENCY_CACHE_CONFIG,
  EmergencyIncident,
  IncidentTimelineEntry,
} from '../config';
import { mockEmergencyAPI } from './mockEmergencyAPI';

// Emergency Incidents Queries
export const useIncidents = (
  filters?: any,
  options?: UseQueryOptions<EmergencyIncident[], Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.incidentsList(filters),
    queryFn: () => mockEmergencyAPI.getIncidents(filters),
    staleTime: EMERGENCY_CACHE_CONFIG.INCIDENTS_STALE_TIME,
    refetchInterval: 30000, // Real-time updates every 30 seconds
    ...options,
  });
};

export const useIncidentDetails = (
  id: string,
  options?: UseQueryOptions<EmergencyIncident, Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.incidentDetails(id),
    queryFn: () => mockEmergencyAPI.getIncidentById(id),
    staleTime: EMERGENCY_CACHE_CONFIG.INCIDENTS_STALE_TIME,
    enabled: !!id,
    refetchInterval: 15000, // Frequent updates for active incidents
    ...options,
  });
};

export const useIncidentTimeline = (
  id: string,
  options?: UseQueryOptions<IncidentTimelineEntry[], Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.incidentTimeline(id),
    queryFn: () => mockEmergencyAPI.getIncidentTimeline(id),
    staleTime: EMERGENCY_CACHE_CONFIG.INCIDENTS_STALE_TIME,
    enabled: !!id,
    refetchInterval: 10000, // Very frequent updates for timeline
    ...options,
  });
};

export const useActiveIncidents = (
  options?: UseQueryOptions<EmergencyIncident[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'incidents', 'active'],
    queryFn: () => mockEmergencyAPI.getActiveIncidents(),
    staleTime: EMERGENCY_CACHE_CONFIG.INCIDENTS_STALE_TIME,
    refetchInterval: 15000, // Real-time monitoring
    ...options,
  });
};

export const useCriticalIncidents = (
  options?: UseQueryOptions<EmergencyIncident[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'incidents', 'critical'],
    queryFn: () => mockEmergencyAPI.getCriticalIncidents(),
    staleTime: EMERGENCY_CACHE_CONFIG.INCIDENTS_STALE_TIME,
    refetchInterval: 10000, // Very frequent for critical incidents
    ...options,
  });
};
