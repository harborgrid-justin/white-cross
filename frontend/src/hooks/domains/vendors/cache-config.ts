/**
 * Cache Configuration for Vendor Queries
 *
 * Stale times determine how long cached data remains fresh before TanStack Query
 * triggers a background refetch. Longer stale times reduce API calls for stable data.
 *
 * @module hooks/domains/vendors/cache-config
 *
 * @property {number} DEFAULT_STALE_TIME - 5 minutes for general queries
 * @property {number} VENDORS_STALE_TIME - 10 minutes for vendor data (moderate changes)
 * @property {number} CONTRACTS_STALE_TIME - 15 minutes for contracts (less volatile)
 * @property {number} EVALUATIONS_STALE_TIME - 30 minutes for evaluations (infrequent updates)
 *
 * @example
 * ```typescript
 * // Use in query configuration
 * useQuery({
 *   queryKey: vendorKeys.detail(vendorId),
 *   queryFn: () => fetchVendor(vendorId),
 *   staleTime: VENDORS_CACHE_CONFIG.VENDORS_STALE_TIME
 * });
 * ```
 *
 * @remarks
 * Stale time vs. Cache time:
 * - **Stale Time**: How long data is considered "fresh" (no refetch on mount/focus)
 * - **Cache Time**: How long unused data stays in memory (default: 5 minutes)
 *
 * Balance considerations:
 * - Shorter stale times = more API calls, fresher data
 * - Longer stale times = fewer API calls, potentially stale data
 * - Critical data (contracts, payments) uses longer stale times due to lower volatility
 *
 * @since 1.0.0
 */
export const VENDORS_CACHE_CONFIG = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  VENDORS_STALE_TIME: 10 * 60 * 1000, // 10 minutes
  CONTRACTS_STALE_TIME: 15 * 60 * 1000, // 15 minutes
  EVALUATIONS_STALE_TIME: 30 * 60 * 1000, // 30 minutes
} as const;
