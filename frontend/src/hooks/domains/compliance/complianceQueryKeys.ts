/**
 * Compliance Domain Query Keys
 *
 * Query key factory for the compliance domain. Hierarchical query key structure
 * for organizing TanStack Query cache keys across audits, policies, training,
 * incidents, and risk assessments. Enables precise cache invalidation and
 * efficient query coordination.
 *
 * @module hooks/domains/compliance/complianceQueryKeys
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @see {@link https://tanstack.com/query/latest/docs/react/guides/query-keys} TanStack Query Keys Guide
 */

/**
 * Query key factory for the compliance domain.
 *
 * Hierarchical query key structure for organizing TanStack Query cache keys
 * across audits, policies, training, incidents, and risk assessments. Enables
 * precise cache invalidation and efficient query coordination.
 *
 * @constant
 *
 * @property {Array<'compliance', 'audits'>} audits - Root key for all audit queries
 * @property {Function} auditsList - Factory for filtered audit list queries
 * @property {Function} auditDetails - Factory for specific audit details query
 * @property {Function} auditReports - Factory for audit reports query
 * @property {Array<'compliance', 'reports'>} reports - Root key for compliance reports
 * @property {Function} reportsList - Factory for filtered report list queries
 * @property {Function} reportDetails - Factory for specific report details query
 * @property {Array<'compliance', 'policies'>} policies - Root key for policy queries
 * @property {Function} policiesList - Factory for filtered policy list queries
 * @property {Function} policyDetails - Factory for specific policy details query
 * @property {Function} policyVersions - Factory for policy version history query
 * @property {Array<'compliance', 'training'>} training - Root key for training queries
 * @property {Function} trainingList - Factory for filtered training list queries
 * @property {Function} trainingDetails - Factory for specific training details query
 * @property {Function} userTraining - Factory for user-specific training records query
 * @property {Array<'compliance', 'incidents'>} incidents - Root key for incident queries
 * @property {Function} incidentsList - Factory for filtered incident list queries
 * @property {Function} incidentDetails - Factory for specific incident details query
 * @property {Array<'compliance', 'risk-assessments'>} riskAssessments - Root key for risk assessment queries
 * @property {Function} riskAssessmentsList - Factory for filtered risk assessment list queries
 * @property {Function} riskAssessmentDetails - Factory for specific risk assessment details query
 *
 * @example
 * ```typescript
 * // Invalidate all policies
 * queryClient.invalidateQueries({
 *   queryKey: COMPLIANCE_QUERY_KEYS.policies
 * });
 *
 * // Invalidate specific policy
 * queryClient.invalidateQueries({
 *   queryKey: COMPLIANCE_QUERY_KEYS.policyDetails(policyId)
 * });
 *
 * // Invalidate filtered audit list
 * queryClient.invalidateQueries({
 *   queryKey: COMPLIANCE_QUERY_KEYS.auditsList({ type: 'HIPAA', status: 'COMPLETED' })
 * });
 * ```
 *
 * @remarks
 * Query key hierarchy enables granular cache control:
 * - Invalidating root keys (e.g., `policies`) clears all related queries
 * - Invalidating list keys (e.g., `policiesList(filters)`) clears specific filtered views
 * - Invalidating detail keys (e.g., `policyDetails(id)`) clears single entity
 *
 * @see {@link COMPLIANCE_CACHE_CONFIG} for cache timing configuration
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
