import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  COMPLIANCE_QUERY_KEYS,
  COMPLIANCE_CACHE_CONFIG,
  ComplianceAudit,
  CompliancePolicy,
  ComplianceTraining,
  ComplianceIncident,
  RiskAssessment,
  UserTrainingRecord,
} from '../config';
import { complianceApi } from '@/services';
import { useApiError } from '../../../shared/useApiError';

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

// Training Queries
export const useTraining = (
  filters?: any,
  options?: UseQueryOptions<ComplianceTraining[], Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.trainingList(filters),
    queryFn: () => mockComplianceAPI.getTraining(filters),
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
    queryFn: () => mockComplianceAPI.getTrainingById(id),
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
    queryFn: () => mockComplianceAPI.getUserTraining(userId),
    staleTime: COMPLIANCE_CACHE_CONFIG.TRAINING_STALE_TIME,
    enabled: !!userId,
    onError: handleError,
    ...options,
  });
};

// Incident Queries
export const useIncidents = (
  filters?: any,
  options?: UseQueryOptions<ComplianceIncident[], Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.incidentsList(filters),
    queryFn: () => mockComplianceAPI.getIncidents(filters),
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
    queryFn: () => mockComplianceAPI.getIncidentById(id),
    staleTime: COMPLIANCE_CACHE_CONFIG.INCIDENTS_STALE_TIME,
    enabled: !!id,
    onError: handleError,
    ...options,
  });
};

// Risk Assessment Queries
export const useRiskAssessments = (
  filters?: any,
  options?: UseQueryOptions<RiskAssessment[], Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.riskAssessmentsList(filters),
    queryFn: () => mockComplianceAPI.getRiskAssessments(filters),
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
    queryFn: () => mockComplianceAPI.getRiskAssessmentById(id),
    staleTime: COMPLIANCE_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!id,
    onError: handleError,
    ...options,
  });
};

// Compliance Dashboard Queries
export const useComplianceDashboard = (
  options?: UseQueryOptions<any, Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: ['compliance', 'dashboard'],
    queryFn: async () => {
      // Mock dashboard data aggregation
      const [audits, policies, incidents, training] = await Promise.all([
        mockComplianceAPI.getAudits({ limit: 5, status: 'IN_PROGRESS' }),
        mockComplianceAPI.getPolicies({ limit: 5, status: 'UNDER_REVIEW' }),
        mockComplianceAPI.getIncidents({ limit: 5, status: 'REPORTED' }),
        mockComplianceAPI.getTraining({ limit: 5, required: true }),
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
      // Mock report generation based on type
      switch (type) {
        case 'audit':
          return mockComplianceAPI.getAudits(filters);
        case 'incident':
          return mockComplianceAPI.getIncidents(filters);
        case 'training':
          return mockComplianceAPI.getTraining(filters);
        case 'policy':
          return mockComplianceAPI.getPolicies(filters);
        case 'risk':
          return mockComplianceAPI.getRiskAssessments(filters);
        default:
          return [];
      }
    },
    staleTime: COMPLIANCE_CACHE_CONFIG.REPORTS_STALE_TIME,
    onError: handleError,
    ...options,
  });
};
