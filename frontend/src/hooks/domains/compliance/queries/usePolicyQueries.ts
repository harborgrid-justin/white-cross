import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  COMPLIANCE_QUERY_KEYS,
  COMPLIANCE_CACHE_CONFIG,
  CompliancePolicy,
} from '../config';
import { complianceApi } from '@/services';
import { useApiError } from '../../../shared/useApiError';

// Policy Queries
export const usePolicies = (
  filters?: any,
  options?: UseQueryOptions<CompliancePolicy[], Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.policiesList(filters),
    queryFn: async () => {
      const response = await complianceApi.getPolicies(filters);
      return response.data.map((policy: any) => policy as CompliancePolicy);
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.POLICIES_STALE_TIME,
    onError: handleError,
    ...options,
  });
};

export const usePolicyDetails = (
  id: string,
  options?: UseQueryOptions<CompliancePolicy, Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.policyDetails(id),
    queryFn: async () => {
      const response = await complianceApi.getPolicies({ id });
      return response.data[0] as CompliancePolicy;
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.POLICIES_STALE_TIME,
    enabled: !!id,
    onError: handleError,
    ...options,
  });
};

export const usePolicyVersions = (
  policyId: string,
  options?: UseQueryOptions<CompliancePolicy[], Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.policyVersions(policyId),
    queryFn: async () => {
      // Note: API doesn't have a specific method for policy versions
      return [];
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.POLICIES_STALE_TIME,
    enabled: !!policyId,
    onError: handleError,
    ...options,
  });
};
