import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  COMPLIANCE_QUERY_KEYS,
  COMPLIANCE_CACHE_CONFIG,
  RiskAssessment,
} from '../config';
import { useApiError } from '../../../shared/useApiError';

// Risk Assessment Queries
export const useRiskAssessments = (
  filters?: any,
  options?: UseQueryOptions<RiskAssessment[], Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.riskAssessmentsList(filters),
    queryFn: async () => {
      // Note: API doesn't have a specific method for risk assessments
      return [];
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.DEFAULT_STALE_TIME,
    onError: handleError,
    ...options,
  });
};

export const useRiskAssessmentDetails = (
  id: string,
  options?: UseQueryOptions<RiskAssessment, Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.riskAssessmentDetails(id),
    queryFn: async () => {
      // Note: API doesn't have a specific method for risk assessments
      return {} as RiskAssessment;
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!id,
    onError: handleError,
    ...options,
  });
};
