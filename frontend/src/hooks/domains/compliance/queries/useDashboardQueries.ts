import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { serverGet } from '@/lib/api/server';
import { COMPLIANCE_ENDPOINTS, AUDIT_ENDPOINTS } from '@/constants/api/admin';
import {
  COMPLIANCE_QUERY_KEYS,
  COMPLIANCE_CACHE_CONFIG,
} from '../config';
import { useApiError } from '../../../shared/useApiError';

// Compliance Dashboard Queries
export const useComplianceDashboard = (
  options?: UseQueryOptions<any, Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: ['compliance', 'dashboard'],
    queryFn: async () => {
      try {
        // Get data from compliance API endpoints
        const [audits, policies, metrics] = await Promise.all([
          serverGet(AUDIT_ENDPOINTS.LOGS, { params: { limit: 5 } }),
          serverGet(COMPLIANCE_ENDPOINTS.POLICIES, { params: { limit: 5 } }),
          serverGet(COMPLIANCE_ENDPOINTS.METRICS),
        ]);

        return {
          recentAudits: audits.data,
          pendingPolicies: policies.data,
          openIncidents: [], // incidents handled elsewhere
          requiredTraining: [], // training handled through administration API
          stats: {
            totalAudits: audits.data?.length || 0,
            activePolicies: policies.data?.length || 0,
            openIncidents: 0,
            trainingCompliance: metrics.data?.trainingCompliance || 0,
          },
        };
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
    meta: {
      errorMessage: 'Failed to load compliance dashboard'
    },
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
      try {
        const response = await serverGet(COMPLIANCE_ENDPOINTS.METRICS, {
          params: { timeframe },
        });
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
    meta: {
      errorMessage: 'Failed to load compliance statistics'
    },
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
      try {
        let endpoint: string;
        let params: any = filters || {};

        // Get reports from compliance API endpoints based on type
        switch (type) {
          case 'audit':
            endpoint = AUDIT_ENDPOINTS.LOGS;
            break;
          case 'incident':
            // incidents handled elsewhere - return empty array for now
            return [];
          case 'training':
            endpoint = COMPLIANCE_ENDPOINTS.TRAINING;
            break;
          case 'policy':
            endpoint = COMPLIANCE_ENDPOINTS.POLICIES;
            break;
          case 'risk':
            // risk assessments not available - return empty array for now
            return [];
          default:
            endpoint = COMPLIANCE_ENDPOINTS.REPORTS;
        }

        const response = await serverGet(endpoint, { params });
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.REPORTS_STALE_TIME,
    ...options,
    meta: {
      errorMessage: 'Failed to load compliance reports'
    },
  });
};
