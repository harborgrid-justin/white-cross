import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  COMPLIANCE_QUERY_KEYS,
  COMPLIANCE_CACHE_CONFIG,
  ComplianceAudit,
} from '../config';
import { complianceApi } from '@/services';

// Audit Queries
export const useAudits = (
  filters?: any,
  options?: UseQueryOptions<ComplianceAudit[], Error>
) => {
  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.auditsList(filters),
    queryFn: async () => {
      const response = await complianceApi.getAuditLogs(filters);
      return response.data.map((log: any) => log as ComplianceAudit);
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.AUDITS_STALE_TIME,
    ...options,
  });
};

export const useAuditDetails = (
  id: string,
  options?: UseQueryOptions<ComplianceAudit, Error>
) => {
  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.auditDetails(id),
    queryFn: async () => {
      const response = await complianceApi.getAuditLogs({ id });
      return response.data[0] as ComplianceAudit;
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.AUDITS_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

export const useAuditReports = (
  auditId: string,
  options?: UseQueryOptions<any[], Error>
) => {
  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.auditReports(auditId),
    queryFn: async () => {
      // Note: API doesn't have a specific method for audit reports
      return [];
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.REPORTS_STALE_TIME,
    enabled: !!auditId,
    ...options,
  });
};
