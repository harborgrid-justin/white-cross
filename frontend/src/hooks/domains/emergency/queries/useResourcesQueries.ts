import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  EMERGENCY_QUERY_KEYS,
  EMERGENCY_CACHE_CONFIG,
  EmergencyResource,
} from '../config';
import { mockEmergencyAPI } from './mockEmergencyAPI';

// Emergency Resources Queries
export const useResources = (
  filters?: any,
  options?: UseQueryOptions<EmergencyResource[], Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.resourcesList(filters),
    queryFn: () => mockEmergencyAPI.getResources(filters),
    staleTime: EMERGENCY_CACHE_CONFIG.RESOURCES_STALE_TIME,
    ...options,
  });
};

export const useResourceDetails = (
  id: string,
  options?: UseQueryOptions<EmergencyResource, Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.resourceDetails(id),
    queryFn: () => mockEmergencyAPI.getResourceById(id),
    staleTime: EMERGENCY_CACHE_CONFIG.RESOURCES_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

export const useAvailableResources = (
  type?: string,
  options?: UseQueryOptions<EmergencyResource[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'resources', 'available', type],
    queryFn: () => mockEmergencyAPI.getAvailableResources(type),
    staleTime: EMERGENCY_CACHE_CONFIG.RESOURCES_STALE_TIME,
    ...options,
  });
};

export const useResourcesByLocation = (
  locationId: string,
  options?: UseQueryOptions<EmergencyResource[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'resources', 'location', locationId],
    queryFn: () => mockEmergencyAPI.getResourcesByLocation(locationId),
    staleTime: EMERGENCY_CACHE_CONFIG.RESOURCES_STALE_TIME,
    enabled: !!locationId,
    ...options,
  });
};
