import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  EMERGENCY_QUERY_KEYS,
  EMERGENCY_CACHE_CONFIG,
  EmergencyProcedure,
} from '../config';
import { mockEmergencyAPI } from './mockEmergencyAPI';

// Emergency Procedures Queries
export const useProcedures = (
  filters?: any,
  options?: UseQueryOptions<EmergencyProcedure[], Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.proceduresList(filters),
    queryFn: () => mockEmergencyAPI.getProcedures(filters),
    staleTime: EMERGENCY_CACHE_CONFIG.PROCEDURES_STALE_TIME,
    ...options,
  });
};

export const useProcedureDetails = (
  id: string,
  options?: UseQueryOptions<EmergencyProcedure, Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.procedureDetails(id),
    queryFn: () => mockEmergencyAPI.getProcedureById(id),
    staleTime: EMERGENCY_CACHE_CONFIG.PROCEDURES_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

export const useProceduresByCategory = (
  category: string,
  options?: UseQueryOptions<EmergencyProcedure[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'procedures', 'category', category],
    queryFn: () => mockEmergencyAPI.getProceduresByCategory(category),
    staleTime: EMERGENCY_CACHE_CONFIG.PROCEDURES_STALE_TIME,
    enabled: !!category,
    ...options,
  });
};
