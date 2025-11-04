/**
 * Vendor Evaluation Query Hooks
 *
 * Provides TanStack Query hooks for fetching vendor evaluation data including
 * individual evaluations and evaluation lists with filters.
 *
 * @module hooks/domains/vendors/queries/useVendorEvaluationQueries
 */

import { useQuery } from '@tanstack/react-query';
import { vendorKeys } from '../config';
import type { VendorEvaluation } from '../config';

/**
 * Fetches a single vendor evaluation by ID.
 *
 * @param {string} evaluationId - Unique evaluation identifier
 * @returns TanStack Query result with evaluation data and query states
 */
export const useVendorEvaluation = (evaluationId: string) => {
  return useQuery({
    queryKey: vendorKeys.evaluation(evaluationId),
    queryFn: async (): Promise<VendorEvaluation> => {
      const response = await fetch(`/api/vendor-evaluations/${evaluationId}`);
      if (!response.ok) throw new Error('Failed to fetch evaluation');
      return response.json();
    },
    enabled: !!evaluationId,
  });
};

/**
 * Fetches vendor evaluations with optional filters.
 *
 * @param {string} vendorId - Optional vendor ID to filter evaluations
 * @param {object} filters - Optional filters for evaluation type and year
 * @returns TanStack Query result with evaluation list and query states
 */
export const useVendorEvaluations = (vendorId?: string, filters?: {
  evaluationType?: 'ANNUAL' | 'PROJECT_BASED' | 'INCIDENT' | 'RENEWAL';
  year?: number;
}) => {
  return useQuery({
    queryKey: vendorKeys.evaluations(vendorId),
    queryFn: async (): Promise<VendorEvaluation[]> => {
      const params = new URLSearchParams();
      if (vendorId) params.append('vendorId', vendorId);
      if (filters?.evaluationType) params.append('evaluationType', filters.evaluationType);
      if (filters?.year) params.append('year', filters.year.toString());

      const response = await fetch(`/api/vendor-evaluations?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch evaluations');
      return response.json();
    },
  });
};
