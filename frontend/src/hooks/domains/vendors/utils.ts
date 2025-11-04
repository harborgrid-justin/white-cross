/**
 * Utility Functions for Vendor Domain
 *
 * Helper functions for cache invalidation, scoring, and risk assessment.
 *
 * @module hooks/domains/vendors/utils
 *
 * @since 1.0.0
 */

import { QueryClient } from '@tanstack/react-query';
import { vendorKeys } from './query-keys';
import type { Vendor } from './types';

/**
 * Invalidates vendor-related queries in React Query cache.
 *
 * Helper function to invalidate all queries related to a specific vendor or
 * all vendor queries globally. Triggers refetch on next access.
 *
 * @param {QueryClient} queryClient - React Query client instance
 * @param {string} [vendorId] - Optional vendor ID for targeted invalidation
 *
 * @example
 * ```typescript
 * // Invalidate specific vendor after update
 * const { mutate } = useUpdateVendor();
 * mutate(vendorData, {
 *   onSuccess: () => {
 *     invalidateVendorQueries(queryClient, 'vendor-123');
 *   }
 * });
 *
 * // Invalidate all vendors after bulk operation
 * invalidateVendorQueries(queryClient);
 * ```
 *
 * @remarks
 * When vendorId provided:
 * - Invalidates vendor details
 * - Invalidates vendor contracts
 * - Invalidates vendor evaluations
 * - Invalidates vendor list (to update aggregate data)
 *
 * When vendorId omitted:
 * - Invalidates ALL vendor queries globally
 * - Use for bulk operations or system-wide updates
 *
 * @see {@link invalidateVendorContractQueries} for contract-specific invalidation
 */
export const invalidateVendorQueries = (queryClient: QueryClient, vendorId?: string) => {
  if (vendorId) {
    queryClient.invalidateQueries({ queryKey: vendorKeys.detail(vendorId) });
    queryClient.invalidateQueries({ queryKey: vendorKeys.contracts(vendorId) });
    queryClient.invalidateQueries({ queryKey: vendorKeys.evaluations(vendorId) });
  }
  queryClient.invalidateQueries({ queryKey: vendorKeys.all });
};

/**
 * Invalidates vendor contract queries in React Query cache.
 *
 * @param {QueryClient} queryClient - React Query client instance
 * @param {string} [vendorId] - Optional vendor ID for targeted invalidation
 */
export const invalidateVendorContractQueries = (queryClient: QueryClient, vendorId?: string) => {
  queryClient.invalidateQueries({ queryKey: vendorKeys.contracts(vendorId) });
  if (vendorId) {
    queryClient.invalidateQueries({ queryKey: vendorKeys.detail(vendorId) });
  }
};

/**
 * Calculates weighted vendor performance score.
 *
 * Combines multiple performance metrics into single score using weighted algorithm.
 * Score ranges from 0-5, with 5 being excellent performance.
 *
 * @param {Vendor} vendor - Vendor entity with performance metrics
 * @returns {number} Weighted performance score (0-5 scale)
 *
 * @example
 * ```typescript
 * const vendor: Vendor = {
 *   overallRating: 4.5,
 *   onTimeDeliveryRate: 0.95,  // 95%
 *   qualityRating: 4.8,
 *   // ... other fields
 * };
 *
 * const score = calculateVendorScore(vendor);
 * // Returns: 4.575 (weighted average)
 *
 * // Use for vendor comparison
 * const topVendors = vendors
 *   .sort((a, b) => calculateVendorScore(b) - calculateVendorScore(a))
 *   .slice(0, 5);
 * ```
 *
 * @remarks
 * **Weighting Algorithm:**
 * - Overall Rating: 40% (general satisfaction)
 * - On-Time Delivery Rate: 30% (reliability)
 * - Quality Rating: 30% (product/service quality)
 *
 * **Score Interpretation:**
 * - 4.5-5.0: Excellent (top-tier vendor)
 * - 4.0-4.5: Good (reliable vendor)
 * - 3.0-4.0: Average (meets expectations)
 * - Below 3.0: Poor (needs improvement or replacement)
 *
 * @see {@link getVendorRiskLevel} for risk classification based on score
 */
export const calculateVendorScore = (vendor: Vendor): number => {
  const weights = {
    overall: 0.4,
    delivery: 0.3,
    quality: 0.3
  };

  return (
    vendor.overallRating * weights.overall +
    vendor.onTimeDeliveryRate * weights.delivery +
    vendor.qualityRating * weights.quality
  );
};

/**
 * Determines vendor risk level based on performance score.
 *
 * Classifies vendors into risk categories based on their calculated performance
 * score. Used for risk management, compliance monitoring, and vendor selection.
 *
 * @param {Vendor} vendor - Vendor entity to assess
 * @returns {'LOW' | 'MEDIUM' | 'HIGH'} Risk classification
 *
 * @example
 * ```typescript
 * const vendor: Vendor = {
 *   overallRating: 3.5,
 *   onTimeDeliveryRate: 0.85,
 *   qualityRating: 3.8,
 *   // ... other fields
 * };
 *
 * const riskLevel = getVendorRiskLevel(vendor);
 * // Returns: 'MEDIUM' (score 3.575 falls in medium range)
 *
 * // Filter high-risk vendors for review
 * const highRiskVendors = vendors.filter(v =>
 *   getVendorRiskLevel(v) === 'HIGH'
 * );
 *
 * // Risk-based UI styling
 * const badgeColor = {
 *   LOW: 'green',
 *   MEDIUM: 'yellow',
 *   HIGH: 'red'
 * }[getVendorRiskLevel(vendor)];
 * ```
 *
 * @remarks
 * **Risk Classification Thresholds:**
 * - **LOW** (score >= 4.0): Trusted vendor, minimal oversight required
 * - **MEDIUM** (score 3.0-4.0): Standard vendor, regular monitoring needed
 * - **HIGH** (score < 3.0): At-risk vendor, requires immediate attention
 *
 * **Risk Management Actions:**
 * - LOW: Annual review, standard terms
 * - MEDIUM: Quarterly review, performance improvement plan
 * - HIGH: Monthly review, contract re-evaluation, find alternatives
 *
 * @see {@link calculateVendorScore} for underlying score calculation
 * @see {@link useVendorRiskAssessment} for comprehensive risk analysis
 */
export const getVendorRiskLevel = (vendor: Vendor): 'LOW' | 'MEDIUM' | 'HIGH' => {
  const score = calculateVendorScore(vendor);

  if (score >= 4.0) return 'LOW';
  if (score >= 3.0) return 'MEDIUM';
  return 'HIGH';
};
