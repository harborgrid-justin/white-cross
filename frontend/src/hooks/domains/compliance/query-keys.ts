/**
 * Query key factory for the compliance domain.
 *
 * Hierarchical query key structure for organizing TanStack Query cache keys
 * across audits, policies, training, incidents, and risk assessments. Enables
 * precise cache invalidation and efficient query coordination.
 *
 * @module hooks/domains/compliance/query-keys
 */

export const COMPLIANCE_QUERY_KEYS = {
  // Audits
  audits: ['compliance', 'audits'] as const,
  auditsList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.audits, 'list', filters] as const,
  auditDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.audits, 'detail', id] as const,
  auditReports: (auditId: string) => [...COMPLIANCE_QUERY_KEYS.audits, auditId, 'reports'] as const,

  // Compliance Reports
  reports: ['compliance', 'reports'] as const,
  reportsList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.reports, 'list', filters] as const,
  reportDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.reports, 'detail', id] as const,

  // Policies
  policies: ['compliance', 'policies'] as const,
  policiesList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.policies, 'list', filters] as const,
  policyDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.policies, 'detail', id] as const,
  policyVersions: (policyId: string) => [...COMPLIANCE_QUERY_KEYS.policies, policyId, 'versions'] as const,

  // Training
  training: ['compliance', 'training'] as const,
  trainingList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.training, 'list', filters] as const,
  trainingDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.training, 'detail', id] as const,
  userTraining: (userId: string) => [...COMPLIANCE_QUERY_KEYS.training, 'user', userId] as const,

  // Incidents
  incidents: ['compliance', 'incidents'] as const,
  incidentsList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.incidents, 'list', filters] as const,
  incidentDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.incidents, 'detail', id] as const,

  // Risk Assessments
  riskAssessments: ['compliance', 'risk-assessments'] as const,
  riskAssessmentsList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.riskAssessments, 'list', filters] as const,
  riskAssessmentDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.riskAssessments, 'detail', id] as const,
} as const;
