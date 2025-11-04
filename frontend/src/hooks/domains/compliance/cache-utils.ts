/**
 * Cache invalidation utilities for compliance domain.
 *
 * @module hooks/domains/compliance/cache-utils
 */

import { QueryClient } from '@tanstack/react-query';
import { COMPLIANCE_QUERY_KEYS } from './query-keys';

/**
 * Invalidates all compliance-related queries in the TanStack Query cache.
 *
 * Use this utility function to force a refetch of all compliance data after
 * major system changes or when you need to ensure complete cache freshness.
 */
export const invalidateComplianceQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['compliance'] });
};

/**
 * Invalidates all audit-related queries in the TanStack Query cache.
 */
export const invalidateAuditQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.audits });
};

/**
 * Invalidates all policy-related queries in the TanStack Query cache.
 */
export const invalidatePolicyQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.policies });
};

/**
 * Invalidates all training-related queries in the TanStack Query cache.
 */
export const invalidateTrainingQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.training });
};

/**
 * Invalidates all incident-related queries in the TanStack Query cache.
 */
export const invalidateIncidentQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.incidents });
};

/**
 * Invalidates all risk assessment-related queries in the TanStack Query cache.
 */
export const invalidateRiskAssessmentQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.riskAssessments });
};
