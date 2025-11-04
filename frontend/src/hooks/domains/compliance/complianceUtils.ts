/**
 * Compliance Domain Utility Functions
 *
 * Cache invalidation utilities for compliance-related queries in TanStack Query.
 * Provides granular control over cache invalidation for audits, policies, training,
 * incidents, and risk assessments.
 *
 * @module hooks/domains/compliance/complianceUtils
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { QueryClient } from '@tanstack/react-query';
import { COMPLIANCE_QUERY_KEYS } from './complianceQueryKeys';

/**
 * Invalidates all compliance-related queries in the TanStack Query cache.
 *
 * Use this utility function to force a refetch of all compliance data after
 * major system changes or when you need to ensure complete cache freshness.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * // Invalidate all compliance data after system update
 * import { invalidateComplianceQueries } from '@/hooks/domains/compliance/complianceUtils';
 *
 * const handleSystemUpdate = () => {
 *   invalidateComplianceQueries(queryClient);
 *   toast.success('Compliance data refreshed');
 * };
 * ```
 *
 * @remarks
 * This is a broad invalidation that affects all compliance queries including
 * audits, policies, training, incidents, and risk assessments. Use more specific
 * invalidation functions (like `invalidateAuditQueries`) when possible for better
 * performance.
 *
 * @see {@link invalidateAuditQueries} for audit-specific invalidation
 * @see {@link invalidatePolicyQueries} for policy-specific invalidation
 * @see {@link COMPLIANCE_QUERY_KEYS} for query key structure
 */
export const invalidateComplianceQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['compliance'] });
};

/**
 * Invalidates all audit-related queries in the TanStack Query cache.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * // Invalidate audits after creating new audit
 * const createAudit = async (auditData) => {
 *   await api.createAudit(auditData);
 *   invalidateAuditQueries(queryClient);
 * };
 * ```
 *
 * @see {@link COMPLIANCE_QUERY_KEYS} for audit query keys
 */
export const invalidateAuditQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.audits });
};

/**
 * Invalidates all policy-related queries in the TanStack Query cache.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * // Invalidate policies after policy approval
 * const approvePolicy = async (policyId) => {
 *   await api.approvePolicy(policyId);
 *   invalidatePolicyQueries(queryClient);
 * };
 * ```
 *
 * @see {@link COMPLIANCE_QUERY_KEYS} for policy query keys
 */
export const invalidatePolicyQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.policies });
};

/**
 * Invalidates all training-related queries in the TanStack Query cache.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * // Invalidate training after completion
 * const completeTraining = async (trainingId, userId) => {
 *   await api.completeTraining(trainingId, userId);
 *   invalidateTrainingQueries(queryClient);
 * };
 * ```
 *
 * @see {@link COMPLIANCE_QUERY_KEYS} for training query keys
 */
export const invalidateTrainingQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.training });
};

/**
 * Invalidates all incident-related queries in the TanStack Query cache.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * // Invalidate incidents after resolving incident
 * const resolveIncident = async (incidentId, resolution) => {
 *   await api.resolveIncident(incidentId, resolution);
 *   invalidateIncidentQueries(queryClient);
 * };
 * ```
 *
 * @see {@link COMPLIANCE_QUERY_KEYS} for incident query keys
 */
export const invalidateIncidentQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.incidents });
};

/**
 * Invalidates all risk assessment-related queries in the TanStack Query cache.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @example
 * ```typescript
 * // Invalidate risk assessments after approving assessment
 * const approveRiskAssessment = async (assessmentId) => {
 *   await api.approveRiskAssessment(assessmentId);
 *   invalidateRiskAssessmentQueries(queryClient);
 * };
 * ```
 *
 * @see {@link COMPLIANCE_QUERY_KEYS} for risk assessment query keys
 */
export const invalidateRiskAssessmentQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.riskAssessments });
};
