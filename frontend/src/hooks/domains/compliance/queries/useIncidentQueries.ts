import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  COMPLIANCE_QUERY_KEYS,
  COMPLIANCE_CACHE_CONFIG,
  ComplianceIncident,
} from '../config';
import { useApiError } from '../../../shared/useApiError';

// Incident Queries
export const useIncidents = (
  filters?: any,
  options?: UseQueryOptions<ComplianceIncident[], Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.incidentsList(filters),
    queryFn: async () => {
      // Note: Incidents are handled through incidentReportsApi, not complianceApi
      return [];
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.INCIDENTS_STALE_TIME,
    onError: handleError,
    ...options,
  });
};

export const useIncidentDetails = (
  id: string,
  options?: UseQueryOptions<ComplianceIncident, Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.incidentDetails(id),
    queryFn: async () => {
      // Note: Incidents are handled through incidentReportsApi, not complianceApi
      return {} as ComplianceIncident;
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.INCIDENTS_STALE_TIME,
    enabled: !!id,
    onError: handleError,
    ...options,
  });
};
