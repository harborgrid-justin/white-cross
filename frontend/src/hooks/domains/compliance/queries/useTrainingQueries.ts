import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  COMPLIANCE_QUERY_KEYS,
  COMPLIANCE_CACHE_CONFIG,
  ComplianceTraining,
  UserTrainingRecord,
} from '../config';
import { useApiError } from '../../../shared/useApiError';

// Training Queries
export const useTraining = (
  filters?: any,
  options?: UseQueryOptions<ComplianceTraining[], Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.trainingList(filters),
    queryFn: async () => {
      // Note: Training is handled through administration API
      return [];
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.TRAINING_STALE_TIME,
    onError: handleError,
    ...options,
  });
};

export const useTrainingDetails = (
  id: string,
  options?: UseQueryOptions<ComplianceTraining, Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.trainingDetails(id),
    queryFn: async () => {
      // Note: Training is handled through administration API
      return {} as ComplianceTraining;
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.TRAINING_STALE_TIME,
    enabled: !!id,
    onError: handleError,
    ...options,
  });
};

export const useUserTraining = (
  userId: string,
  options?: UseQueryOptions<UserTrainingRecord[], Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.userTraining(userId),
    queryFn: async () => {
      // Note: Training is handled through administration API
      return [];
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.TRAINING_STALE_TIME,
    enabled: !!userId,
    onError: handleError,
    ...options,
  });
};
