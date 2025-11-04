import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  COMPLIANCE_QUERY_KEYS,
  COMPLIANCE_CACHE_CONFIG,
} from '../config';
import { complianceApi } from '@/services';
import { useApiError } from '../../../shared/useApiError';

// Compliance Dashboard Queries
export const useComplianceDashboard = (
  options?: UseQueryOptions<any, Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: ['compliance', 'dashboard'],
    queryFn: async () => {
      // Get data from compliance API
      const [audits, policies, incidents, training] = await Promise.all([
        complianceApi.getAuditLogs({ limit: 5 }).then(r => r.data),
        complianceApi.getPolicies({ limit: 5 }).then(r => r.data),
        Promise.resolve([]), // incidents handled elsewhere
        Promise.resolve([]), // training handled through administration API
      ]);

      return {
        recentAudits: audits,
        pendingPolicies: policies,
        openIncidents: incidents,
        requiredTraining: training,
        stats: {
          totalAudits: audits.length,
          activePolicies: policies.length,
          openIncidents: incidents.length,
          trainingCompliance: 85, // Mock percentage
        },
      };
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.DEFAULT_STALE_TIME,
    onError: handleError,
    ...options,
  });
};

// Compliance Statistics
export const useComplianceStats = (
  timeframe?: 'week' | 'month' | 'quarter' | 'year',
  options?: UseQueryOptions<any, Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: ['compliance', 'stats', timeframe],
    queryFn: async () => {
      // Mock statistics calculation
      return {
        auditStats: {
          completed: 12,
          inProgress: 3,
          scheduled: 8,
        },
        incidentStats: {
          total: 5,
          resolved: 3,
          investigating: 2,
        },
        trainingStats: {
          completionRate: 92,
          overdue: 8,
          expiringSoon: 15,
        },
        policyStats: {
          active: 45,
          underReview: 3,
          expired: 2,
        },
        riskStats: {
          high: 2,
          medium: 8,
          low: 15,
        },
      };
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.DEFAULT_STALE_TIME,
    onError: handleError,
    ...options,
  });
};

// Compliance Reports
export const useComplianceReports = (
  type?: 'audit' | 'incident' | 'training' | 'policy' | 'risk',
  filters?: any,
  options?: UseQueryOptions<any[], Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.reportsList({ type, ...filters }),
    queryFn: async () => {
      // Get reports from compliance API based on type
      switch (type) {
        case 'audit':
          return (await complianceApi.getAuditLogs(filters)).data;
        case 'incident':
          return []; // incidents handled elsewhere
        case 'training':
          return []; // training handled through administration API
        case 'policy':
          return (await complianceApi.getPolicies(filters)).data;
        case 'risk':
          return []; // risk assessments not available
        default:
          return [];
      }
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.REPORTS_STALE_TIME,
    onError: handleError,
    ...options,
  });
};
