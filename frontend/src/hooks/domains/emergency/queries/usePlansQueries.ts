import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  EMERGENCY_QUERY_KEYS,
  EMERGENCY_CACHE_CONFIG,
  EmergencyPlan,
} from '../config';
import { mockEmergencyAPI } from './mockEmergencyAPI';

// Emergency Plans Queries
export const useEmergencyPlans = (
  filters?: any,
  options?: UseQueryOptions<EmergencyPlan[], Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.emergencyPlansList(filters),
    queryFn: () => mockEmergencyAPI.getEmergencyPlans(filters),
    staleTime: EMERGENCY_CACHE_CONFIG.EMERGENCY_PLANS_STALE_TIME,
    ...options,
  });
};

export const useEmergencyPlanDetails = (
  id: string,
  options?: UseQueryOptions<EmergencyPlan, Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.emergencyPlanDetails(id),
    queryFn: () => mockEmergencyAPI.getEmergencyPlanById(id),
    staleTime: EMERGENCY_CACHE_CONFIG.EMERGENCY_PLANS_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

export const useActivePlans = (
  options?: UseQueryOptions<EmergencyPlan[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'plans', 'active'],
    queryFn: () => mockEmergencyAPI.getActivePlans(),
    staleTime: EMERGENCY_CACHE_CONFIG.EMERGENCY_PLANS_STALE_TIME,
    ...options,
  });
};
