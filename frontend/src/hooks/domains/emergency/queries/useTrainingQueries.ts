import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  EMERGENCY_QUERY_KEYS,
  EMERGENCY_CACHE_CONFIG,
  EmergencyTraining,
} from '../config';
import { mockEmergencyAPI } from './mockEmergencyAPI';

// Emergency Training Queries
export const useTraining = (
  filters?: any,
  options?: UseQueryOptions<EmergencyTraining[], Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.trainingList(filters),
    queryFn: () => mockEmergencyAPI.getTraining(filters),
    staleTime: EMERGENCY_CACHE_CONFIG.TRAINING_STALE_TIME,
    ...options,
  });
};

export const useTrainingDetails = (
  id: string,
  options?: UseQueryOptions<EmergencyTraining, Error>
) => {
  return useQuery({
    queryKey: EMERGENCY_QUERY_KEYS.trainingDetails(id),
    queryFn: () => mockEmergencyAPI.getTrainingById(id),
    staleTime: EMERGENCY_CACHE_CONFIG.TRAINING_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

export const useUpcomingTraining = (
  userId: string,
  options?: UseQueryOptions<EmergencyTraining[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'training', 'upcoming', userId],
    queryFn: () => mockEmergencyAPI.getUpcomingTraining(userId),
    staleTime: EMERGENCY_CACHE_CONFIG.TRAINING_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};

export const useRequiredTraining = (
  userId: string,
  options?: UseQueryOptions<EmergencyTraining[], Error>
) => {
  return useQuery({
    queryKey: ['emergency', 'training', 'required', userId],
    queryFn: () => mockEmergencyAPI.getRequiredTraining(userId),
    staleTime: EMERGENCY_CACHE_CONFIG.TRAINING_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};
